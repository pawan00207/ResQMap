'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

interface Analytics {
  total_reports: number
  pending_reports: number
  resolved_reports: number
  total_users: number
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin')
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalytics(data.analytics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  const chartData = [
    { name: 'Reports', total: analytics?.total_reports || 0, pending: analytics?.pending_reports || 0, resolved: analytics?.resolved_reports || 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{analytics?.total_reports || 0}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reports</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics?.pending_reports || 0}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved Reports</p>
                <p className="text-3xl font-bold text-green-600">{analytics?.resolved_reports || 0}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{analytics?.total_users || 0}</p>
              </div>
              <Users className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Report Status Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Total" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View All Reports
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              View All Users
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Create Alert
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Manage Admins
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
