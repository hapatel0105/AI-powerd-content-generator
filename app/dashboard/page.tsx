'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, User, LogOut, Zap, History } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import ContentGenerator from '@/components/ContentGenerator'
import ContentHistory from '@/components/ContentHistory'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('generate')
  const [userCredits, setUserCredits] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchUserCredits()
    }
  }, [user])

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('/api/user/credits', {
        method: 'GET',
        headers: {
          'x-user-id': user?.id || ''
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUserCredits(data.credits)
      }
    } catch (error) {
      console.error('Error fetching user credits:', error)
    }
  }

  const handleContentGenerated = () => {
    // Refresh user credits after content generation
    fetchUserCredits()
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">AI Content Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{user.user_metadata?.name || user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">{userCredits}</span>
                <span className="text-sm">credits</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'generate'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Zap className="h-5 w-5" />
            <span>Generate Content</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <History className="h-5 w-5" />
            <span>Content History</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'generate' && (
          <ContentGenerator 
            onContentGenerated={handleContentGenerated}
            userCredits={userCredits}
          />
        )}
        {activeTab === 'history' && (
          <ContentHistory />
        )}
      </div>
    </div>
  )
}
