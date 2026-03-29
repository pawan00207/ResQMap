'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export function FeatureComparison() {
  const [showDetails, setShowDetails] = useState(false)

  const comparisons: FeatureComparison[] = [
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
    { feature)', resqmap, competitors,
    { feature, resqmap, competitors,
    { feature, resqmap, competitors,
  ]

  return (
    <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Feature Comparison</h2>
        <p className="text-center text-gray-600 mb-8">See what makes ResQMap stand out</p>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">ResQMap</th>
                  <th className="px-6 py-4 text-center font-semibold">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 hover{
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {item.resqmap ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.competitors ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>

          {showDetails && (
            <div className="mt-6 p-6 bg-white rounded-lg border border-blue-200 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose ResQMap?</h3>
              <ul className="space-y-3 text-left">
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">
                    <strong>Accessibility First:</strong> Dedicated accessibility navigation with barrier detection
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">
                    <strong>Community Powered:</strong> Users report incidents and share safe routes in real-time
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">
                    <strong>Works Offline:</strong> Progressive Web App (PWA) works without internet connection
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">
                    <strong>One-Tap Emergency:</strong> Fastest SOS feature with instant location sharing
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">
                    <strong>Multi-Language:</strong> Support for multiple languages including regional languages
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
