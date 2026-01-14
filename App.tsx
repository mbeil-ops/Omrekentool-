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
      {/* Control Panel */}
      <section className="tactile-card p-8 no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Input Parameter</span>
            <div className="flex items-baseline gap-3">
              <input
                type="number"
                min="1"
                step="0.5"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-24 text-4xl font-bold text-black border-b-2 border-black/10 focus:border-black focus:outline-none transition-all bg-transparent p-1 input-focus"
                placeholder="0"
              />
              <span className="text-xl font-bold uppercase">Punten</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={showHalfPoints} 
                  onChange={() => setShowHalfPoints(!showHalfPoints)}
                  className="peer sr-only"
                />
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center transition-colors peer-checked:bg-black group-active:scale-95">
                  <svg className={`w-6 h-6 text-white ${showHalfPoints ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Halve Punten</span>
            </label>

            <div className="hidden md:block w-px h-10 bg-black/10"></div>

            <div className="mono text-[10px] text-black/40 border border-black/10 px-3 py-1">
              F: (P/{totalPoints || '?'})*9+1
            </div>
          </div>
        </div>
      </section>

      {/* Main Display */}
      <section className="tactile-card min-h-[400px] flex flex-col">
        <div className="p-6 border-b-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">Output Matrix</span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <input 
                type="text" 
                placeholder="Zoeken..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border-2 border-black text-xs font-bold uppercase tracking-tight focus:outline-none focus:bg-black focus:text-white transition-all placeholder:text-black/20"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={handlePrint}
              className="tactile-button p-2"
              title="Afdrukken"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {totalPoints && totalPoints > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 grade-grid">
              {filteredTable.map((row) => {
                const gradeNum = parseFloat(row.grade.replace(',', '.'));
                const isPassing = gradeNum >= 5.5;
                return (
                  <div 
                    key={row.points} 
                    className={`group flex flex-col p-3 border-2 border-black transition-all hover:bg-black hover:text-white ${isPassing ? '' : 'border-dashed'}`}
                  >
                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter mb-1">PNT {row.points}</span>
                    <span className={`text-2xl font-black mono ${!isPassing ? 'italic' : ''}`}>
                      {row.grade}
                    </span>
                  </div>
                );
              })}
              {filteredTable.length === 0 && (
                <div className="col-span-full py-20 text-center flex flex-col items-center">
                  <span className="text-4xl mb-4 grayscale">🔍</span>
                  <p className="font-bold uppercase text-xs tracking-[0.3em]">Geen Data Gevonden</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-dashed border-black flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-black/20">?</span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-2">Systeem Inactief</h2>
              <p className="text-black/40 text-xs uppercase font-medium">Voer een puntenwaarde in om de matrix te genereren</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-black p-6 bg-black text-white">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">Status: Operationeel</h3>
          <p className="text-[10px] text-white/60 leading-relaxed uppercase">
            Deze applicatie draait lokaal en slaat geen gegevens op. Uw privacy is gegarandeerd. 
            Gebruik de zoekfunctie om resultaten direct te filteren.
          </p>
        </div>
        <div className="border-2 border-black p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">Sneltoetsen</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-black/40">Print Tabel</span>
              <span>CTRL + P</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-black/40">Browser Favoriet</span>
              <span>CTRL + D</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default App;