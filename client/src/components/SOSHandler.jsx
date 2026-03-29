'use client';

import { useState } from 'react';
import { Heart, Send, MapPin } from 'lucide-react';
import { useDisasterStore } from '@/lib/store';

export function SOSHandler({ onSOSSent, userLocation }: SOSHandlerProps) {
  const [showForm, setShowForm] = useState(false);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { sendSOS } = useDisasterStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLocation) {
      alert('Location not available');
      return;
    }

    setIsLoading(true);
    try {
      sendSOS(userLocation, severity, description);
      onSOSSent?.();
      
      // Reset form
      setDescription('');
      setSeverity('high');
      setEmergencyType('medical');
      setShowForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full p-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex flex-col items-center justify-center gap-3 transition transform hover
      >
        <Heart className="w-8 h-8 fill-white animate-pulse" />
        <span className="text-lg">EMERGENCY SOS</span>
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Type</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
            >
              <option value="medical">Medical Emergency</option>
              <option value="accident">Accident</option>
              <option value="fire">Fire</option>
              <option value="police">Police Needed</option>
              <option value="disaster">Natural Disaster</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${
                    severity === level
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
            />
          </div>

          {userLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location)}, {userLocation[1].toFixed(4)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled
            >
              {isLoading ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4" />
                  Send SOS Alert
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-gray-300 hover
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
