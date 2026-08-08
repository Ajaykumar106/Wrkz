"use server"

import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from './ai'
import { revalidatePath } from 'next/cache'

export async function createJobPost(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be logged in to post a job.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const niche = formData.get('niche') as string
  const budgetStr = formData.get('budget') as string
  const budget = parseInt(budgetStr, 10)
  const image = formData.get('image') as File | null

  if (!title || !description || !niche || !budgetStr) {
    return { error: 'Missing required fields.' }
  }

  // 2. Upload image to Supabase Storage if provided
  let imageUrl = null
  if (image && image.size > 0) {
    // Generate a unique filename
    const fileExt = image.name.split('.').pop()
    const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post_images') // Requires a public bucket named 'post_images'
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Image upload failed:', uploadError)
      return { error: 'Failed to upload image. Make sure the post_images bucket exists and is public.' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('post_images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrl
  }

  try {
    // 3. Generate AI Embedding for the job description to match with freelancers
    const textToEmbed = `Job Title: ${title}\nNiche: ${niche}\nDescription: ${description}`
    const embedding = await generateEmbedding(textToEmbed)

    // 4. Insert into Supabase `posts` table
    const { error: insertError } = await supabase
      .from('posts')
      .insert({
        client_id: user.id,
        title,
        description,
        niche,
        budget,
        images: imageUrl ? [imageUrl] : [],
        embedding // Vector column
      })

    if (insertError) {
      console.error('Database insert failed:', insertError)
      return { error: `Database error: ${insertError.message}` }
    }

    // Refresh the feed
    revalidatePath('/', 'page')
    
    return { success: true }
    
  } catch (err: any) {
    console.error('Job creation failed:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}
