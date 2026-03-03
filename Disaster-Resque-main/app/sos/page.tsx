'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, Heart, AlertCircle, CheckCircle, X, Send, MapPin, Phone } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface SOSAlert {
  id: string
  user_id: string
  emergency_type: string
  latitude: number
  longitude: number
  description: string
  severity: string
  status: string
  created_at: string
  emergency_contacts: string[]
}

export default function SOSPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [activeAlert, setActiveAlert] = useState<SOSAlert | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([''])
  const [emergencyType, setEmergencyType] = useState('medical')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [submitted, setSubmitted] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sos-alerts?status=active')
      const data = await response.json()
      setAlerts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitSOS = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      alert('Location not available')
      return
    }

    setPulseEffect(true)
    setLoading(true)
    try {
      const response = await fetch('/api/sos-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user_' + Math.random().toString(36),
          emergency_type: emergencyType,
          latitude: location.latitude,
          longitude: location.longitude,
          description,
          emergency_contacts: emergencyContacts.filter(c => c),
          severity,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit SOS')
      
      setSubmitted(true)
      setShowForm(false)
      setTimeout(() => {
        setSubmitted(false)
        fetchAlerts()
      }, 3000)
    } catch (error) {
      console.error('Error submitting SOS:', error)
      alert('Failed to send SOS alert')
    } finally {
      setLoading(false)
      setPulseEffect(false)
    }
  }

  const emergencyTypeOptions = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'accident', label: 'Accident' },
    { value: 'fire', label: 'Fire' },
    { value: 'police', label: 'Police Needed' },
    { value: 'natural_disaster', label: 'Natural Disaster' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency SOS Alert</h1>
            <p className="text-xl text-gray-600 mb-8">Instantly share your location with emergency responders and your emergency contacts</p>
          </div>
        </section>

        {/* Success Message */}
        {submitted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-bounce">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">SOS Alert Sent Successfully!</p>
                <p className="text-sm text-green-700">Emergency responders have been notified of your location</p>
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>}>
              <ResQMap
                markers={alerts.map((alert) => ({
                  position: [alert.latitude, alert.longitude],
                  title: alert.emergency_type.replace('_', ' '),
                  type: 'emergency',
                  description: alert.description,
                }))}
              />
            </Suspense>
          </div>
        </section>

        {/* SOS Form & Active Alerts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* SOS Form */}
            <div className="md:col-span-1">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`w-full p-8 rounded-lg font-semibold text-white flex flex-col items-center justify-center gap-3 mb-6 transition-all transform hover:scale-105 ${
                  pulseEffect ? 'animate-pulse bg-red-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                <Heart className="w-8 h-8 fill-white" />
                <span className="text-lg">SEND SOS</span>
              </button>

              {showForm && (
                <form onSubmit={handleSubmitSOS} className="bg-white border-2 border-red-200 rounded-lg p-6 space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Type</label>
                    <select
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {emergencyTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSeverity(level)}
                          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${
                            severity === level
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your emergency..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contacts</label>
                    <div className="space-y-2">
                      {emergencyContacts.map((contact, idx) => (
                        <input
                          key={idx}
                          type="email"
                          placeholder="Email or phone"
                          value={contact}
                          onChange={(e) => {
                            const newContacts = [...emergencyContacts]
                            newContacts[idx] = e.target.value
                            setEmergencyContacts(newContacts)
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmergencyContacts([...emergencyContacts, ''])}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                    >
                      + Add Contact
                    </button>
                  </div>

                  {location && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || geoLoading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    Send Emergency Alert
                  </button>
                </form>
              )}
            </div>

            {/* Active Alerts List */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Alerts</h2>
              {alerts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No active emergency alerts in your area</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, idx) => (
                    <div
                      key={alert.id || idx}
                      onClick={() => setActiveAlert(activeAlert?.id === alert.id ? null : alert)}
                      className="bg-white border-2 border-red-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 animate-fade-in"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                            <h3 className="font-semibold text-gray-900">{alert.emergency_type.replace('_', ' ')}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              alert.severity === 'high' ? 'bg-red-500 text-white' :
                              alert.severity === 'medium' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-white'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                            </span>
                            <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          alert.status === 'active' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {activeAlert?.id === alert.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                          <p className="text-sm text-gray-600 mb-3"><strong>Assigned Contacts:</strong></p>
                          <div className="flex flex-wrap gap-2">
                            {alert.emergency_contacts.map((contact, i) => (
                              <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {contact}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-blue-50 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-gray-900 mb-2">1. Stay Calm</h3>
                <p className="text-gray-600 text-sm">Take deep breaths and assess your situation before sending an SOS alert</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-gray-900 mb-2">2. Provide Details</h3>
                <p className="text-gray-600 text-sm">Give as much information as possible about your emergency to help responders</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-gray-900 mb-2">3. Stay in Location</h3>
                <p className="text-gray-600 text-sm">If safe, remain in your current location so responders can find you easily</p>
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
