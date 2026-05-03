import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Github, User, Info, LayoutGrid, List as ListIcon, RefreshCw } from 'lucide-react';
import { Repository, AnalysisState } from '../types';
import RepoCard from './RepoCard';
import { analyzeRepository } from '../services/geminiService';

interface DashboardProps {
  username: string;
  onBack: () => void;
}

export default function Dashboard({ username, onBack }: DashboardProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchRepos();
  }, [username]);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repos/${username}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRepos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (repo: Repository) => {
    setAnalysisState(prev => ({
      ...prev,
      [repo.id]: { loading: true, error: null, analysis: null }
    }));

    try {
      const readmeRes = await fetch(`/api/github/readme/${repo.owner.login}/${repo.name}`);
      const readmeData = await readmeRes.json();
      
      const analysis = await analyzeRepository(
        repo.name,
        repo.description || 'No description provided.',
        readmeData.content || ''
      );

      setAnalysisState(prev => ({
        ...prev,
        [repo.id]: { loading: false, error: null, analysis }
      }));
    } catch (err: any) {
      setAnalysisState(prev => ({
        ...prev,
        [repo.id]: { loading: false, error: err.message || 'AI processing failed', analysis: null }
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 bg-[#0C0C0F] space-y-6">
        <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 animate-pulse">
           <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Accessing Neural Graph</h2>
          <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest">Bridging API @{username} ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-[#0C0C0F] p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#18181b] border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Signal Lost</h2>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            We couldn't establish a connection with "<span className="text-red-400 font-mono">@{username}</span>". 
            Ensure the profile exists and is public.
          </p>
          <button
            onClick={onBack}
            className="mt-8 w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Reconnect Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
      {/* Elegant Sidebar */}
      <aside className="w-72 border-r border-slate-800 bg-[#09090b] p-8 flex flex-col hidden lg:flex">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-8">Intelligence Summary</h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-[#111114] border border-slate-800 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Index Volume</p>
            <p className="text-3xl font-bold text-white">{repos.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Public Repositories</p>
          </div>

          <div className="p-4 bg-[#111114] border border-slate-800 rounded-2xl">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Primary Engine</p>
            <p className="text-xl font-bold text-white">Gemini 2.0</p>
            <p className="text-[10px] text-slate-500 mt-1">High-Fidelity Mode</p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Portfolio Analytics</p>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">Analyze all projects to generate a comprehensive technical summary.</p>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
              Deep Scan Portfolio
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0C0C0F] overflow-y-auto p-8 relative">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={onBack}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-mono text-sm font-bold">@{username}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                  Analysis Active
                </span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Project Portfolio Summary</h2>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#111114] border border-slate-800 rounded-xl self-start">
            <button
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-12 bg-[#18181b] rounded-3xl border border-slate-800 border-dashed">
            <Github className="w-16 h-16 text-slate-700 mb-6" />
            <h2 className="text-xl font-bold text-white">Empty Repository Stack</h2>
            <p className="text-slate-500 mt-2 max-w-sm">This profile contains no public data to analyze. Connect a different profile to start.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6" 
            : "space-y-4 max-w-4xl mx-auto"
          }>
            <AnimatePresence>
              {repos.map((repo, i) => (
                <RepoCard
                  key={repo.id}
                  index={i}
                  repo={repo}
                  analysis={analysisState[repo.id]?.analysis || null}
                  loading={analysisState[repo.id]?.loading || false}
                  error={analysisState[repo.id]?.error || null}
                  onAnalyze={() => handleAnalyze(repo)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Global Stats Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
             <img src={repos[0]?.owner.avatar_url} className="w-12 h-12 rounded-xl border border-slate-800" />
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Identity</p>
               <p className="text-sm font-bold text-white">{username}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-slate-600 font-mono">ENCRYPTED DATA SESSION // {new Date().toLocaleDateString()}</p>
             <p className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-tighter cursor-help hover:underline">Verify AI Signatures</p>
          </div>
        </div>
      </main>
    </div>
  );
}
