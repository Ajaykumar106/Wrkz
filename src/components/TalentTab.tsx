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
        
        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <h4 className="font-bold text-[13px] text-orange-800 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> The WRKZ Guarantee
          </h4>
          <p className="text-[12px] text-orange-900/80 leading-relaxed">
            All hires require an upfront Escrow deposit. If the work is incomplete or the freelancer disappears, you get a full refund. 
            If you receive completed work and refuse to pay, you will be permanently banned from the platform and funds will be released to the freelancer. 
          </p>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-0">
        <AnimatePresence>
          {filteredTalent.length > 0 ? (
            filteredTalent.map((freelancer) => (
              <motion.article 
                key={freelancer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-b border-black/10 p-6 flex flex-col md:flex-row gap-6 hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 text-white grid place-items-center text-[18px] font-bold shadow-inner shrink-0">
                      {freelancer.users?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-[17px]">{freelancer.users?.name || "Anonymous User"}</h3>
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
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
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> Trust Score: {freelancer.trust_score}</span>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end md:justify-center items-center gap-3 shrink-0">
                  <button 
                    onClick={onHire}
                    className="h-10 px-6 rounded-full bg-black text-white text-[14px] font-bold hover:scale-105 transition-transform w-full md:w-auto"
                  >
                    Message to Hire
                  </button>
                  <button className="h-10 px-6 rounded-full border border-black/20 text-black text-[14px] font-bold hover:bg-black/5 transition-colors w-full md:w-auto">
                    View Portfolio
                  </button>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">No talent found matching your search.</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
