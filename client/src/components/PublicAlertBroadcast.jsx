'use client'

import { useState } from 'react'
import { Megaphone, Radio, MessageSquare, Clock, MapPin, Send } from 'lucide-react'

export function PublicAlertBroadcast() {
  const [alerts, setAlerts] = useState([
    {
      id,
      title,
      message,
      severity,
      channels, 'push', 'radio', 'sirens'],
      area,
      radius,
      latitude,
      longitude,
      createdAt).toISOString(),
      expiresAt) + 3600000).toISOString(),
      recipientsReached,
    },
    {
      id,
      title,
      message,
      severity,
      channels, 'email', 'push'],
      area,
      radius,
      latitude,
      longitude,
      createdAt) - 1800000).toISOString(),
      expiresAt) + 1800000).toISOString(),
      recipientsReached,
    },
  ])

  const [selectedAlert, setSelectedAlert] = useState(alerts[0])
  const [isCreating, setIsCreating] = useState(false)
  const [newAlert, setNewAlert] = useState({
    title,
    message,
    severity,
    area,
    radius,
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900 text-red-200'
      case 'warning':
        return 'bg-yellow-900 text-yellow-200'
      default
    }
  }

  const createAlert = () => {
    if (!newAlert.title || !newAlert.message) return

    const alert: Alert = {
      id{Date.now()}`,
      title,
      message,
      severity,
      channels, 'push', 'radio'],
      area,
      radius,
      latitude,
      longitude,
      createdAt).toISOString(),
      expiresAt) + 3600000).toISOString(),
      recipientsReached) * 20000) + 5000,
    }

    setAlerts([alert, ...alerts])
    setSelectedAlert(alert)
    setIsCreating(false)
    setNewAlert({ title, message, severity, area, radius)
  }

  const broadcastAlert = (alert) => {
    console.log('[v0] Broadcasting alert, alert)
    // In production, trigger actual broadcast via APIs
    alert.recipientsReached = Math.floor(Math.random() * 50000) + 10000
    alert.channels.forEach(ch => {
      console.log(`[v0] Sending via ${ch}`)
    })
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 flex gap-4">
      {/* Alerts List */}
      <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-bold">Public Alerts</h2>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-red-600 hover
          >
            {isCreating ? 'Cancel' : 'New Alert'}
          </button>
        </div>

        {/* Create Alert Form */}
        {isCreating && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Alert Title"
              value={newAlert.title}
              onChange={(e) => setNewAlert({ ...newAlert, title)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-sm text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Alert Message"
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-sm text-white placeholder-gray-400 h-20 resize-none"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Area/Location"
                value={newAlert.area}
                onChange={(e) => setNewAlert({ ...newAlert, area)}
                className="flex-1 bg-gray-600 px-3 py-2 rounded text-sm text-white placeholder-gray-400"
              />
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity)}
                className="bg-gray-600 px-3 py-2 rounded text-sm text-white"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <button
              onClick={createAlert}
              className="w-full bg-red-600 hover
            >
              <Send className="w-4 h-4" /> Broadcast
            </button>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {alerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`p-3 rounded-lg cursor-pointer transition border-l-4 ${
                selectedAlert?.id === alert.id
                  ? 'bg-red-700 border-red-400'
                  : `${getSeverityColor(alert.severity)} border-opacity-30 hover
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{alert.title}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs opacity-75 line-clamp-2">{alert.message}</p>
              <p className="text-xs opacity-50 mt-1">{alert.recipientsReached.toLocaleString()} recipients</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Details */}
      {selectedAlert && (
        <div className="w-96 bg-gray-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{selectedAlert.title}</h3>

          {/* Message */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-300 mb-2">Message</p>
            <div className="bg-gray-700 p-3 rounded text-sm text-gray-200">
              {selectedAlert.message}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <p className="text-gray-400">Severity</p>
              <p className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${getSeverityColor(selectedAlert.severity)}`}>
                {selectedAlert.severity.toUpperCase()}
              </p>
            </div>

            <div className="text-sm">
              <p className="text-gray-400 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Coverage
              </p>
              <p className="text-white">{selectedAlert.area} ({selectedAlert.radius}km radius)</p>
            </div>

            <div className="text-sm">
              <p className="text-gray-400 flex items-center gap-1">
                <Radio className="w-4 h-4" /> Channels
              </p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {selectedAlert.channels.map(ch => (
                  <span key={ch} className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {ch.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-sm">
              <p className="text-gray-400 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" /> Recipients
              </p>
              <p className="font-mono text-green-400">{selectedAlert.recipientsReached.toLocaleString()} reached</p>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Created).toLocaleString()}
              </p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expires).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => broadcastAlert(selectedAlert)}
            className="w-full bg-red-600 hover
          >
            <Megaphone className="w-4 h-4" /> Rebroadcast
          </button>
          <button className="w-full bg-gray-700 hover
            Edit
          </button>
        </div>
      )}
    </div>
  )
}
