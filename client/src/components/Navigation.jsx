'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, AlertCircle, Accessibility, MapIcon, Heart, Info, Mail, Users, Plane, Brain, Boxes, Megaphone, LogOut, LogIn } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { getCurrentUser, signOut } from '@/lib/auth-utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setIsOpen(false)
  }

  const menuItems = [
    { href: '/resqmap', label, icon,
    { href: '/command-center', label, icon,
    { href: '/map', label, icon,
    { href: '/survivors', label, icon,
    { href: '/drones', label, icon,
    { href: '/predictions', label, icon,
    { href: '/inventory', label, icon,
    { href: '/alerts', label, icon,
    { href: '/accessibility', label, icon,
    { href: '/sos', label, icon,
    { href: '/admin', label, icon,
  ]

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 dark
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="w-6 h-6 text-red-500" />
            ResQMap
          </Link>

          {/* Desktop menu */}
          <div className="hidden md
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 hover
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden md
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                localStorage.setItem('language', e.target.value)
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 hover
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1 hover
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <div className="px-4 py-2 space-y-2">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value)
                    localStorage.setItem('language', e.target.value)
                  }}
                  className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
                <ThemeToggle />
              </div>
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full flex items-center gap-2 px-4 py-2 hover
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
