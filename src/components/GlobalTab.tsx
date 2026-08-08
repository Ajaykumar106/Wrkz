"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Sparkles, Loader2, Lock, ShieldCheck } from "lucide-react";
import { searchGlobalOpportunities } from "@/app/actions/globalSearch";

export function GlobalTab() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>("");
  
  // Freemium Logic
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const savedSearches = localStorage.getItem('wrkz_ai_searches');
    const proStatus = localStorage.getItem('wrkz_pro_status');
    if (savedSearches) setSearchesUsed(parseInt(savedSearches));
    if (proStatus === 'true') setIsPro(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (!isPro && searchesUsed >= 1) {
      setShowPaywall(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await searchGlobalOpportunities(query);
      if (response.success) {
        setResults(response.content || "No results found.");
        const newCount = searchesUsed + 1;
        setSearchesUsed(newCount);
        localStorage.setItem('wrkz_ai_searches', newCount.toString());
      } else {
        setResults("Failed to analyze global opportunities. Please try again.");
      }
    } catch (error) {
      setResults("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // In a real app, this opens Razorpay checkout
    alert("Redirecting to Razorpay checkout for $99/Year...");
    setIsPro(true);
    setShowPaywall(false);
    localStorage.setItem('wrkz_pro_status', 'true');
  };

  return (
    <div className="pb-32 min-h-[80vh] flex flex-col relative">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[12px] font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            AI Matchmaker
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold leading-tight mb-4">
            Find the perfect match.
          </h2>
          <p className="text-[15px] text-white/70 max-w-md">
            For Clients: Find highly-vetted internal talent securely via Escrow.<br/>
            For Freelancers: Discover the top global platforms and out-reach strategies.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-6">
        <form onSubmit={handleSearch} className="relative z-10">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need a SaaS designer OR I am a video editor..."
            className="w-full h-14 pl-12 pr-32 rounded-2xl border-2 border-black/10 focus:border-black outline-none text-[15px] shadow-sm transition-all bg-white"
            disabled={isLoading || showPaywall}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim() || showPaywall}
            className="absolute inset-y-1.5 right-1.5 px-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
        {!isPro && (
          <div className="text-[12px] text-gray-500 font-medium mt-3 px-2 flex justify-between">
            <span>{searchesUsed}/1 Free Searches Used</span>
            {searchesUsed >= 1 && <span className="text-orange-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> Upgrade to Pro</span>}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="px-6 flex-1 relative z-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-gray-500"
            >
              <div className="w-12 h-12 rounded-full border-4 border-black/10 border-t-black animate-spin mb-4"></div>
              <p className="text-[15px] font-medium animate-pulse">Analyzing the global network...</p>
            </motion.div>
          ) : results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-black/10 p-6 shadow-sm prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:underline"
              dangerouslySetInnerHTML={{ __html: results }}
            />
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-gray-400 text-center"
            >
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-[15px]">The Matchmaker is waiting.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-1 relative overflow-hidden shadow-2xl group"
            >
              {/* Animated glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 rounded-3xl opacity-50 animate-[spin_4s_linear_infinite]" style={{ filter: 'blur(8px)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 rounded-3xl animate-[spin_4s_linear_infinite]"></div>
              
              <div className="bg-white rounded-[23px] relative z-10 p-8 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
                
                <h3 className="text-[28px] font-bold leading-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">Unlock WRKZ Premium</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                  You've used your free matchmaker request. Upgrade to yearly premium to unlock elite verification and unlimited AI matchmaking.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center group-hover/item:scale-110 transition-transform">
                      <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    </div>
                    <span className="font-medium text-[15px]">Verified Pro Badge on Profile</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-blue-50 grid place-items-center group-hover/item:scale-110 transition-transform">
                      <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                    </div>
                    <span className="font-medium text-[15px]">Unlimited AI Global Searches</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-orange-50 grid place-items-center group-hover/item:scale-110 transition-transform">
                      <Lock className="w-4 h-4 text-orange-500 shrink-0" />
                    </div>
                    <span className="font-medium text-[15px]">Clients must deposit Escrow upfront</span>
                  </div>
                </div>
                
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-[44px] font-black leading-none">$99</span>
                  <span className="text-gray-500 font-bold pb-1.5 uppercase tracking-wider text-[12px]">/ year</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPaywall(false)}
                    className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpgrade}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-black to-gray-800 text-white font-bold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition-all relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 rounded-xl"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">Pay with Razorpay <ArrowRight className="w-4 h-4"/></span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
