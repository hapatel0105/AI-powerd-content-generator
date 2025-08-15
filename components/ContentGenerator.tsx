'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/AuthProvider'

interface ContentForm {
  contentType: string
  topic: string
  tone: string
  length: string
  additionalContext?: string
}

interface ContentGeneratorProps {
  onContentGenerated: () => void
  userCredits: number
}

const CONTENT_TYPES = [
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'social-media', label: 'Social Media Post' },
  { value: 'email', label: 'Email' },
  { value: 'product-description', label: 'Product Description' },
  { value: 'article', label: 'Article' },
  { value: 'story', label: 'Story' },
]

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'creative', label: 'Creative' },
  { value: 'humorous', label: 'Humorous' },
]

const LENGTHS = [
  { value: 'short', label: 'Short (100-200 words)', cost: 1 },
  { value: 'medium', label: 'Medium (300-500 words)', cost: 2 },
  { value: 'long', label: 'Long (600-1000 words)', cost: 3 },
  { value: 'extended', label: 'Extended (1000+ words)', cost: 4 },
]

export default function ContentGenerator({ onContentGenerated, userCredits }: ContentGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [cost, setCost] = useState(0)
  const { user } = useAuth()
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ContentForm>()
  const selectedLength = watch('length')

  const calculateCost = (length: string) => {
    const lengthOption = LENGTHS.find(l => l.value === length)
    return lengthOption ? lengthOption.cost : 0
  }

  const onSubmit = async (data: ContentForm) => {
    if (!user) {
      toast.error('Please log in to generate content')
      return
    }

    const contentCost = calculateCost(data.length)
    
    if (userCredits < contentCost) {
      toast.error(`Insufficient credits. You need ${contentCost} credits, but you have ${userCredits}.`)
      return
    }

    setIsGenerating(true)
    setCost(contentCost)

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedContent(result.content)
        toast.success(`Content generated successfully! Cost: ${contentCost} credits`)
        onContentGenerated()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to generate content')
      }
    } catch (error) {
      toast.error('An error occurred while generating content')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast.success('Content copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-content.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Content downloaded!')
  }

  const generateNew = () => {
    setGeneratedContent('')
    setCost(0)
    reset()
  }

  return (
    <div className="space-y-8">
      {/* Content Generation Form */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Generate AI Content</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                {...register('contentType', { required: 'Content type is required' })}
                className="input-field"
              >
                <option value="">Select content type</option>
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.contentType && (
                <p className="mt-1 text-sm text-red-600">{errors.contentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                {...register('topic', { required: 'Topic is required' })}
                type="text"
                placeholder="Enter your topic"
                className="input-field"
              />
              {errors.topic && (
                <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                {...register('tone', { required: 'Tone is required' })}
                className="input-field"
              >
                <option value="">Select tone</option>
                {TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              {errors.tone && (
                <p className="mt-1 text-sm text-red-600">{errors.tone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length
              </label>
              <select
                {...register('length', { required: 'Length is required' })}
                className="input-field"
                onChange={(e) => setCost(calculateCost(e.target.value))}
              >
                <option value="">Select length</option>
                {LENGTHS.map((length) => (
                  <option key={length.value} value={length.value}>
                    {length.label} ({length.cost} credits)
                  </option>
                ))}
              </select>
              {errors.length && (
                <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              {...register('additionalContext')}
              rows={3}
              placeholder="Add any additional context, requirements, or specific instructions..."
              className="input-field"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Cost: <span className="font-medium text-primary-600">{cost} credits</span>
              {cost > 0 && (
                <span className="ml-2">
                  (You have {userCredits} credits)
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isGenerating || userCredits < cost}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadContent}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={generateNew}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Generate New</span>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
