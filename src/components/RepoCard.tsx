import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Star, Code2, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';
import { Repository, RepoAnalysis } from '../types';

interface RepoCardProps {
  repo: Repository;
  analysis: RepoAnalysis | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void | Promise<void>;
  index: number;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, analysis, loading, error, onAnalyze, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#18181b] rounded-2xl border border-slate-800 shadow-xl hover:border-blue-500/30 transition-all flex flex-col group overflow-hidden"
    >
      <div className="p-6 border-b border-slate-800/50 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">
                {repo.name}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                {repo.language || 'Documentation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
              repo.stargazers_count > 100 
                ? 'bg-amber-400/10 text-amber-400' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {repo.stargazers_count > 100 ? 'High Traction' : 'Stable'}
            </span>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            {repo.stargazers_count}
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 italic">
            MODIFIED: {new Date(repo.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {!analysis && !loading && !error && (
          <div className="flex-grow flex flex-col items-center justify-center py-6 text-center">
            <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-6 h-6 text-slate-600 group-hover:text-blue-400" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Intelligence Available</p>
            <p className="text-[10px] text-slate-600 max-w-[180px] mx-auto mb-6">Run AI scan to extract architectural patterns and stack data.</p>
            <button
              onClick={onAnalyze}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
            >
              Start AI Scan
            </button>
          </div>
        )}

        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-blue-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono animate-pulse tracking-widest uppercase">
              Analyzing Context...
            </p>
          </div>
        )}

        {error && (
          <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/20 text-red-400">
            <p className="text-xs font-bold uppercase tracking-widest mb-1">Process Halted</p>
            <p className="text-[10px] opacity-80 leading-relaxed">{error}</p>
            <button 
              onClick={onAnalyze}
              className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 hover:border-white transition-all pb-0.5"
            >
              Retry Protocol
            </button>
          </div>
        )}

        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <BookOpen className="w-3 h-3" /> Technical Abstract
                </h4>
                <div className="w-8 h-0.5 bg-slate-800 rounded-full" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">
                <Layers className="w-3 h-3" /> Detected Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.map((tech, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <section className="pt-5 border-t border-slate-800/50">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                </div>
                <div>
                  <h5 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">AI Recommendation</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    "{analysis.beginnerExplanation}"
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default RepoCard;

function getLangColor(lang: string) {
  const colors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-blue-400',
    Java: 'bg-orange-500',
    'C++': 'bg-pink-500',
    HTML: 'bg-orange-600',
    CSS: 'bg-indigo-500',
    Rust: 'bg-red-700',
    Go: 'bg-cyan-500'
  };
  return colors[lang] || 'bg-gray-300';
}
