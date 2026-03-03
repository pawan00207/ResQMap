'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, MapPin, Star, Clock, Phone, Filter } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface LocalResource {
  id: string
  name: string
  category: string
  address: string
  phone: string
  description: string
  is_open_now: boolean
  rating: number
  latitude: number
  longitude: number
}

export default function ResourcesPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [resources, setResources] = useState<LocalResource[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    'Pharmacy',
    'Shelter',
    'Food',
    'Water',
    'Medical',
    'Supply',
    'Communication',
    'Transport',
  ]

  useEffect(() => {
    if (location) {
      fetchResources()
    }
  }, [location])

  const fetchResources = async () => {
    if (!location) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        radius: '5000',
      })
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/resources?${params}`)
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const markers = resources.map((resource) => ({
    position: [resource.latitude, resource.longitude] as [number, number],
    title: resource.name,
    type: 'resource' as const,
    description: `${resource.category} - ${resource.address}\n${resource.phone}\nRating: ${resource.rating}/5`,
  }))

  return (
    <>
      <Navigation />
      <main className="flex flex-col h-screen bg-gray-100">
        {/* Header with Filters */}
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Local Resources</h1>
            <div className="flex flex-wrap gap-2 overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setResources([])
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setResources([])
                  }}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {geoLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Getting your location...</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <ResQMap markers={markers} />
            </Suspense>
          )}
        </div>

        {/* Resources List */}
        <div className="bg-white border-t max-h-48 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <h2 className="font-semibold mb-3">Found {resources.length} resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {resources.slice(0, 6).map((resource) => (
                <div key={resource.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{resource.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold">{resource.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{resource.category}</p>
                    <p className="text-xs text-gray-600 mb-2">{resource.address}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Phone className="w-3 h-3" />
                      {resource.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className={`text-xs ${resource.is_open_now ? 'text-green-600' : 'text-red-600'}`}>
                        {resource.is_open_now ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
