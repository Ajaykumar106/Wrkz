"use server"

import { createClient } from '@/lib/supabase/server'
import { generateEmbedding, buildFreelancerEmbeddingText } from './ai'
import { revalidatePath } from 'next/cache'

export async function createFreelancerProfile(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be logged in to create a freelancer profile.' }
  }

  const niche = formData.get('niche') as string
  const bio = formData.get('bio') as string
  const portfolioLink = formData.get('portfolioLink') as string

  if (!niche || !bio) {
    return { error: 'Missing required fields.' }
  }

  try {
    // 2. Generate AI Embedding for the freelancer profile to match with jobs
    const textToEmbed = await buildFreelancerEmbeddingText(niche, bio, [])
    const embedding = await generateEmbedding(textToEmbed)

    // 3. Upsert into Supabase `freelancer_profiles` table
    const { error: insertError } = await supabase
      .from('freelancer_profiles')
      .upsert({
        user_id: user.id,
        niches: [niche],
        bio,
        embedding // Vector column
      }, { onConflict: 'user_id' })

    if (insertError) {
      console.error('Database insert failed:', insertError)
      return { error: `Database error: ${insertError.message}` }
    }

    // Refresh layout
    revalidatePath('/', 'layout')
    
    return { success: true }
    
  } catch (err: any) {
    console.error('Profile creation failed:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}
