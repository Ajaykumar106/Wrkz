"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Search, 
  Compass, 
  MessageSquare, 
  Bell, 
  Briefcase, 
  User, 
  Menu, 
  PlusCircle, 
  LogOut, 
  Settings as SettingsIcon, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

import { CreatePostModal } from "@/components/CreatePostModal";
import { AuthModal } from "@/components/AuthModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ChatModal } from "@/components/ChatModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
function PostCard({ post, onHire }: { post: any, onHire: () => void }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border-b border-black/10 overflow-hidden"
    >
      <div className="p-4 md:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 text-white grid place-items-center text-[12px] font-bold shadow-inner shrink-0">
            {post.freelancer.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-[15px] leading-tight">{post.freelancer.name}</h3>
              {post.freelancer.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
            </div>
            <div className="text-[12px] opacity-60 font-medium mt-0.5">
              {post.freelancer.niche} • {post.postedAt}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-5 pb-4">
        <p className="text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.mediaUrl && (
        <div className="relative w-full aspect-video bg-black/5">
          <img 
            src={post.mediaUrl} 
            alt="Portfolio Work" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className="flex items-center gap-2 group">
              <motion.div whileTap={{ scale: 0.8 }} className="p-2 -m-2 rounded-full transition-colors">
                <Heart className={`w-6 h-6 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-black group-hover:text-gray-500"}`} strokeWidth={1.5} />
              </motion.div>
              <span className={`text-[13px] font-medium ${isLiked ? "text-red-500" : "text-black group-hover:text-gray-500"}`}>{likesCount}</span>
            </button>
            <button onClick={onHire} className="flex items-center gap-2 group">
              <div className="p-2 -m-2 rounded-full transition-colors">
                <MessageCircle className="w-6 h-6 text-black group-hover:text-gray-500 transition-colors" strokeWidth={1.5} />
              </div>
            </button>
            <button onClick={() => setIsSaved(!isSaved)} className="flex items-center gap-2 group">
              <div className="p-2 -m-2 rounded-full transition-colors">
                <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? "fill-black text-black" : "text-black group-hover:text-gray-500"}`} strokeWidth={1.5} />
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-black/5">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Typical Budget</div>
            <div className="text-[15px] font-semibold mt-0.5">{post.budget}</div>
          </div>
          
          <motion.button 
            onClick={onHire}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full md:w-auto"
          >
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Hire via Escrow
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Fetch real posts from Supabase
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_client_id_fkey (name, avatar_url)
        `)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        // Transform data to match the UI shape
        const transformedPosts = data.map(post => ({
          id: post.id,
          freelancer: { 
            name: post.users?.name || "Anonymous Client", 
            verified: true, 
            avatar: (post.users?.name || "A").charAt(0), 
            niche: post.niche 
          },
          content: post.description,
          mediaUrl: post.images?.[0] || null, // No placeholder, will handle in UI
          likes: 0,
          saves: 0,
          budget: `₹${post.budget}`,
          postedAt: new Date(post.created_at).toLocaleDateString(),
        }));
        setPosts(transformedPosts);
      }
      setIsLoadingFeed(false);
    }
    fetchPosts();
  }, []);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Mobile Profile Menu State
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  // Desktop More Menu State
  const [isDesktopMoreOpen, setIsDesktopMoreOpen] = useState(false);
  // Sidebar Expand State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(query) ||
      post.freelancer.niche.toLowerCase().includes(query) ||
      post.freelancer.name.toLowerCase().includes(query)
    );
  }, [searchQuery, posts]);

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Compass, label: "Explore" },
    { icon: MessageSquare, label: "Messages" },
    { icon: Bell, label: "Notifications" },
    { icon: Briefcase, label: "Jobs" },
    { icon: User, label: "Profile" },
  ];
  
  return (
    <div className="flex justify-center min-h-screen bg-[#FCFCFD] text-[#0A0A0A]">
      
      {/* =================================================================== */}
      {/* DESKTOP LEFT SIDEBAR (Twitter/IG Web Style) */}
      {/* =================================================================== */}
      <motion.header 
        animate={{ width: isSidebarExpanded ? 260 : 88 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col sticky top-0 h-screen border-r border-black/5 pt-6 pb-8 px-4 justify-between shrink-0 overflow-hidden"
      >
        <div>
          {/* Top Bar with Logo and Toggle */}
          <div className={`flex items-center mb-8 ${isSidebarExpanded ? "justify-between" : "justify-center"}`}>
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 120 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative h-[40px] ml-2"
                >
                  <Image 
                    src="/logo.jpg" 
                    alt="WRKZ Logo" 
                    fill 
                    className="object-cover object-left mix-blend-multiply cursor-pointer hover:opacity-80 transition-opacity" 
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500"
            >
              {isSidebarExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`flex flex-col gap-2 ${!isSidebarExpanded && "items-center"}`}>
            {navItems.map((item, idx) => (
              <button 
                key={idx} 
                className={`flex items-center gap-4 p-3 rounded-full hover:bg-black/5 transition-colors text-left group ${isSidebarExpanded ? "w-fit pr-6" : "w-12 h-12 justify-center"}`}
                onClick={() => {
                  if (item.label === "Home") window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (item.label === "Messages") setIsChatOpen(true);
                  if (item.label === "Search") document.getElementById('desktopSearch')?.focus();
                  if (item.label === "Profile") {
                    if (user) router.push('/profile');
                    else setIsAuthModalOpen(true);
                  }
                  if (item.label === "Jobs") setIsOnboardingOpen(true);
                }}
              >
                <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 shrink-0 ${item.active ? "text-black" : "text-black"}`} strokeWidth={item.active ? 2.5 : 1.5} />
                {isSidebarExpanded && (
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`text-[17px] ${item.active ? "font-bold" : "font-normal"} whitespace-nowrap`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            ))}
          </nav>

          {/* Create Post Button */}
          <motion.button 
            onClick={() => setIsPostModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-6 rounded-full bg-[#0A0A0A] text-white font-bold flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${isSidebarExpanded ? "w-[90%] h-12 gap-2 text-[15px]" : "w-12 h-12 mx-auto"}`}
          >
            {isSidebarExpanded ? "Post a Job" : <PlusCircle className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Desktop Bottom "More" Menu */}
        <div className="relative">
          <AnimatePresence>
            {isDesktopMoreOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-[16px] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden"
              >
                <button onClick={() => { setIsDesktopMoreOpen(false); alert('Settings page coming soon!'); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-black/5 transition-colors">
                  <SettingsIcon className="w-4 h-4 text-black" strokeWidth={1.5} />
                  <span className="text-[15px]">Settings</span>
                </button>
                <div className="h-[1px] w-full bg-black/5 my-1"></div>
                <button onClick={async () => { setIsDesktopMoreOpen(false); const { logout } = await import('@/app/actions/auth'); await logout(); window.location.reload(); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-black/5 transition-colors">
                  <LogOut className="w-4 h-4 text-black" strokeWidth={1.5} />
                  <span className="text-[15px]">Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsDesktopMoreOpen(!isDesktopMoreOpen)}
            className={`flex items-center gap-4 p-3 rounded-full hover:bg-black/5 transition-colors text-left group ${isSidebarExpanded ? 'w-full' : 'w-12 h-12 justify-center'}`}
          >
            <Menu className="w-6 h-6 text-black group-hover:scale-110 transition-transform shrink-0" strokeWidth={1.5} />
            {isSidebarExpanded && <span className="text-[17px] font-normal">More</span>}
          </button>
        </div>
      </motion.header>

      {/* =================================================================== */}
      {/* CENTER CONTENT (The Feed) */}
      {/* =================================================================== */}
      <main className="w-full max-w-[600px] border-r border-black/5 min-h-screen pb-24 md:pb-12">
        
        {/* Mobile Header (Search/Logo) */}
        <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex items-center gap-3">
          <div className="relative w-[90px] h-[30px] shrink-0">
            <Image 
              src="/logo.jpg" 
              alt="WRKZ Logo" 
              fill 
              className="object-cover object-left mix-blend-multiply" 
              priority
            />
          </div>
          <div className="flex-1 flex items-center gap-2 rounded-full px-3 h-9 w-full bg-black/5 focus-within:bg-black/10 transition-colors">
            <Search className="w-4 h-4 opacity-50 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-[14px] w-full placeholder:text-black/40"
            />
          </div>
        </div>

        {/* Desktop Sticky Header (Optional, for context) */}
        <div className="hidden md:flex sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 h-[64px] items-center">
           <h2 className="text-[20px] font-bold">Home</h2>
        </div>

        {/* Feed Posts */}
        <div className="space-y-0">
          <AnimatePresence>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onHire={() => setIsChatOpen(true)} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 opacity-50"
              >
                No posts found for "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* =================================================================== */}
      {/* RIGHT SIDEBAR (Trending / Suggestions) - Hidden on Mobile/Tablet */}
      {/* =================================================================== */}
      <aside className="hidden lg:block w-[320px] p-6 sticky top-0 h-screen shrink-0">
        {/* Search Bar for Desktop */}
        <div className="flex items-center gap-2 rounded-full px-4 h-11 w-full bg-black/5 focus-within:bg-white focus-within:ring-1 focus-within:ring-black/20 focus-within:shadow-sm transition-all mb-6">
          <Search className="w-5 h-5 text-black/40" />
          <input
            id="desktopSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creatives..."
            className="bg-transparent outline-none text-[15px] w-full placeholder:text-black/40"
          />
        </div>

        <div className="bg-[#F7F9F9] rounded-[16px] p-4">
          <h3 className="font-bold text-[18px] mb-4">Trending Niches</h3>
          <div className="space-y-4">
            {[
              { name: "AI Automation", posts: "12.4" },
              { name: "Video Editing", posts: "8.2" },
              { name: "SaaS UI/UX", posts: "5.7" }
            ].map((niche, i) => (
              <div key={i} className="flex justify-between items-center cursor-pointer hover:bg-black/5 -mx-4 px-4 py-2 transition-colors">
                <div>
                  <div className="text-[13px] text-gray-500">Trending in Tech</div>
                  <div className="font-bold text-[15px]">{niche.name}</div>
                  <div className="text-[13px] text-gray-500">{niche.posts}k posts</div>
                </div>
                <button className="text-black/40 hover:text-black"><MoreHorizontal className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* =================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 z-40 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around h-[56px] px-2 relative">
          <button className="flex flex-col items-center justify-center p-2 text-black transition-transform active:scale-95">
            <Home className="w-[26px] h-[26px]" strokeWidth={2.5} />
          </button>
          <button className="flex flex-col items-center justify-center p-2 text-black/40 hover:text-black transition-colors active:scale-95">
            <Search className="w-[26px] h-[26px]" strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="flex flex-col items-center justify-center p-2 text-black/40 hover:text-black transition-colors active:scale-95"
          >
            <PlusCircle className="w-[26px] h-[26px]" strokeWidth={1.5} />
          </button>
          
          <button className="flex flex-col items-center justify-center p-2 text-black/40 hover:text-black transition-colors active:scale-95">
            <MessageSquare className="w-[26px] h-[26px]" strokeWidth={1.5} />
          </button>

          {/* Mobile Profile Avatar Tab */}
          <div className="relative">
            <button 
              onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)} 
              className="flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
            >
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 text-white grid place-items-center text-[10px] font-bold shadow-inner">
                U
              </div>
            </button>

            {/* Mobile Profile Dropup */}
            <AnimatePresence>
              {isMobileProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-4 w-[200px] bg-white rounded-[16px] border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-2 z-50 overflow-hidden"
                >
                  <button onClick={() => { setIsMobileProfileOpen(false); if (user) router.push('/profile'); else setIsAuthModalOpen(true); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-black/5 transition-colors">
                    <User className="w-4 h-4 text-black" strokeWidth={1.5} />
                    <span className="text-[15px]">Profile</span>
                  </button>
                  <button onClick={() => { setIsMobileProfileOpen(false); alert('Settings page coming soon!'); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-black/5 transition-colors">
                    <SettingsIcon className="w-4 h-4 text-black" strokeWidth={1.5} />
                    <span className="text-[15px]">Settings</span>
                  </button>
                  <div className="h-[1px] w-full bg-black/5 my-1"></div>
                  <button onClick={async () => { setIsMobileProfileOpen(false); const { logout } = await import('@/app/actions/auth'); await logout(); window.location.reload(); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-black/5 transition-colors text-red-500">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[15px]">Log out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
