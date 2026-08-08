"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CheckCircle2, MapPin, Briefcase, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function TalentTab({ onHire, searchQuery }: { onHire: () => void, searchQuery: string }) {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTalent = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select(`
          *,
          users!freelancer_profiles_user_id_fkey (name, avatar_url)
        `)
        .order('trust_score', { ascending: false });
        
      if (!error && data) {
        setFreelancers(data);
      }
      setIsLoading(false);
    };
    fetchTalent();
  }, []);

  const filteredTalent = freelancers.filter(f => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (f.users?.name?.toLowerCase().includes(query)) ||
      (f.niches?.[0]?.toLowerCase().includes(query)) ||
      (f.bio?.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading talent...</div>;
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="p-6 border-b border-black/5 bg-white/50">
        <h2 className="text-[20px] font-bold flex items-center gap-2">
          <Users className="w-5 h-5" /> Discover Talent
        </h2>
        <p className="text-[14px] text-gray-500 mt-1">Hire top vetted freelancers directly via Escrow.</p>
        
        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <h4 className="font-bold text-[13px] text-orange-800 flex items-center gap-1.5 mb-1 relative z-10">
            <ShieldCheck className="w-4 h-4" /> The WRKZ Guarantee
          </h4>
          <p className="text-[12px] text-orange-900/80 leading-relaxed relative z-10">
            All hires require an upfront Escrow deposit. If the work is incomplete or the freelancer disappears, you get a full refund. 
            If you receive completed work and refuse to pay, you will be permanently banned from the platform and funds will be released to the freelancer. 
          </p>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-0">
        <AnimatePresence>
          {filteredTalent.length > 0 ? (
            filteredTalent.map((freelancer, index) => {
              // Determine Tier based on Trust Score
              const score = freelancer.trust_score || 0;
              const isElite = score >= 90;
              const isPro = score >= 70 && score < 90;
              const isVerified = score >= 50 && score < 70;

              return (
                <motion.article 
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                  className="bg-white border-b border-black/10 p-6 flex flex-col md:flex-row gap-6 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4 relative">
                      <div className={`w-14 h-14 rounded-full grid place-items-center text-[18px] font-bold shadow-inner shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105
                        ${isElite ? 'bg-gradient-to-br from-black via-gray-800 to-black text-white ring-2 ring-black/10' : 
                          isPro ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-white ring-2 ring-yellow-400/30' : 
                          'bg-gradient-to-tr from-gray-900 to-gray-600 text-white'}`}
                      >
                        {isElite && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>}
                        <span className="relative z-10">{freelancer.users?.name?.charAt(0) || "U"}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[17px]">{freelancer.users?.name || "Anonymous User"}</h3>
                          {isElite && (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black shadow-sm" title="Elite Verified (Top 1%)">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {isPro && (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm" title="Pro Verified">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" title="Identity Verified" />
                          )}
                        </div>
                        <div className="text-[14px] text-black font-medium mt-0.5">
                          {freelancer.niches?.[0] || "General"}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[14px] leading-relaxed text-gray-600 mb-4 line-clamp-3">
                      {freelancer.bio || "No bio provided."}
                    </p>
                    
                    <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Global</span>
                      <span className={`flex items-center gap-1 font-bold ${isElite ? 'text-black' : isPro ? 'text-amber-600' : ''}`}>
                        <Briefcase className="w-4 h-4"/> Trust Score: {score}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end md:justify-center items-center gap-3 shrink-0">
                    <motion.button 
                      onClick={onHire}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-10 px-6 rounded-full bg-black text-white text-[14px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full md:w-auto overflow-hidden relative"
                    >
                      <span className="relative z-10">Message to Hire</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      className="h-10 px-6 rounded-full border border-black/20 text-black text-[14px] font-bold transition-colors w-full md:w-auto"
                    >
                      View Portfolio
                    </motion.button>
                  </div>
                </motion.article>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-500">No talent found matching your search.</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
