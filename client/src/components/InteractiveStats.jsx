'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'

export function InteractiveStats() {
  const [stats, setStats] = useState([
    { label, value, target, icon, color,
    { label, value, target, icon, color,
    { label, value, target, icon, color,
  ])

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    
    stats.forEach((stat, idx) => {
      const interval = setInterval(() => {
        setStats(prev => {
          const newStats = [...prev]
          if (newStats[idx].value < newStats[idx].target) {
            newStats[idx].value += Math.ceil(newStats[idx].target / 50)
          }
          return newStats
        })
      }, 30)
      intervals.push(interval)
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [])

  return (
    <div className="grid md
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        const percentage = (stat.value / stat.target) * 100
        return (
          <div key={idx} className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 hover
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">{stat.label}</h3>
              <Icon className={`w-6 h-6 text-white p-1 rounded-full ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{Math.min(stat.value, stat.target)}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${stat.color} transition-all duration-300`}
                style={{ width{Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{Math.min(Math.floor(percentage), 100)}% Complete</p>
          </div>
        )
      })}
    </div>
  )
}
