import { useState } from "react";
import { X, Loader2, ArrowRight } from "lucide-react";
import { createFreelancerProfile } from "@/app/actions/freelancers";

export function OnboardingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('niche', niche);
      formData.append('bio', bio);
      if (portfolioLink) formData.append('portfolioLink', portfolioLink);

      const result = await createFreelancerProfile(formData);

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        setNiche("");
        setBio("");
        setPortfolioLink("");
        setError(null);
        setStep(1);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black text-white grid place-items-center text-[10px] font-bold">
              {step}
            </div>
            <h2 className="font-semibold text-[16px]">Freelancer Onboarding</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold tracking-tight">What is your superpower?</h3>
                <p className="text-[14px] opacity-60 leading-relaxed">
                  Select your primary niche. The AI will use this to match you with clients instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Video Editing", "AI Automation", "Brand Design", "UI/UX Design", "3D Motion", "Content Strategy"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNiche(n)}
                    className={`p-4 rounded-[16px] text-left transition-all ${
                      niche === n 
                        ? "bg-black text-white shadow-md scale-[0.98]" 
                        : "bg-black/5 hover:bg-black/10 text-black"
                    }`}
                  >
                    <div className="font-semibold text-[14px]">{n}</div>
                  </button>
                ))}
              </div>

              <button 
                type="button"
                disabled={!niche}
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-full bg-[#0A0A0A] text-white font-medium flex items-center justify-center gap-2 hover:-translate-y-[1px] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-6"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold tracking-tight">Tell the AI about your work</h3>
                <p className="text-[14px] opacity-60 leading-relaxed">
                  Write a short bio. The Gemini AI will read this to generate your vector embedding so you show up in the Top 5 for relevant jobs.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-[13px] border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium opacity-70">Your Bio</label>
                <textarea 
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g., I build high-converting SaaS landing pages using Next.js and Tailwind..." 
                  rows={4}
                  className="w-full px-4 py-3 rounded-[16px] bg-black/5 border-transparent focus:border-black/20 focus:bg-white outline-none transition-all text-[14px] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium opacity-70">Portfolio Link (Optional)</label>
                <input 
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://dribbble.com/..." 
                  className="w-full px-4 py-3 rounded-[16px] bg-black/5 border-transparent focus:border-black/20 focus:bg-white outline-none transition-all text-[14px]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-12 px-6 rounded-full bg-black/5 text-black font-medium hover:bg-black/10 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !bio}
                  className="flex-1 h-12 rounded-full bg-[#0A0A0A] text-white font-medium flex items-center justify-center gap-2 hover:-translate-y-[1px] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Generate AI Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
