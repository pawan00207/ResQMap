'use client'

import { useState } from 'react'
import { AlertCircle, MapPin, MessageSquare } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'

export function ReportForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    report_type: 'accident',
    title: '',
    description: '',
  })
  const [success, setSuccess] = useState(false)
  const { location } = useGeolocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) {
      alert('Location is required to submit a report')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ report_type: 'accident', title: '', description: '' })
        setTimeout(() => {
          setSuccess(false)
          setIsOpen(false)
        }, 2000)
      } else {
        alert('Failed to submit report')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Error submitting report')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
        <p className="font-semibold">Thank you! Report submitted successfully.</p>
      </div>
    )
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2 z-40"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Report Issue</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                Report an Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Issue Type</label>
                  <select
                    value={formData.report_type}
                    onChange={(e) =>
                      setFormData({ ...formData, report_type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="accident">Accident</option>
                    <option value="flood">Flood</option>
                    <option value="blockage">Road Blockage</option>
                    <option value="debris">Debris/Hazard</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Brief description"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Details</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the issue in detail"
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Location: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Getting...'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading || !location}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
