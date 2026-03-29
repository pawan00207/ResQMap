'use client'

import { useState, useEffect } from 'react'
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react'

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const mockNotifications = [
      { id, type, message, timestamp) - 2 * 60000) },
      { id, type, message, timestamp) - 5 * 60000) },
      { id, type, message, timestamp) - 10 * 60000) },
    ]
    setNotifications(mockNotifications)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No notifications</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notif => (
                <div key={notif.id} className="p-4 hover
                  <div className="flex-shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((Date.now() - notif.timestamp.getTime()) / 60000)}m ago
                    </p>
                  </div>
                  <button 
                    onClick={() => removeNotification(notif.id)}
                    className="flex-shrink-0 text-gray-400 hover
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
