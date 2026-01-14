import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="w-full max-w-5xl mb-12 text-center no-print">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Vercel Optimized v1.2
        </div>
        
        <h1 className="text-5xl font-[900] text-slate-900 mb-4 tracking-tight">
          Cijfer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Assistent</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed font-medium">
          De onmisbare tool voor docenten om razendsnel en foutloos toetspunten om te zetten naar cijfers.
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-12">
        {children}
      </main>

      <footer className="mt-24 text-slate-400 text-sm pb-12 text-center no-print">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="w-8 h-px bg-slate-200"></div>
          <div className="font-semibold text-slate-300">ONTWIKKELD VOOR HET ONDERWIJS</div>
          <div className="w-8 h-px bg-slate-200"></div>
        </div>
        <p className="mb-2">Gemaakt door docenten, voor docenten.</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Cijfer Assistent &bull; Alle berekeningen zijn lineair.</p>
      </footer>
    </div>
  );
};