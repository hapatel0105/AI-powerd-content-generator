import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, History, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AI Content Gen</span>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Amazing Content
            <span className="text-primary-600"> with AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create high-quality blog posts, social media content, and marketing copy in seconds using the power of OpenAI's advanced language models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              Try Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to create amazing content
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to streamline your content creation workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Leverage OpenAI's cutting-edge language models to generate high-quality, engaging content in seconds.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your content and data are protected with enterprise-grade security and privacy measures.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Content History</h3>
            <p className="text-gray-600">
              Keep track of all your generated content with our comprehensive history and organization system.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your content creation?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of creators who are already using AI to produce amazing content.
            </p>
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-semibold">AI Content Generator</span>
            </div>
            <p className="text-gray-400">
              © 2024 AI Content Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
