"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { searchGlobalOpportunities } from "@/app/actions/globalSearch";

export function GlobalTab() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await searchGlobalOpportunities(query);
      if (response.success) {
        setResults(response.content || "No results found.");
      } else {
        setResults("Failed to analyze global opportunities. Please try again.");
      }
    } catch (error) {
      setResults("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-32 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[12px] font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            AI Career Assistant
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold leading-tight mb-4">
            Find work <br/>anywhere in the world.
          </h2>
          <p className="text-[15px] text-white/70 max-w-md">
            Don't limit yourself to one platform. Tell our AI what you do, and it will aggregate the best global platforms, hidden opportunities, and outreach strategies perfectly tailored to your niche.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I do SaaS UI/UX design. Where should I find high-paying clients?"
            className="w-full h-14 pl-12 pr-32 rounded-2xl border-2 border-black/10 focus:border-black outline-none text-[15px] shadow-sm transition-all bg-white"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute inset-y-1.5 right-1.5 px-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="px-6 flex-1">
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
              <p className="text-[15px] font-medium animate-pulse">Aggregating global opportunities...</p>
            </motion.div>
          ) : results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-black/10 p-6 shadow-sm prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-a:text-blue-600"
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
              <p className="text-[15px]">Enter your skills above to run a global search.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
