import { useState } from "react";
import { X, Send, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "freelancer", text: "Hey! Thanks for reaching out. I'm available to start this project immediately.", time: "10:00 AM" },
    { id: 2, sender: "client", text: "Great. I love your portfolio. We need this done by Friday. Can you guarantee the deadline?", time: "10:05 AM" },
    { id: 3, sender: "freelancer", text: "Absolutely. Once you deposit the funds into Escrow, I'll get started.", time: "10:06 AM" }
  ]);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages([
      ...messages,
      { id: Date.now(), sender: "client", text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
      >
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 text-white grid place-items-center text-[12px] font-bold shadow-inner">
              AM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-[15px]">Aarav Mehta</h2>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-[12px] text-green-600 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Online
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-60" />
          </button>
        </div>

        {/* Escrow Status Bar */}
        <div className="bg-[#FCFCFD] border-b border-black/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-600">Escrow Balance: <span className="text-black font-bold">₹0</span></span>
          </div>
          <button className="px-4 py-1.5 rounded-full bg-black text-white text-[12px] font-medium hover:bg-black/80 transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Deposit Funds
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FCFCFD]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-[20px] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                msg.sender === "client" 
                  ? "bg-black text-white rounded-br-[4px]" 
                  : "bg-white border border-black/5 text-black rounded-bl-[4px]"
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.sender === "client" ? "text-white/60 text-right" : "text-black/40"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-black/5">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message Aarav..."
              className="flex-1 px-4 py-3 bg-black/5 rounded-full text-[14px] outline-none focus:ring-2 ring-black/10 transition-all placeholder:text-black/40"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 shrink-0"
            >
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
