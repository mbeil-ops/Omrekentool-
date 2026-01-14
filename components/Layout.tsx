import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 bg-white">
      <header className="w-full max-w-4xl mb-12 text-center no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black text-[10px] font-bold uppercase tracking-widest mb-6">
          System v2.0 // Focus Mode
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tighter uppercase">
          Cijfer <span className="bg-black text-white px-2">Focus</span>
        </h1>
        <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed font-medium uppercase tracking-tight">
          Elimineer ruis. Bereken resultaten.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8">
        {children}
      </main>

      <footer className="mt-24 text-black/40 text-[10px] pb-12 text-center no-print uppercase tracking-[0.2em]">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-8 h-[2px] bg-black/10"></div>
          <div>Einde van document</div>
          <div className="w-8 h-[2px] bg-black/10"></div>
        </div>
        <p>&copy; {new Date().getFullYear()} Cijfer Focus &bull; Gebouwd voor efficiëntie</p>
      </footer>
    </div>
  );
};