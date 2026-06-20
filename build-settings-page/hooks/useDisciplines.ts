'use client'

import { useState, useEffect } from 'react'

export interface Discipline {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Software {
  id: string
  name: string
  category?: string
}

export function useDisciplines() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, this would fetch from /api/disciplines
    // Based on Atelier's community catalog structure
    const mockDisciplines: Discipline[] = [
      { id: '1', name: 'Product Design', slug: 'product-design', description: 'User experience and interface design' },
      { id: '2', name: 'UX/UI Design', slug: 'ux-ui', description: 'Digital product design and interaction' },
      { id: '3', name: 'Graphic Design', slug: 'graphic-design', description: 'Visual communication and branding' },
      { id: '4', name: 'Motion Design', slug: 'motion', description: 'Animation and motion graphics' },
      { id: '5', name: 'Architecture', slug: 'architecture', description: 'Spatial and environmental design' },
      { id: '6', name: 'Interior Design', slug: 'interior', description: 'Indoor space and environment design' },
      { id: '7', name: 'Industrial Design', slug: 'industrial', description: 'Product and object design' },
      { id: '8', name: 'Fashion Design', slug: 'fashion', description: 'Apparel and accessory design' },
    ]
    setDisciplines(mockDisciplines)
    setLoading(false)
  }, [])

  return { disciplines, loading }
}

export function useSoftware() {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, this would fetch from /api/software
    // Based on Atelier's ProfileSoftware relationship
    const mockSoftware: Software[] = [
      { id: '1', name: 'Figma', category: 'Design' },
      { id: '2', name: 'Adobe XD', category: 'Design' },
      { id: '3', name: 'Sketch', category: 'Design' },
      { id: '4', name: 'Adobe Photoshop', category: 'Image Editing' },
      { id: '5', name: 'Adobe Illustrator', category: 'Vector' },
      { id: '6', name: 'After Effects', category: 'Motion' },
      { id: '7', name: 'Blender', category: '3D' },
      { id: '8', name: 'Cinema 4D', category: '3D' },
      { id: '9', name: 'Framer', category: 'Prototyping' },
      { id: '10', name: 'Webflow', category: 'Web Design' },
      { id: '11', name: 'VS Code', category: 'Development' },
      { id: '12', name: 'Notion', category: 'Productivity' },
    ]
    setSoftware(mockSoftware)
    setLoading(false)
  }, [])

  return { software, loading }
}
