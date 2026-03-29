'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, MapPin, Users, AlertTriangle, Radio, Zap } from 'lucide-react'
import { RESQMAP_CONFIG } from '@/lib/resqmap-config'
import Image from 'next/image'

/**
 * Main ResQMap emergency coordination dashboard
 * Dark-mode first with full-viewport map
 */
export function ResQMapDashboard({
  activeIncidents = 0,
  connectedUnits = 0,
  offlineStatus = false,
}: ResQMapDashboardProps) {
  const [expandedPanel, setExpandedPanel] = useState<'incidents' | 'map' | 'alerts'>('map')
  const [filteredIncidents, setFilteredIncidents] = useState([])
  const [selectedIncident, setSelectedIncident] = useState(null)

  // Fetch incidents
  useEffect(() => {
    fetch('/api/incidents')
      .then((r) => r.json())
      .then((data) => setFilteredIncidents(data))
      .catch((err) => console.error('[v0] Fetch incidents error, err))
  }, [])

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {/* Logo Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RESQMAPKO-eZTYR9rGICNQYmYDMiprTziSIHPNWv.jpeg"
          alt="ResQMap"
          className="h-10 w-auto"
        />
        <div className="text-xs font-mono text-gray-400">v1.0</div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-4 right-4 z-20 flex gap-4">
        {offlineStatus && (
          <div className="bg-gray-700 text-yellow-300 px-3 py-2 rounded text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse" />
            Offline Mode
          </div>
        )}
        <div className="bg-red-900 text-red-100 px-3 py-2 rounded text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {activeIncidents} Active
        </div>
        <div className="bg-blue-900 text-blue-100 px-3 py-2 rounded text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {connectedUnits} Units
        </div>
      </div>

      {/* Map Container (placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Leaflet Map View</p>
          <p className="text-xs text-gray-600 mt-2">OpenStreetMap + Real-time GPS Tracking</p>
        </div>
      </div>

      {/* Left Sidebar - Incidents List */}
      {expandedPanel === 'incidents' && (
        <div className="absolute left-4 top-24 bottom-4 w-80 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl flex flex-col z-10">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Incidents
            </h2>
            <p className="text-xs text-gray-400 mt-1">{filteredIncidents.length} total</p>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredIncidents.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p className="text-sm">No active incidents</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`w-full p-3 border-b border-gray-700 text-left hover{
                    selectedIncident?.id === incident.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        incident.severity === 'critical'
                          ? 'bg-red-500 animate-pulse'
                          : incident.severity === 'high'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm">{incident.type}</p>
                      <p className="text-xs text-gray-400">{incident.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(incident.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Right Sidebar - Details */}
      {selectedIncident && (
        <div className="absolute right-4 top-24 bottom-4 w-80 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl overflow-auto z-10">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">{selectedIncident.type}</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-semibold capitalize">{selectedIncident.status}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Severity</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedIncident.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                    }`}
                  />
                  <p className="font-semibold capitalize">{selectedIncident.severity}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">Description</p>
                <p className="text-sm">{selectedIncident.description}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-mono">
                  {selectedIncident.location?.[1]?.toFixed(4)}, {selectedIncident.location?.[0]?.toFixed(4)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Assigned Rescuers</p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <p className="text-sm">{selectedIncident.rescuers?.length || 0} units</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-red-600 hover
              Assign Unit
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar - Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        <button
          onClick={() => setExpandedPanel('incidents')}
          className={`px-4 py-2 rounded font-semibold transition ${
            expandedPanel === 'incidents'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover
          }`}
        >
          Incidents [I]
        </button>
        <button className="px-4 py-2 rounded font-semibold bg-gray-800 text-gray-400 hover
          Routing [R]
        </button>
        <button className="px-4 py-2 rounded font-semibold bg-gray-800 text-gray-400 hover
          Danger Zones [D]
        </button>
        <button className="px-4 py-2 rounded font-semibold bg-gray-800 text-gray-400 hover
          Resources [E]
        </button>
      </div>

      {/* SOS Emergency Button (Floating) */}
      <button className="absolute bottom-8 right-8 z-20 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl hover:shadow-red-500/50 hover
        <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
        <div className="absolute -top-12 right-0 opacity-0 group-hover
          SOS [S]
        </div>
      </button>
    </div>
  )
}
