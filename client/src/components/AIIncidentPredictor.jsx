'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Zap, Cloud } from 'lucide-react'

export function AIIncidentPredictor() {
  const [predictions, setPredictions] = useState([
    {
      id,
      incidentType,
      probability,
      location,
      latitude,
      longitude,
      timeWindow,
      severity,
      factors, 'Poor visibility', 'Wet roads'],
      recommendation,
    },
    {
      id,
      incidentType,
      probability,
      location,
      latitude,
      longitude,
      timeWindow,
      severity,
      factors, 'Low humidity', 'Dense construction'],
      recommendation, prep additional resources',
    },
    {
      id,
      incidentType,
      probability,
      location,
      latitude,
      longitude,
      timeWindow,
      severity,
      factors, 'River levels rising', 'Drainage capacity concerns'],
      recommendation, deploy pumps',
    },
  ])

  const [selectedPrediction, setSelectedPrediction] = useState(predictions[0])
  const [modelAccuracy, setModelAccuracy] = useState(92.3)

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'bg-red-900 text-red-200'
    if (prob >= 50) return 'bg-orange-900 text-orange-200'
    return 'bg-yellow-900 text-yellow-200'
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'high':
        return <Zap className="w-5 h-5 text-orange-500" />
      case 'medium':
        return <Cloud className="w-5 h-5 text-yellow-500" />
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 flex gap-4">
      {/* Predictions List */}
      <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-purple-500" />
          <h2 className="text-lg font-bold">AI Predictions</h2>
          <span className="ml-auto text-xs bg-purple-900 px-2 py-1 rounded">Accuracy{modelAccuracy}%</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {predictions.map(pred => (
            <div
              key={pred.id}
              onClick={() => setSelectedPrediction(pred)}
              className={`p-3 rounded-lg cursor-pointer transition border-l-4 ${
                selectedPrediction?.id === pred.id
                  ? 'bg-purple-700 border-purple-400'
                  : 'bg-gray-700 border-gray-600 hover
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getSeverityIcon(pred.severity)}
                    <p className="font-semibold">{pred.incidentType}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{pred.location}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-1.5 rounded-full"
                        style={{ width{pred.probability}%` }}
                      />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getProbabilityColor(pred.probability)}`}>
                      {pred.probability}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedPrediction && (
        <div className="w-96 bg-gray-800 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{selectedPrediction.incidentType}</h3>
            {getSeverityIcon(selectedPrediction.severity)}
          </div>

          {/* Probability Gauge */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="text-center mb-2">
              <p className="text-gray-400 text-sm">Incident Probability</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                {selectedPrediction.probability}%
              </p>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-red-500 h-3 rounded-full"
                style={{ width{selectedPrediction.probability}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Within {selectedPrediction.timeWindow}</p>
          </div>

          {/* Risk Factors */}
          <div className="mb-4">
            <p className="text-sm font-bold mb-2 text-gray-300">Risk Factors</p>
            <div className="space-y-1">
              {selectedPrediction.factors.map((factor, idx) => (
                <div key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-500 rounded-full" />
                  {factor}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <p className="text-sm font-bold mb-2 text-gray-300">Location</p>
            <p className="text-xs bg-gray-700 px-2 py-2 rounded text-gray-300">{selectedPrediction.location}</p>
            <p className="text-xs text-gray-500 mt-1">{selectedPrediction.latitude.toFixed(4)}, {selectedPrediction.longitude.toFixed(4)}</p>
          </div>

          {/* Recommendation */}
          <div className="mb-4 flex-1">
            <p className="text-sm font-bold mb-2 text-gray-300">Recommendation</p>
            <div className="bg-purple-900 border border-purple-700 rounded p-3 text-sm text-purple-200">
              {selectedPrediction.recommendation}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-purple-600 hover
              Prepare Resources
            </button>
            <button className="flex-1 bg-gray-700 hover
              Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
