'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Sparkles, Copy, Download, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface DemoForm {
  contentType: string
  topic: string
  tone: string
}

const CONTENT_TYPES = [
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'social-media', label: 'Social Media Post' },
  { value: 'email', label: 'Email' },
]

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
]

export default function DemoPage() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoForm>()

  const onSubmit = async (data: DemoForm) => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedContent(result.content)
        toast.success('Demo content generated!')
      } else {
        toast.error('Failed to generate demo content')
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
    a.download = 'demo-content.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Content downloaded!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Simple AI Content Gen</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Try Our Simple AI Content Generator
          </h1>
          <p className="text-xl text-gray-600">
            Experience the power of AI-generated content without creating an account
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demo Form */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Demo Generator</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  Topic
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter your content topic"
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-5 w-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Demo Content
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a demo version with limited functionality. 
                Create an account to access the full features and save your content.
              </p>
            </div>
          </div>

          {/* Generated Content Display */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generated Content</h3>
            
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {generatedContent}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary inline-flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={downloadContent}
                    className="btn-secondary inline-flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Fill out the form and click generate to see AI-powered content!</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              Ready for the full experience?
            </h3>
            <p className="text-primary-700 mb-6">
              Create an account to save your content and track your history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary">
                Create Free Account
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
