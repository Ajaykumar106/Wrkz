"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, ImagePlus, Send } from "lucide-react";

import { createJobPost } from "@/app/actions/jobs";

export function CreatePostModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [niche, setNiche] = useState("Video Editing");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('niche', niche);
    formData.append('budget', budget);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const result = await createJobPost(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      setBudget("");
      setImagePreview(null);
      setImageFile(null);
      setError(null);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="font-semibold text-[18px]">Create New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-[13px] border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Job Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Need 10 Reels edited - fast turnaround" 
              className="w-full px-4 py-3 rounded-[12px] bg-black/5 outline-none focus:ring-2 ring-black/10 transition-all text-[14px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job, requirements, and deliverables..." 
              rows={3}
              className="w-full px-4 py-3 rounded-[12px] bg-black/5 outline-none focus:ring-2 ring-black/10 transition-all text-[14px] resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Attach Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-[12px] overflow-hidden group">
                <img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 rounded-full bg-white/90 text-black text-[13px] font-medium hover:bg-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-black/10 bg-black/[0.02] hover:bg-black/5 hover:border-black/20 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600"
              >
                <ImagePlus className="w-6 h-6" />
                <span className="text-[13px] font-medium">Click to upload image</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Niche</label>
              <select 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] bg-black/5 outline-none focus:ring-2 ring-black/10 transition-all text-[14px] appearance-none cursor-pointer"
              >
                <option>Video Editing</option>
                <option>AI Automation</option>
                <option>Brand Design</option>
                <option>UI/UX Design</option>
                <option>3D Motion</option>
                <option>Content Strategy</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Budget (₹)</label>
              <input 
                required
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 5000" 
                className="w-full px-4 py-3 rounded-[12px] bg-black/5 outline-none focus:ring-2 ring-black/10 transition-all text-[14px]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#0A0A0A] text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Publish & AI Match
                </>
              )}
            </button>
            <p className="text-center mt-3 text-[12px] opacity-50">
              The AI will immediately match this to the top 5 freelancers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
