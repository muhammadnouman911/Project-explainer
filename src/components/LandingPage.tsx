import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Search, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onSearch: (username: string) => void;
}

export default function LandingPage({ onSearch }: LandingPageProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = url.replace('https://github.com/', '').split('/')[0].trim();
    if (username) {
      onSearch(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-[#09090b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-blue-600/10 rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/5">
            <Github className="w-14 h-14 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
          GitHub <br /> <span className="text-blue-500">Intelligence</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
          The professional studio for repository analysis. Decode engineering portfolios instantly using advanced Gemini models.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mt-16 group">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/username..."
              className="block w-full pl-14 pr-40 py-6 bg-[#18181b] border border-slate-800 rounded-full text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-700"
              required
            />
            <button
              type="submit"
              className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95"
            >
              Start Analysis
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Real-time Analysis
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Gemini 2.0 Engine
            </span>
          </div>
        </form>
      </motion.div>

      {/* Elegant background glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] aspect-square rounded-full bg-blue-600/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] aspect-square rounded-full bg-indigo-600/5 blur-[140px]" />
      </div>
    </div>
  );
}
