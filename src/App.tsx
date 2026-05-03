/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col font-sans">
      <header className="h-20 border-b border-slate-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setUsername(null)}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Desplanner <span className="text-blue-500">AI</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">GitHub Intelligence Studio</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            GitHub
          </a>
          <a 
            href="https://docs.github.com/en/rest/repos/repos" 
            target="_blank" 
            rel="noreferrer"
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700"
          >
            Docs
          </a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {!username ? (
          <LandingPage onSearch={setUsername} />
        ) : (
          <Dashboard username={username} onBack={() => setUsername(null)} />
        )}
      </main>

      {!username && (
        <footer className="py-12 border-t border-slate-800 bg-[#09090b]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-mono text-slate-500">
              AI ENGINE v2.4 // POWERED BY GOOGLE GEMINI
            </div>
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              <span>© 2026 DESPLANNER STUDIO</span>
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

