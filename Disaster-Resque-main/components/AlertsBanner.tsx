'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'

interface Alert {
  id: string
  title: string
  description: string
  severity: string
  alert_type: string
}

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [visibleAlerts, setVisibleAlerts] = useState<string[]>([])
  const { location } = useGeolocation()

  useEffect(() => {
    if (!location) return

    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `/api/alerts?lat=${location.latitude}&lng=${location.longitude}`
        )
        if (response.ok) {
          const data = await response.json()
          setAlerts(data)
          // Show first 3 alerts
          setVisibleAlerts(data.slice(0, 3).map((a: Alert) => a.id))
        }
      } catch (error) {
        console.error('Error fetching alerts:', error)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [location])

  const closeAlert = (id: string) => {
    setVisibleAlerts(visibleAlerts.filter(a => a !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-900'
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-900'
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900'
      default:
        return 'bg-blue-100 border-blue-500 text-blue-900'
    }
  }

  return (
    <div className="space-y-2 p-4">
      {alerts
        .filter(a => visibleAlerts.includes(a.id))
        .map(alert => (
          <div
            key={alert.id}
            className={`border-l-4 p-3 rounded flex items-start justify-between ${getSeverityColor(
              alert.severity
            )}`}
          >
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm">{alert.description}</p>
              </div>
            </div>
            <button
              onClick={() => closeAlert(alert.id)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
    </div>
  )
}
