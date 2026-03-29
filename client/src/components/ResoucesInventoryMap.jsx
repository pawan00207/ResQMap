'use client'

import { useState } from 'react'
import { Boxes, Truck, AlertCircle, Plus, Minus } from 'lucide-react'

export function ResourceInventoryMap() {
  const [resources, setResources] = useState([
    {
      id,
      type,
      name,
      quantity,
      unit,
      location,
      latitude,
      longitude,
      status,
      lastRestocked: '2024-01-15T08:00,
    },
    {
      id,
      type,
      name,
      quantity,
      unit,
      location,
      latitude,
      longitude,
      status,
      lastRestocked: '2024-01-14T10:30,
    },
    {
      id,
      type,
      name,
      quantity,
      unit,
      location,
      latitude,
      longitude,
      status,
      lastRestocked: '2024-01-13T15:00,
    },
    {
      id,
      type,
      name,
      quantity,
      unit,
      location,
      latitude,
      longitude,
      status,
      lastRestocked: '2024-01-12T12:00,
    },
    {
      id,
      type,
      name,
      quantity,
      unit,
      location,
      latitude,
      longitude,
      status,
      lastRestocked: '2024-01-15T06:00,
    },
  ])

  const [selectedResource, setSelectedResource] = useState(resources[0])
  const [filterType, setFilterType] = useState(null)

  const getResourceColor = (type) => {
    switch (type) {
      case 'medical':
        return 'bg-red-900 text-red-200'
      case 'food':
        return 'bg-green-900 text-green-200'
      case 'water':
        return 'bg-blue-900 text-blue-200'
      case 'shelter':
        return 'bg-purple-900 text-purple-200'
      case 'fuel':
        return 'bg-yellow-900 text-yellow-200'
      case 'equipment':
        return 'bg-orange-900 text-orange-200'
      default
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return '✓'
      case 'depleted':
        return '⚠'
      case 'deployed':
        return '→'
      default
    }
  }

  const filteredResources = filterType
    ? resources.filter(r => r.type === filterType)
    : resources

  const updateQuantity = (id, delta) => {
    setResources(prev => prev.map(r => 
      r.id === id ? { ...r, quantity, r.quantity + delta) } : r
    ))
  }

  const resourceTypes = Array.from(new Set(resources.map(r => r.type)))

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 flex gap-4">
      {/* Resource Categories */}
      <div className="w-72 bg-gray-800 rounded-lg p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Boxes className="w-6 h-6 text-cyan-500" />
          <h2 className="text-lg font-bold">Resource Inventory</h2>
        </div>

        {/* Filter */}
        <div className="mb-4 space-y-2">
          <button
            onClick={() => setFilterType(null)}
            className={`w-full px-3 py-2 rounded text-sm transition ${
              filterType === null
                ? 'bg-cyan-600'
                : 'bg-gray-700 hover
            }`}
          >
            All Resources
          </button>
          {resourceTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`w-full px-3 py-2 rounded text-sm transition text-left ${
                filterType === type
                  ? 'bg-cyan-600'
                  : 'bg-gray-700 hover
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Resource List */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {filteredResources.map(res => (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className={`p-3 rounded-lg cursor-pointer transition border-l-4 ${
                selectedResource?.id === res.id
                  ? 'bg-cyan-700 border-cyan-400'
                  : 'bg-gray-700 border-gray-600 hover
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{res.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getResourceColor(res.type)}`}>
                  {res.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300">{res.quantity} {res.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Map & Detail */}
      <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col">
        {/* Map View */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 rounded mb-4 flex items-center justify-center relative">
          <div className="text-center">
            <Truck className="w-16 h-16 mx-auto text-cyan-500 opacity-30 mb-4" />
            <p className="text-gray-500">Resource Map View</p>
            {selectedResource && (
              <div className="mt-4 text-xs text-gray-400">
                <p>{selectedResource.location}</p>
                <p>{selectedResource.latitude.toFixed(4)}, {selectedResource.longitude.toFixed(4)}</p>
              </div>
            )}
          </div>

          {/* Resource Markers */}
          <div className="absolute inset-0 p-4 pointer-events-none">
            {filteredResources.map(res => (
              <div
                key={res.id}
                className="absolute w-8 h-8 pointer-events-auto cursor-pointer"
                style={{
                  left{((res.longitude + 74.05) / 0.1) % 100}%`,
                  top{((res.latitude - 40.7) / 0.04) % 100}%`,
                }}
                onClick={() => setSelectedResource(res)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getResourceColor(res.type)}`}>
                  {getStatusIcon(res.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        {selectedResource && (
          <div className="bg-gray-700 rounded p-4">
            <h3 className="font-bold mb-3">{selectedResource.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Location</span>
                <span>{selectedResource.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Stock</span>
                <span className="font-mono">{selectedResource.quantity} {selectedResource.unit}</span>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => updateQuantity(selectedResource.id, -10)}
                  className="bg-red-600 hover
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-gray-600 rounded p-2 text-center text-sm font-mono">
                  {selectedResource.quantity}
                </div>
                <button
                  onClick={() => updateQuantity(selectedResource.id, +10)}
                  className="bg-green-600 hover
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between text-xs text-gray-400 pt-2">
                <span>Last Restocked</span>
                <span>{new Date(selectedResource.lastRestocked || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
