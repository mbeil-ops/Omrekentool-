import React, { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState<number | ''>(20);
  const [showHalfPoints, setShowHalfPoints] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateGradeValue = useCallback((points: number, total: number): string => {
    if (total <= 0) return "1,0";
    let grade = (points / total) * 9 + 1;
    grade = Math.max(1.0, Math.min(10.0, grade));
    // Rounding to 1 decimal place using the Dutch convention
    return (Math.round(grade * 10) / 10).toFixed(1).replace('.', ',');
  }, []);

  const conversionTable = useMemo(() => {
    const table = [];
    const step = showHalfPoints ? 0.5 : 1;
    const max = typeof totalPoints === 'number' && totalPoints > 0 ? totalPoints : 0;
    
    for (let p = 0; p <= max; p += step) {
      table.push({
        points: p,
        grade: calculateGradeValue(p, max)
      });
    }
    return table;
  }, [totalPoints, showHalfPoints, calculateGradeValue]);

  const filteredTable = useMemo(() => {
    if (!searchTerm) return conversionTable;
    const search = searchTerm.toLowerCase().trim().replace(',', '.');
    return conversionTable.filter(row => 
      row.points.toString().includes(search) || 
      row.grade.replace(',', '.').includes(search)
    );
  }, [conversionTable, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      {/* Configuration Header */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center no-print transition-all hover:shadow-md">
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Instellingen</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-2xl font-medium text-slate-400">Totaal van</span>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="0.5"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-28 px-4 py-2 text-4xl font-black text-indigo-600 bg-slate-50 border-b-4 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-center rounded-t-xl"
                placeholder="0"
              />
            </div>
            <span className="text-2xl font-medium text-slate-400">punten</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <label className="group flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={showHalfPoints} 
                  onChange={() => setShowHalfPoints(!showHalfPoints)}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
              <span className="text-slate-600 font-semibold group-hover:text-indigo-600 transition-colors">
                Halve punten tonen
              </span>
            </label>
            
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="text-sm font-mono text-slate-400 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
              Cijfer = (p / {totalPoints || '?'}) × 9 + 1
            </div>
          </div>
        </div>
      </section>

      {/* Results Table Section */}
      <section className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print-container">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10 no-print">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">Omrekentabel</h2>
              <p className="text-xs text-slate-400 font-medium">{conversionTable.length} combinaties</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <input 
                type="text" 
                placeholder="Snel zoeken (bijv. 12 of 6,5)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={handlePrint}
              className="p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl transition-all shadow-lg shadow-slate-200 group active:scale-95"
              title="Afdrukken voor nakijken"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-8">
          {totalPoints && totalPoints > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 grade-grid">
              {filteredTable.map((row) => {
                const gradeNum = parseFloat(row.grade.replace(',', '.'));
                const isPassing = gradeNum >= 5.5;
                return (
                  <div 
                    key={row.points} 
                    className={`grade-card group flex flex-col p-4 rounded-2xl border transition-all ${
                      isPassing 
                        ? 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300' 
                        : 'bg-rose-50/40 border-rose-100 hover:bg-rose-50 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Punten</span>
                      {isPassing && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                      <span className="text-xl font-bold text-slate-800">{row.points}</span>
                      <span className={`text-2xl font-black ${isPassing ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {row.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredTable.length === 0 && (
                <div className="col-span-full py-32 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Geen matches gevonden</h3>
                  <p className="text-slate-400">Probeer een andere zoekterm.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-200 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Stel de punten in</h2>
              <p className="text-slate-500 max-w-xs mx-auto">Vul hierboven het maximaal aantal te behalen punten in om de tabel te zien.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Info Card */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl no-print relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Pro Tip voor Nakijkers
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Sla deze pagina op in je favorieten (Ctrl+D). Zo heb je bij elke toets direct de juiste tabel bij de hand. 
            Onze tool werkt offline nadat de pagina is geladen, dus je kunt overal ongestoord nakijken.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default App;