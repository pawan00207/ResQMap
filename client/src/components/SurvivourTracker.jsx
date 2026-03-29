'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download, Users, MapPin, AlertCircle, Upload, Plus, RefreshCw, Check, Zap, Wifi, Video, Circle } from 'lucide-react'
import { toast } from 'sonner'

const generateQRCode = (data) => `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="white" width="200" height="200"/%3E%3Crect fill="black" x="20" y="20" width="20" height="20"/%3E%3C/svg%3E`

export function SurvivorTracker() {
  const [survivors, setSurvivors] = useState([
    {
      id,
      name,
      status,
      latitude,
      longitude,
      qrCode: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="white" width="200" height="200"/%3E%3Crect fill="black" x="20" y="20" width="20" height="20"/%3E%3C/svg%3E',
      lastLocation,
      contactInfo,
      injuries,
      age,
      description
    },
  ])

  const [drones, setDrones] = useState([
    {
      id,
      name,
      status,
      latitude,
      longitude,
      altitude,
      battery,
      signal,
      speed,
      heading,
      coverage,
      liveStream,
    },
    {
      id,
      name,
      status,
      latitude,
      longitude,
      altitude,
      battery,
      signal,
      speed,
      heading,
      coverage,
      liveStream,
    },
    {
      id,
      name,
      status,
      latitude,
      longitude,
      altitude,
      battery,
      signal,
      speed,
      heading,
      coverage,
      liveStream,
    },
  ])

  const [selectedSurvivor, setSelectedSurvivor] = useState(null)
  const [selectedDrone, setSelectedDrone] = useState(drones[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [importingGoogle, setImportingGoogle] = useState(false)
  const [showDronePanel, setShowDronePanel] = useState(true)
  const [newSurvivor, setNewSurvivor] = useState({
    name,
    age,
    contactInfo,
    lastLocation,
    injuries,
    description,
  })

  const updateDroneTelemetry = () => {
    setDrones(drones.map(drone => {
      if (drone.status === 'active') {
        return {
          ...drone,
          altitude, Math.min(300, drone.altitude + (Math.random() - 0.5) * 10)),
          battery, drone.battery - Math.random() * 0.5),
          latitude) - 0.5) * 0.001,
          longitude) - 0.5) * 0.001,
          speed, Math.min(20, drone.speed + (Math.random() - 0.5) * 2)),
          heading) * 5) % 360,
        }
      }
      return drone
    }))
  }

  useEffect(() => {
    const interval = setInterval(updateDroneTelemetry, 2000)
    return () => clearInterval(interval)
  }, [])

  const downloadSurvivorReport = (survivor) => {
    const report = `
SURVIVOR REPORT - ResQMap
========================
Name{survivor.name}
Status{survivor.status.toUpperCase()}
ID{survivor.id}
Age{survivor.age || 'Unknown'}
Location{survivor.lastLocation}
Coordinates{survivor.latitude}, ${survivor.longitude}
Contact{survivor.contactInfo}
Injuries{survivor.injuries || 'None reported'}
Description{survivor.description || 'None'}
Last Updated{survivor.foundAt || 'Ongoing search'}
    `
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survivor-${survivor.id}.txt`
    a.click()
  }

  const toggleDroneStream = (droneId) => {
    setDrones(drones.map(d => 
      d.id === droneId ? { ...d, liveStream: !d.liveStream } : d
    ))
    const drone = drones.find(d => d.id === droneId)
    toast.success(`${drone?.name} stream ${!drone?.liveStream ? 'started' : 'stopped'}`)
  }

  const deployDroneToSurvivor = (droneId, survivor) => {
    setDrones(drones.map(d => 
      d.id === droneId ? { 
        ...d, 
        status,
        latitude,
        longitude,
        liveStream
      } : d
    ))
    toast.success(`Drone deployed to ${survivor.name}`)
  }

  const handleAddSurvivor = async () => {
    if (!newSurvivor.name || !newSurvivor.contactInfo) {
      toast.error('Please fill in name and contact info')
      return
    }

    const survivor: Survivor = {
      id{Date.now()}`,
      name,
      status,
      latitude) * 0.1,
      longitude) * 0.1,
      qrCode{Date.now()}`),
      lastLocation,
      contactInfo,
      injuries,
      age) || undefined,
      description,
    }

    setSurvivors([survivor, ...survivors])
    setNewSurvivor({ name, age, contactInfo, lastLocation, injuries, description)
    setShowAddForm(false)
    toast.success(`Survivor "${survivor.name}" registered successfully`)
  }

  const handleImportGoogle = async () => {
    setImportingGoogle(true)
    try {
      // Mock Google import with sample missing persons data
      const mockGoogleData = [
        {
          name,
          age,
          lastLocation,
          contactInfo,
          description, wearing white shirt',
          injuries
        },
        {
          name,
          age,
          lastLocation,
          contactInfo,
          description, carrying brown backpack',
          injuries
        },
        {
          name,
          age,
          lastLocation,
          contactInfo,
          description,
          injuries
        },
      ]

      const newSurvivors = mockGoogleData.map((person) => ({
        id{Date.now()}-${Math.random()}`,
        name,
        status,
        latitude) - 0.5) * 0.2,
        longitude) - 0.5) * 0.2,
        qrCode),
        lastLocation,
        contactInfo,
        injuries,
        age,
        description,
      }))

      setSurvivors([...newSurvivors, ...survivors])
      toast.success(`Imported ${newSurvivors.length} missing persons from data`)
    } catch (error) {
      toast.error('Failed to import missing persons data')
    } finally {
      setImportingGoogle(false)
    }
  }

  const updateSurvivorStatus = (id, status) => {
    setSurvivors(survivors.map(s => s.id === id ? { ...s, status } : s))
    if (selectedSurvivor?.id === id) {
      setSelectedSurvivor({ ...selectedSurvivor, status })
    }
    toast.success('Survivor status updated')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'missing':
        return 'bg-red-600'
      case 'found':
        return 'bg-yellow-600'
      case 'rescued':
        return 'bg-green-600'
      case 'deceased':
        return 'bg-gray-600'
      default
    }
  }

  const getDroneStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900'
      case 'idle':
        return 'text-yellow-400 bg-yellow-900'
      case 'charging':
        return 'text-blue-400 bg-blue-900'
      case 'offline':
        return 'text-red-400 bg-red-900'
      default
    }
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6 flex gap-4 flex-col lg
      {/* Survivor List */}
      <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-lg font-bold">Survivor Registry</h2>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">{survivors.length}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 bg-orange-600 hover
          >
            <Plus className="w-4 h-4" /> Add Survivor
          </button>
          <button
            onClick={handleImportGoogle}
            disabled={importingGoogle}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled
          >
            <Upload className="w-4 h-4" /> {importingGoogle ? 'Importing...' : 'Import Data'}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-700 p-4 rounded mb-4 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={newSurvivor.name}
              onChange={(e) => setNewSurvivor({ ...newSurvivor, name)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Age"
                value={newSurvivor.age}
                onChange={(e) => setNewSurvivor({ ...newSurvivor, age)}
                className="bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm"
              />
              <input
                type="tel"
                placeholder="Contact"
                value={newSurvivor.contactInfo}
                onChange={(e) => setNewSurvivor({ ...newSurvivor, contactInfo)}
                className="bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Last Location"
              value={newSurvivor.lastLocation}
              onChange={(e) => setNewSurvivor({ ...newSurvivor, lastLocation)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Injuries"
              value={newSurvivor.injuries}
              onChange={(e) => setNewSurvivor({ ...newSurvivor, injuries)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm"
            />
            <textarea
              placeholder="Description / Additional Info"
              value={newSurvivor.description}
              onChange={(e) => setNewSurvivor({ ...newSurvivor, description)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 text-sm h-20"
            />
            <button
              onClick={handleAddSurvivor}
              className="w-full bg-green-600 hover
            >
              Register Survivor
            </button>
          </div>
        )}
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {survivors.map((survivor) => (
            <div
              key={survivor.id}
              onClick={() => setSelectedSurvivor(survivor)}
              className="p-3 bg-gray-700 rounded cursor-pointer hover
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{survivor.name}</p>
                  <p className="text-xs text-gray-400">{survivor.id}</p>
                  {survivor.age && <p className="text-xs text-gray-400">Age{survivor.age}</p>}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(survivor.status)}`}>
                  {survivor.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Detail Panel */}
      {selectedSurvivor && (
        <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{selectedSurvivor.name}</h3>
          
          {/* QR Code */}
          <div className="bg-white p-4 rounded mb-4 flex justify-center">
            <img src={selectedSurvivor.qrCode} alt="QR" className="w-32 h-32" />
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm flex-1">
            <div>
              <p className="text-gray-400">Age</p>
              <p>{selectedSurvivor.age || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {['missing', 'found', 'rescued', 'deceased'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateSurvivorStatus(selectedSurvivor.id, status as Survivor['status'])}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      selectedSurvivor.status === status
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover
                    }`}
                  >
                    {status === selectedSurvivor.status && <Check className="w-3 h-3 inline mr-1" />}
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-400">Location</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {selectedSurvivor.lastLocation}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Coordinates</p>
              <p>{selectedSurvivor.latitude.toFixed(4)}, {selectedSurvivor.longitude.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-gray-400">Contact</p>
              <p>{selectedSurvivor.contactInfo}</p>
            </div>
            <div>
              <p className="text-gray-400">Injuries</p>
              <p className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {selectedSurvivor.injuries || 'None'}
              </p>
            </div>
            {selectedSurvivor.description && (
              <div>
                <p className="text-gray-400">Description</p>
                <p className="text-xs">{selectedSurvivor.description}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-col mt-auto">
            <button
              onClick={() => downloadSurvivorReport(selectedSurvivor)}
              className="w-full bg-orange-600 hover
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
            {selectedDrone && (
              <button
                onClick={() => deployDroneToSurvivor(selectedDrone.id, selectedSurvivor)}
                className="w-full bg-blue-600 hover
              >
                <Zap className="w-4 h-4" /> Deploy Drone
              </button>
            )}
          </div>
        </div>
      )}

    {/* Drone Fleet Panel */}
    <div className="w-full lg
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-bold">Drone Fleet</h2>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">{drones.length}</span>
        </div>
        <button onClick={() => setShowDronePanel(!showDronePanel)} className="text-gray-400 hover
          {showDronePanel ? '▼' : '▶'}
        </button>
      </div>

      {showDronePanel && (
        <>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {drones.map((drone) => (
              <div
                key={drone.id}
                onClick={() => setSelectedDrone(drone)}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedDrone?.id === drone.id ? 'bg-orange-600' : 'bg-gray-700 hover
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Circle className="w-2 h-2 animate-pulse" style={{ color: drone.status === 'active' ? '#22c55e' : '#ef4444' }} />
                    <p className="font-semibold text-sm">{drone.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getDroneStatusColor(drone.status)}`}>
                    {drone.status.toUpperCase()}
                  </span>
                </div>
                {drone.liveStream && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mb-2">
                    <Circle className="w-2 h-2 animate-pulse" /> LIVE
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedDrone && (
            <div className="bg-gray-700 rounded-lg p-3 flex-1">
              <h3 className="font-semibold mb-3 text-sm">{selectedDrone.name}</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Altitude</span>
                  <span className="font-semibold">{selectedDrone.altitude.toFixed(0)}m</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width{(selectedDrone.altitude / 300) * 100}%` }} />
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Battery</span>
                  <span className={`font-semibold ${selectedDrone.battery > 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedDrone.battery.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${selectedDrone.battery > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width{selectedDrone.battery}%` }} 
                  />
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Signal</span>
                  <span className="font-semibold text-green-400">{selectedDrone.signal}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width{selectedDrone.signal}%` }} />
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Speed</span>
                  <span>{selectedDrone.speed.toFixed(1)} m/s</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Location</span>
                  <span className="text-xs">{selectedDrone.latitude.toFixed(3)}, {selectedDrone.longitude.toFixed(3)}</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Coverage</span>
                  <span>{selectedDrone.coverage}m²</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleDroneStream(selectedDrone.id)}
                  className={`flex-1 px-3 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1 ${
                    selectedDrone.liveStream
                      ? 'bg-red-600 hover
                      : 'bg-gray-600 hover
                  }`}
                >
                  <Video className="w-3 h-3" /> {selectedDrone.liveStream ? 'Stop' : 'Stream'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
  )
}
