'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Heart, Navigation2, Zap, TrendingUp, MapPin, Clock, Users, Flame, Droplet, Wind, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'

export function DashboardAlerts() {
  const [alerts, setAlerts] = useState([])
  const [dataFeeds, setDataFeeds] = useState([])
  const [activeTab, setActiveTab] = useState<'alerts' | 'feeds' | 'routes' | 'sos'>('alerts')
  const [showSOSForm, setShowSOSForm] = useState(false)
  const [sosMessage, setSosMessage] = useState('')
  const [sosType, setSosType] = useState('medical')
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  useEffect(() => {
    // Initialize with sample data
    const initialAlerts: Alert[] = [
      {
        id,
        type,
        title,
        message,
        timestamp) - 5 * 60000),
        priority,
        location,
        icon: <Droplet className="w-5 h-5" />,
      },
      {
        id,
        type,
        title,
        message,
        timestamp) - 15 * 60000),
        priority,
        location,
        icon: <Flame className="w-5 h-5" />,
      },
      {
        id,
        type,
        title,
        message,
        timestamp) - 30 * 60000),
        priority,
        location,
        icon: <Zap className="w-5 h-5" />,
      },
    ]

    const initialFeeds: DataFeed[] = [
      {
        id,
        label,
        value,
        trend,
        icon: <AlertCircle className="w-5 h-5" />,
        color,
      },
      {
        id,
        label,
        value,
        trend,
        icon: <Users className="w-5 h-5" />,
        color,
      },
      {
        id,
        label,
        value,
        trend,
        icon: <Zap className="w-5 h-5" />,
        color,
      },
      {
        id,
        label,
        value,
        unit,
        trend,
        icon: <Clock className="w-5 h-5" />,
        color,
      },
    ]

    setAlerts(initialAlerts)
    setDataFeeds(initialFeeds)
  }, [])

  const dismissAlert = (id) => {
    setDismissedAlerts([...dismissedAlerts, id])
    toast.success('Alert dismissed')
  }

  const markAlertAsRead = (id) => {
    toast.success('Alert marked as read')
  }

  const handleSOSSend = () => {
    if (!sosMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    toast.success('SOS alert sent to emergency contacts!')
    setSosMessage('')
    setShowSOSForm(false)
  }

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50'
      case 'high':
        return 'border-orange-500 bg-orange-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      default
    }
  }

  const getAlertTextColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-900'
      case 'high':
        return 'text-orange-900'
      case 'medium':
        return 'text-yellow-900'
      default
    }
  }

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id))

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Emergency Dashboard
          </h2>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800 sticky top-0 z-20">
        {['alerts', 'feeds', 'routes', 'sos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${
              activeTab === tab
                ? 'bg-orange-600 text-white border-b-2 border-orange-400'
                : 'text-gray-400 hover
            }`}
          >
            <span className="capitalize">
              {tab === 'sos' ? 'SOS Alert' : tab}
            </span>
            {tab === 'alerts' && visibleAlerts.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full inline-block">
                {visibleAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-96 max-h-96 overflow-y-auto">
        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {visibleAlerts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No active alerts</p>
              </div>
            ) : (
              visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.priority)} transition-all hover
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${getAlertTextColor(alert.priority)}`}>
                      {alert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-bold text-sm ${getAlertTextColor(alert.priority)}`}>
                            {alert.title}
                          </h3>
                          <p className={`text-xs mt-1 ${getAlertTextColor(alert.priority)} opacity-80`}>
                            {alert.message}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => markAlertAsRead(alert.id)}
                            className="px-2 py-1 bg-gray-300 hover
                          >
                            Mark
                          </button>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="px-2 py-1 bg-gray-300 hover
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                      {alert.location && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${getAlertTextColor(alert.priority)} opacity-70`}>
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${getAlertTextColor(alert.priority)} opacity-60`}>
                        {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)} min ago
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Data Feeds Tab */}
        {activeTab === 'feeds' && (
          <div className="space-y-3">
            {dataFeeds.map((feed) => (
              <div key={feed.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${feed.color} p-2 rounded-lg text-white`}>
                      {feed.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs">{feed.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-bold text-lg">{feed.value}</p>
                        {feed.unit && <span className="text-gray-500 text-xs">{feed.unit}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {feed.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                    {feed.trend === 'down' && <ArrowDown className="w-4 h-4 text-blue-500" />}
                    {feed.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                    <span className={`text-xs font-semibold ${
                      feed.trend === 'up' ? 'text-green-500' : 
                      feed.trend === 'down' ? 'text-blue-500' : 
                      'text-gray-500'
                    }`}>
                      {feed.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accessible Routes Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {[
                { name, difficulty, distance, time, accessibility,
                { name, difficulty, distance, time, accessibility,
                { name, difficulty, distance, time, accessibility,
              ].map((route, idx) => (
                <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-green-700 hover
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Navigation2 className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold text-white">{route.name}</h3>
                    </div>
                    <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full font-semibold">
                      {route.accessibility}% Accessible
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="text-white font-semibold">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-white font-semibold">{route.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <p className="text-white font-semibold">{route.difficulty}</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-green-600 hover
                    Navigate Route
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOS Alert Tab */}
        {activeTab === 'sos' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowSOSForm(!showSOSForm)}
              className="w-full p-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-bold flex flex-col items-center justify-center gap-3 transition transform hover:scale-105 active
            >
              <Heart className="w-8 h-8 fill-white animate-pulse" />
              <span className="text-xl">Send Emergency SOS</span>
            </button>

            {showSOSForm && (
              <div className="bg-gray-800 rounded-lg p-4 border border-red-600 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Emergency Type</label>
                  <select
                    value={sosType}
                    onChange={(e) => setSosType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire</option>
                    <option value="accident">Accident</option>
                    <option value="disaster">Natural Disaster</option>
                    <option value="police">Police Needed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Message (Required)</label>
                  <textarea
                    value={sosMessage}
                    onChange={(e) => setSosMessage(e.target.value)}
                    placeholder="Describe your emergency situation..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSOSSend}
                    className="flex-1 px-4 py-3 bg-red-600 hover
                  >
                    <Heart className="w-5 h-5" />
                    Send SOS
                  </button>
                  <button
                    onClick={() => setShowSOSForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
              <h3 className="font-bold text-blue-200 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full py-2 px-3 bg-blue-700 hover
                  Call Emergency (911)
                </button>
                <button className="w-full py-2 px-3 bg-blue-700 hover
                  Share Location with Contacts
                </button>
                <button className="w-full py-2 px-3 bg-blue-700 hover
                  Request Immediate Assistance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live Updates Enabled</span>
        </div>
        <button className="text-gray-500 hover
          Settings
        </button>
      </div>
    </div>
  )
}
