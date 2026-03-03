'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, Hospital, Shield, Flame, Filter, Phone, MapPin, Clock, ArrowRight } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface EmergencyService {
  id: string
  name: string
  service_type: 'hospital' | 'police' | 'fire'
  address: string
  phone: string
  is_24_hours: boolean
  latitude: number
  longitude: number
}

export default function MapPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [services, setServices] = useState<EmergencyService[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<'all' | 'hospital' | 'police' | 'fire'>('all')
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5000)

  useEffect(() => {
    if (location) {
      fetchServices()
      const interval = setInterval(fetchServices, 30000)
      return () => clearInterval(interval)
    }
  }, [location])

  const fetchServices = async () => {
    if (!location) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        radius: searchRadius.toString(),
        ...(selectedType !== 'all' && { type: selectedType }),
      })

      const response = await fetch(`/api/emergency-services?${params}`)
      const data = await response.json()
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = selectedType === 'all'
    ? services
    : services.filter(s => s.service_type === selectedType)

  const getServiceIcon = (type: 'hospital' | 'police' | 'fire') => {
    switch (type) {
      case 'hospital':
        return <Hospital className="w-5 h-5" />
      case 'police':
        return <Shield className="w-5 h-5" />
      case 'fire':
        return <Flame className="w-5 h-5" />
    }
  }

  const getServiceColor = (type: 'hospital' | 'police' | 'fire') => {
    switch (type) {
      case 'hospital':
        return 'bg-red-100 text-red-600 border-red-300'
      case 'police':
        return 'bg-blue-100 text-blue-600 border-blue-300'
      case 'fire':
        return 'bg-orange-100 text-orange-600 border-orange-300'
    }
  }

  const getButtonColor = (type: 'hospital' | 'police' | 'fire') => {
    switch (type) {
      case 'hospital':
        return 'bg-red-500 hover:bg-red-600'
      case 'police':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'fire':
        return 'bg-orange-500 hover:bg-orange-600'
    }
  }

  const typeFilters = [
    { id: 'all', label: 'All Services', icon: Filter },
    { id: 'hospital', label: 'Hospitals', icon: Hospital },
    { id: 'police', label: 'Police', icon: Shield },
    { id: 'fire', label: 'Fire Stations', icon: Flame },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="bg-gradient-to-r from-red-50 to-red-100 py-8 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Services Map</h1>
            <p className="text-gray-700">Find nearby hospitals, police stations, and fire departments</p>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition transform hover:scale-105"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            {geoLoading && <span className="text-sm text-gray-600 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Getting location...</span>}
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 animate-fade-in">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="1000"
                    value={searchRadius}
                    onChange={(e) => {
                      setSearchRadius(Number(e.target.value))
                      setSelectedType('all')
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-700 min-w-fit">{(searchRadius / 1000).toFixed(1)} km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {typeFilters.map((filter) => {
                    const Icon = filter.icon
                    const isSelected = selectedType === filter.id
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedType(filter.id as any)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
                          isSelected
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs md:text-sm">{filter.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Map and Services */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>}>
                  <ResQMap
                    center={location ? [location.latitude, location.longitude] : [40.7128, -74.006]}
                    zoom={14}
                    markers={filteredServices.map((service) => ({
                      position: [service.latitude, service.longitude],
                      title: service.name,
                      type: 'emergency',
                      description: service.address,
                    }))}
                  />
                </Suspense>
              </div>
            </div>

            {/* Services List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {filteredServices.length}
                </span>
                Services Found
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No services found in this radius</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 animate-fade-in ${
                        selectedService?.id === service.id
                          ? `${getServiceColor(service.service_type)} border-opacity-100 shadow-lg`
                          : `${getServiceColor(service.service_type)} border-opacity-50 hover:border-opacity-100`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getServiceIcon(service.service_type)}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">{service.address}</p>
                          </div>
                        </div>
                        {service.is_24_hours && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">24/7</span>
                        )}
                      </div>

                      {selectedService?.id === service.id && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-30 space-y-2 animate-fade-in">
                          <a
                            href={`tel:${service.phone}`}
                            className={`flex items-center justify-center gap-2 w-full py-2 text-white font-semibold rounded-lg transition transform hover:scale-105 ${getButtonColor(service.service_type)}`}
                          >
                            <Phone className="w-4 h-4" />
                            Call Now
                          </a>
                          <button className="flex items-center justify-center gap-2 w-full py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition">
                            <ArrowRight className="w-4 h-4" />
                            Get Directions
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-blue-50 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Response Times</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <Hospital className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Hospitals</h3>
                <p className="text-sm text-gray-600">Average response time: 5-15 minutes</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Police</h3>
                <p className="text-sm text-gray-600">Average response time: 3-10 minutes</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <Flame className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fire Department</h3>
                <p className="text-sm text-gray-600">Average response time: 2-8 minutes</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
