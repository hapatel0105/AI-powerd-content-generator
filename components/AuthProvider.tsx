'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Create Supabase client once and memoize it
  const supabase = useMemo(() => createClientComponentClient(), [])

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signOut,
  }), [user, session, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
