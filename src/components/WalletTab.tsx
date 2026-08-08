"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Building } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function WalletTab({ user }: { user: any }) {
  const [balance, setBalance] = useState(0);
  const [locked, setLocked] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchWallet = async () => {
      const supabase = createClient();
      
      // Calculate locked (funded but not released)
      const { data: lockedEscrows } = await supabase
        .from('escrows')
        .select('amount')
        .eq('freelancer_id', user.id)
        .eq('status', 'funded');
        
      const lockedTotal = lockedEscrows?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      setLocked(lockedTotal);
      
      // Calculate balance (released escrows)
      const { data: releasedEscrows } = await supabase
        .from('escrows')
        .select('amount')
        .eq('freelancer_id', user.id)
        .eq('status', 'released');
        
      const balanceTotal = releasedEscrows?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      setBalance(balanceTotal);
      
      setIsLoading(false);
    };
    fetchWallet();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
        <Wallet className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold">Sign in to view your Wallet</h3>
        <p className="text-gray-500 mt-2">Manage your escrow payments and withdraw funds.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-[600px] mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-bold">Wallet</h2>
        <button className="text-[14px] font-bold text-gray-500 hover:text-black transition-colors">
          View History
        </button>
      </div>

      <div className="bg-[#0A0A0A] rounded-[24px] p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="text-[14px] text-white/60 font-medium tracking-wide uppercase mb-2">Available Balance</div>
        <div className="text-[48px] font-bold tracking-tight leading-none mb-6">
          ₹{balance.toLocaleString()}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="text-[14px] font-medium text-white/80">Withdraw to Bank</span>
          </div>
          <button className="h-10 px-5 rounded-full bg-white text-black text-[14px] font-bold hover:scale-105 transition-transform">
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 grid place-items-center mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-[13px] text-gray-500 font-medium mb-1">Locked in Escrow</div>
          <div className="text-[20px] font-bold">₹{locked.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 grid place-items-center mb-3">
            <ArrowDownRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-[13px] text-gray-500 font-medium mb-1">Total Earned</div>
          <div className="text-[20px] font-bold">₹{(balance + locked).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
