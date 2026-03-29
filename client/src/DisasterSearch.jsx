'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, AlertCircle, History, X, Loader2 } from 'lucide-react'
import { searchAllSources, SearchResult } from '@/lib/search-utils'
import { useMapStore } from '@/store/mapStore'
import { toast } from 'react-hot-toast'

export function DisasterSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { setFlyToTarget } = useMapStore()
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setLoading(true)
        const res = await searchAllSources(searchTerm)
        setResults(res)
        setLoading(false)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [searchTerm])

  const handleSelectResult = (result) => {
    setFlyToTarget([result.lat, result.lng])
    setShowResults(false)
    toast.success(`Navigating to ${result.title} — ${result.category}`)
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
        <Input 
          placeholder="Search India disasters, states, districts..." 
          className="pl-10 h-9 bg-gray-900/80 border-gray-800 text-xs text-white backdrop-blur shadow-lg focus:border-red-500/50 transition-all rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-400 hover
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-11 left-0 w-full bg-gray-950/95 border-gray-800 text-white backdrop-blur shadow-2xl z-[1001] animate-in fade-in slide-in-from-top-2">
          <CardContent className="p-0 overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                <p className="text-xs font-bold animate-pulse">Scanning official data sources...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
                {/* Result Categories */}
                {['Active Incidents', 'India Disasters', 'States', 'Districts'].map((category) => {
                  const categoryResults = results.filter(r => r.category === category)
                  if (categoryResults.length === 0) return null

                  return (
                    <div key={category} className="pb-2">
                      <h4 className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900/50 border-y border-gray-900/50 mb-1 sticky top-0 backdrop-blur">
                        {category}
                      </h4>
                      {categoryResults.map((res) => (
                        <button
                          key={res.id}
                          className="w-full px-4 py-3 text-left hover:bg-red-500/10 border-b border-gray-900/50 transition-all group flex items-start gap-3"
                          onClick={() => handleSelectResult(res)}
                        >
                          <div className={`p-1.5 rounded-lg ${
                            res.category === 'Active Incidents' ? 'bg-red-500/20 text-red-500' : 
                            res.category === 'India Disasters' ? 'bg-orange-500/20 text-orange-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-sm font-bold truncate group-hover{res.title}</span>
                              {res.severity && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                  res.severity === 'critical' ? 'bg-red-950/50 border-red-500 text-red-500' : 'bg-yellow-950/50 border-yellow-500 text-yellow-500'
                                }`}>
                                  {res.severity.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                              <span>Source{res.source || 'Official Database'}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-700" />
                              <span>Last sync: 2 min ago</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500 opacity-50">
                <AlertCircle className="w-12 h-12" />
                <p className="text-sm font-bold uppercase tracking-widest">No matching disasters found</p>
                <p className="text-xs">Refine your search criteria</p>
              </div>
            )}
          </CardContent>
          {results.length > 0 && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span>{results.length} tactical results found</span>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">ESC</kbd> Close</span>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
