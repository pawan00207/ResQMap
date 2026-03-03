'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, Navigation2, Plus } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface AccessibilityRoute {
  id: string
  name: string
  description: string
  accessibility_features: string[]
  accessibility_type: string
  difficulty_level: string
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
}

export default function AccessibilityPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [routes, setRoutes] = useState<AccessibilityRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (location) {
      fetchRoutes()
    }
  }, [location])

  const fetchRoutes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/accessibility-routes')
      const data = await response.json()
      setRoutes(data)
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const markers = routes.map((route) => ({
    position: [route.start_latitude, route.start_longitude] as [number, number],
    title: route.name,
    type: 'default' as const,
    description: `${route.accessibility_type} - ${route.description}`,
  }))

  return (
    <>
      <Navigation />
      <main className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Accessible Routes</h1>
                <p className="text-gray-600">Find barrier-free routes with accessibility features</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Report Route
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-blue-50 border-b p-4">
            <div className="max-w-7xl mx-auto">
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                setShowForm(false)
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Route name" className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Description" className="px-3 py-2 border rounded-lg" />
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Wheelchair Accessible</option>
                    <option>Blind Friendly</option>
                    <option>Low Mobility</option>
                  </select>
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Challenging</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Submit Route
                </button>
              </form>
            </div>
          </div>
        )}

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

        {/* Routes List */}
        <div className="bg-white border-t max-h-48 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <h2 className="font-semibold mb-3">Available Routes ({routes.length})</h2>
            <div className="space-y-2">
              {routes.slice(0, 6).map((route) => (
                <div key={route.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Navigation2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{route.name}</h3>
                      <p className="text-xs text-gray-600">{route.description}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {route.accessibility_features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
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
