'use client'

import { useState, useEffect } from 'react'

export interface Profile {
  id: string
  username: string
  email: string
  bio: string
  avatar_url?: string
  discipline_id?: string
  primary_discipline?: string
  reputation: number
  onboarded: boolean
  created_at: string
}

export interface ProfileFormData {
  username: string
  email: string
  bio: string
  avatar_url: string
  primary_discipline: string
  website: string
  location: string
  social_twitter?: string
  social_instagram?: string
  social_linkedin?: string
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In production, this would fetch from /api/profiles/me
    // For now, use mock data that matches the Atelier Profile schema
    const mockProfile: Profile = {
      id: 'user-123',
      username: 'designstudio',
      email: 'user@example.com',
      bio: 'Product designer and creative enthusiast exploring design systems and UX.',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designstudio',
      discipline_id: 'discipline-001',
      primary_discipline: 'product-design',
      reputation: 2450,
      onboarded: true,
      created_at: new Date().toISOString(),
    }
    setProfile(mockProfile)
    setLoading(false)
  }, [])

  const updateProfile = async (data: Partial<ProfileFormData>) => {
    try {
      setLoading(true)
      // In production, this would POST to /api/profiles/me
      // For now, simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      if (profile) {
        setProfile({
          ...profile,
          ...data,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, updateProfile }
}
