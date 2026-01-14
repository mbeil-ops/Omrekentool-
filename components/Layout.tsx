
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8">
      <header className="w-full max-w-5xl mb-12 text-center">
        <div className="inline-block p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Cijfer Assistent</h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
          De snelste manier om toetspunten om te zetten naar cijfers.
        </p>
      </header>
      <main className="w-full max-w-5xl flex flex-col gap-10">
        {children}
      </main>
      <footer className="mt-20 text-slate-400 text-sm pb-12">
        <div className="flex items-center justify-center gap-2 mb-2 font-medium text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Klaar voor gebruik
        </div>
        &copy; {new Date().getFullYear()} Cijfer Assistent Pro
      </footer>
    </div>
  );
};
