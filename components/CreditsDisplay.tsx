'use client'

import { Coins } from 'lucide-react'

interface CreditsDisplayProps {
  credits: number
}

export default function CreditsDisplay({ credits }: CreditsDisplayProps) {
  return (
    <div className="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg">
      <Coins className="h-5 w-5" />
      <span className="font-medium">{credits}</span>
      <span className="text-sm">credits</span>
    </div>
  )
}
