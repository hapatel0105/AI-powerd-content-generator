'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Calendar, FileText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/AuthProvider'

interface ContentItem {
  id: string
  content_type: string
  topic: string
  content: string
  cost: number
  metadata: {
    tone?: string
    length?: string
    additional_context?: string
  }
  created_at: string
}

export default function ContentHistory() {
  const [contentHistory, setContentHistory] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const fetchContentHistory = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/content/history', {
        headers: {
          'x-user-id': user.id
        }
      })
      if (response.ok) {
        const data = await response.json()
        setContentHistory(data.content || [])
      } else {
        toast.error('Failed to fetch content history')
      }
    } catch (error) {
      toast.error('Error fetching content history')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchContentHistory()
    }
  }, [user?.id, fetchContentHistory])

  useEffect(() => {
    filterContent()
  }, [searchTerm, selectedType, contentHistory])

  const filterContent = () => {
    let filtered = contentHistory

    // Filter by content type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.content_type === selectedType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredContent(filtered)
  }

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || ''
        }
      })

      if (response.ok) {
        toast.success('Content deleted successfully')
        fetchContentHistory() // Refresh the list
      } else {
        toast.error('Failed to delete content')
      }
    } catch (error) {
      toast.error('Error deleting content')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getContentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'blog-post': 'Blog Post',
      'social-media': 'Social Media',
      'email': 'Email',
      'product-description': 'Product Description',
      'article': 'Article',
      'story': 'Story',
    }
    return typeMap[type] || type
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
          <p className="text-gray-600 mt-1">
            View and manage all your generated content
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {contentHistory.length} items
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by topic or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Content Types</option>
              <option value="blog-post">Blog Post</option>
              <option value="social-media">Social Media</option>
              <option value="email">Email</option>
              <option value="product-description">Product Description</option>
              <option value="article">Article</option>
              <option value="story">Story</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Showing {filteredContent.length} of {contentHistory.length} items
          </div>
        </div>
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {contentHistory.length === 0 ? 'No content generated yet' : 'No content matches your filters'}
          </h3>
          <p className="text-gray-600">
            {contentHistory.length === 0 
              ? 'Start generating content to see it here!' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {getContentTypeLabel(item.content_type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Cost: {item.cost} credit{item.cost !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.topic}
                  </h3>
                  
                  <div className="text-gray-700 mb-3 line-clamp-3">
                    {item.content.length > 200 
                      ? `${item.content.substring(0, 200)}...` 
                      : item.content
                    }
                  </div>
                  
                  {item.metadata && (
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {item.metadata.tone && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Tone: {item.metadata.tone}
                        </span>
                      )}
                      {item.metadata.length && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Length: {item.metadata.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => deleteContent(item.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete content"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
