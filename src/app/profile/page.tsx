import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, MapPin, Link as LinkIcon, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch real profile data
  const { data: freelancerProfile } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
    
  // Fetch user's posts
  const { data: userPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const profile = {
    name: user.user_metadata?.full_name || "New User",
    niche: freelancerProfile?.niches?.[0] || "Client / Unverified",
    bio: freelancerProfile?.bio || "No bio added yet.",
    location: "Global",
    joined: new Date(user.created_at).toLocaleDateString(),
    stats: {
      posts: userPosts?.length || 0,
      followers: freelancerProfile?.trust_score || 0,
      following: 0
    }
  }

  return (
    <div className="flex justify-center min-h-screen bg-[#FCFCFD] text-[#0A0A0A]">
      <main className="w-full max-w-[600px] border-x border-black/5 min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 h-[60px] flex items-center gap-6">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-[17px] font-bold leading-tight">{profile.name}</h2>
            <p className="text-[13px] text-gray-500">{profile.stats.posts} posts</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 text-white grid place-items-center text-[24px] font-bold shadow-inner">
              {profile.name.charAt(0)}
            </div>
            <button className="h-9 px-5 rounded-full border border-black/20 font-bold text-[14px] hover:bg-black/5 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-[20px] font-bold flex items-center gap-1.5">
              {profile.name}
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </h1>
            <p className="text-[15px] text-gray-500">{profile.niche}</p>
          </div>

          <p className="text-[15px] leading-relaxed mb-4">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-4 text-[14px] text-gray-500 mb-6">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {profile.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Joined {profile.joined}
            </div>
          </div>

          <div className="flex gap-6 text-[15px]">
            <div className="flex gap-1.5">
              <span className="font-bold text-black">{profile.stats.following}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex gap-1.5">
              <span className="font-bold text-black">{profile.stats.followers}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/5">
          <button className="flex-1 py-4 text-[15px] font-bold text-black border-b-2 border-black">Portfolio</button>
          <button className="flex-1 py-4 text-[15px] font-medium text-gray-500 hover:bg-black/5 transition-colors">Bids</button>
          <button className="flex-1 py-4 text-[15px] font-medium text-gray-500 hover:bg-black/5 transition-colors">Reviews</button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {userPosts && userPosts.filter(p => p.images && p.images.length > 0).length > 0 ? (
            userPosts.filter(p => p.images && p.images.length > 0).map((post) => (
              <div key={post.id} className="aspect-square bg-black/5 relative hover:opacity-90 cursor-pointer transition-opacity">
                <img 
                  src={post.images[0]} 
                  alt="Portfolio Item"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 py-20 text-center opacity-50 text-[14px]">
              No portfolio images yet. Post a job with an image to see it here!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
