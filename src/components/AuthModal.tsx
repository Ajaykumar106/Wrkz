"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { login, signup } from "@/app/actions/auth";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (isLogin) {
      result = await login(formData);
    } else {
      result = await signup(formData);
    }

    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
    
    setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="font-semibold text-[18px]">
            {isLogin ? "Sign in to WRKZ" : "Join WRKZ"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[13px] opacity-70 text-center mb-6">
            {isLogin ? "Welcome back to the verified freelance marketplace." : "Create an account to hire or work."}
          </p>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-[13px] text-center border border-red-100">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase mb-1 block">Full Name</label>
              <input
                name="fullName"
                type="text"
                required
                className="w-full px-4 py-3 bg-black/5 rounded-[12px] text-[14px] outline-none focus:ring-2 ring-black/10 transition-all"
                placeholder="Aarav Mehta"
              />
            </div>
          )}

          <div>
            <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-black/5 rounded-[12px] text-[14px] outline-none focus:ring-2 ring-black/10 transition-all"
              placeholder="hello@example.com"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-black/5 rounded-[12px] text-[14px] outline-none focus:ring-2 ring-black/10 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-[12px] bg-[#0A0A0A] text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-[13px] text-black/60 hover:text-black font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
