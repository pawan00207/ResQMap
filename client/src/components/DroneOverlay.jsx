'use client'

import { useState, useEffect } from 'react'
import { Plane, Video, Signal, Battery, MapPin } from 'lucide-react'

export function DroneOverlay() {
  const [drones, setDrones] = useState([
    {
      id,
      name,
      latitude,
      longitude,
      altitude,
      battery,
      signal,
      status,
      streamUrl: '/api/drone-stream/001',
      lastUpdate).toISOString(),
    },
    {
      id,
      name,
      latitude,
      longitude,
      altitude,
      battery,
      signal,
      status,
      streamUrl: '/api/drone-stream/002',
      lastUpdate).toISOString(),
    },
  ])

  const [selectedDrone, setSelectedDrone] = useState(drones[0])
  const [liveStream, setLiveStream] = useState(true)

  useEffect(() => {
    // Simulate drone telemetry updates
    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        battery, drone.battery - Math.random() * 2),
        signal, drone.signal + (Math.random() - 0.5) * 10),
        altitude) - 0.5) * 5,
        lastUpdate).toISOString(),
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal) => {
    if (signal >= 80) return 'text-green-400'
    if (signal >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 flex gap-4">
      {/* Live Stream */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden flex flex-col">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            <span className="font-bold">{selectedDrone?.name || 'Select Drone'}</span>
            {selectedDrone?.status === 'active' && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs text-gray-400">{selectedDrone?.lastUpdate ? new Date(selectedDrone.lastUpdate).toLocaleTimeString() : 'N/A'}</p>
        </div>

        {/* Video Feed Placeholder */}
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
          {liveStream ? (
            <div className="text-center">
              <Plane className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <p className="text-gray-400">Live Stream Active</p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedDrone ? `Flying over ${selectedDrone.latitude.toFixed(4)}, ${selectedDrone.longitude.toFixed(4)}` : 'No drone selected'}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Stream Offline</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 px-4 py-3 flex gap-2">
          <button
            onClick={() => setLiveStream(!liveStream)}
            className="flex-1 bg-red-600 hover
          >
            {liveStream ? 'Stop Stream' : 'Start Stream'}
          </button>
          <button className="flex-1 bg-blue-600 hover
            Record
          </button>
        </div>
      </div>

      {/* Drone List & Telemetry */}
      <div className="w-80 bg-gray-800 rounded-lg p-4 flex flex-col">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-orange-500" />
          Drone Fleet
        </h3>

        {/* Drone List */}
        <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
          {drones.map(drone => (
            <div
              key={drone.id}
              onClick={() => setSelectedDrone(drone)}
              className={`p-3 rounded cursor-pointer transition ${
                selectedDrone?.id === drone.id
                  ? 'bg-orange-600'
                  : 'bg-gray-700 hover
              }`}
            >
              <p className="font-semibold text-sm">{drone.name}</p>
              <p className="text-xs text-gray-300">{drone.status.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {/* Telemetry */}
        {selectedDrone && (
          <div className="bg-gray-700 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Altitude</span>
              <span className="font-mono">{selectedDrone.altitude.toFixed(1)}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Battery</span>
              <span className="font-mono">{selectedDrone.battery.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded h-2 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded"
                style={{ width{selectedDrone.battery}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Signal</span>
              <span className={`font-mono font-bold ${getSignalColor(selectedDrone.signal)}`}>
                {selectedDrone.signal.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location</span>
              <span className="text-xs font-mono">{selectedDrone.latitude.toFixed(3)}, {selectedDrone.longitude.toFixed(3)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
