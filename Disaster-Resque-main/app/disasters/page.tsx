'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, AlertTriangle, Plus, TrendingUp } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface DisasterEvent {
  id: string
  title: string
  disaster_type: string
  latitude: number
  longitude: number
  severity: 'low' | 'medium' | 'high'
  affected_area_radius: number
  status: string
  description: string
  resources_needed: string[]
  created_at: string
}

export default function DisastersPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (location) {
      fetchDisasters()
    }
  }, [location])

  const fetchDisasters = async () => {
    if (!location) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        radius: '25000',
      })

      const response = await fetch(`/api/disasters?${params}`)
      const data = await response.json()
      setDisasters(data)
    } catch (error) {
      console.error('Error fetching disasters:', error)
    } finally {
      setLoading(false)
    }
  }

  const disasterZones = disasters.map((disaster) => ({
    position: [disaster.latitude, disaster.longitude] as [number, number],
    radius: disaster.affected_area_radius,
    title: disaster.title,
    severity: disaster.severity,
  }))

  const severityColor = {
    low: 'text-yellow-600 bg-yellow-50',
    medium: 'text-orange-600 bg-orange-50',
    high: 'text-red-600 bg-red-50',
  }

  const severityBorder = {
    low: 'border-yellow-200',
    medium: 'border-orange-200',
    high: 'border-red-200',
  }

  return (
    <>
      <Navigation />
      <main className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Disaster Dashboard</h1>
                <p className="text-gray-600">Real-time disaster tracking and resource coordination</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                Report Disaster
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-orange-50 border-b p-4">
            <div className="max-w-7xl mx-auto">
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                setShowForm(false)
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Disaster title" className="px-3 py-2 border rounded-lg" />
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Natural Disaster</option>
                    <option>Man-made</option>
                    <option>Infrastructure</option>
                    <option>Health Crisis</option>
                  </select>
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <input type="text" placeholder="Affected area radius (km)" className="px-3 py-2 border rounded-lg" />
                </div>
                <textarea placeholder="Description and resources needed" className="w-full px-3 py-2 border rounded-lg" />
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Active Disasters</p>
              <p className="text-2xl font-bold text-red-600">{disasters.filter(d => d.status === 'active').length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">High Severity</p>
              <p className="text-2xl font-bold text-orange-600">{disasters.filter(d => d.severity === 'high').length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Nearby Events</p>
              <p className="text-2xl font-bold">{disasters.length}</p>
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
              <ResQMap disasters={disasterZones} />
            </Suspense>
          )}
        </div>

        {/* Disasters List */}
        <div className="bg-white border-t max-h-48 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <h2 className="font-semibold mb-3">Active Disasters ({disasters.length})</h2>
            <div className="space-y-2">
              {disasters.slice(0, 5).map((disaster) => (
                <div
                  key={disaster.id}
                  className={`p-3 border rounded-lg ${severityBorder[disaster.severity]}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-1 ${severityColor[disaster.severity].split(' ')[0]}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm">{disaster.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${severityColor[disaster.severity]}`}>
                          {disaster.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{disaster.description}</p>
                      {disaster.resources_needed && disaster.resources_needed.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {disaster.resources_needed.slice(0, 3).map((res, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {res}
                            </span>
                          ))}
                        </div>
                      )}
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
