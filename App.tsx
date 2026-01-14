import React, { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState<number | ''>(20);
  const [showHalfPoints, setShowHalfPoints] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Formula parameters: (Points / Total) * multiplier + base
  const [multiplier, setMultiplier] = useState<number>(9);
  const [base, setBase] = useState<number>(1);

  const calculateGradeValue = useCallback((points: number, total: number, m: number, b: number): string => {
    if (total <= 0) return b.toFixed(1).replace('.', ',');
    let grade = (points / total) * m + b;
    // Standard Dutch grading limits
    grade = Math.max(1.0, Math.min(10.0, grade));
    // Standard Dutch rounding: 5,45 becomes 5,5
    return (Math.round(grade * 10) / 10).toFixed(1).replace('.', ',');
  }, []);

  const conversionTable = useMemo(() => {
    const table = [];
    const step = showHalfPoints ? 0.5 : 1;
    const max = typeof totalPoints === 'number' && totalPoints > 0 ? totalPoints : 0;
    
    for (let p = 0; p <= max; p += step) {
      table.push({
        points: p,
        grade: calculateGradeValue(p, max, multiplier, base)
      });
    }
    return table;
  }, [totalPoints, showHalfPoints, calculateGradeValue, multiplier, base]);

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
      <section className="tactile-card p-6 md:p-10 no-print">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Main Point Input */}
            <div className="bg-white p-6 md:p-8 flex flex-col items-start gap-2 shadow-[8px_8px_0px_#000000] border-2 border-black w-full md:w-auto">
              <span className="text-[10px] font-bold text-black/50 uppercase tracking-[0.2em]">Input: Totaal Aantal Punten</span>
              <div className="flex items-baseline gap-4">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-32 text-5xl font-bold text-black border-b-4 border-black focus:border-black focus:outline-none transition-all bg-transparent pb-2"
                  placeholder="0"
                  aria-label="Totaal aantal punten"
                />
                <span className="text-2xl font-black text-black uppercase tracking-tighter">PNT</span>
              </div>
            </div>

            {/* Config & Formula Info */}
            <div className="flex flex-col gap-6 flex-1 w-full">
              <div className="flex flex-wrap items-center justify-end gap-6 md:gap-8">
                {/* Multiplier Adjustment */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Factor</span>
                  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] px-3 py-2 flex items-center">
                    <input 
                      type="number" 
                      value={multiplier} 
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="w-12 font-bold text-center focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Base Adjustment */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Basis</span>
                  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] px-3 py-2 flex items-center">
                    <input 
                      type="number" 
                      value={base} 
                      onChange={(e) => setBase(Number(e.target.value))}
                      className="w-12 font-bold text-center focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="w-px h-12 bg-black/10 hidden sm:block"></div>

                {/* Resolution Toggle */}
                <label className="flex items-center gap-4 cursor-pointer select-none group pt-4 sm:pt-0">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={showHalfPoints} 
                      onChange={() => setShowHalfPoints(!showHalfPoints)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center transition-all peer-checked:bg-black group-hover:bg-black/5 group-active:scale-90 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                      <svg className={`w-6 h-6 text-white ${showHalfPoints ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-black uppercase tracking-widest">Halve punten</span>
                </label>
              </div>

              <div className="flex justify-end">
                <div className="mono text-[11px] font-bold text-black border-2 border-black px-6 py-3 bg-zinc-50 tracking-tighter">
                  FORMULE = (P/{totalPoints || '?'}) * {multiplier} + {base}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Display Matrix */}
      <section className="tactile-card min-h-[500px] flex flex-col overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-black text-white flex flex-col sm:flex-row items-center justify-end gap-4 no-print">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <input 
                type="text" 
                placeholder="" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-black border-2 border-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:bg-white focus:text-black transition-all placeholder:text-black/30"
                aria-label="Filter tabel"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={handlePrint}
              className="bg-white text-black p-2 border-2 border-white hover:bg-black hover:text-white hover:border-white transition-all active:scale-90"
              title="Afdrukken voor offline gebruik"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block p-8 border-b-2 border-black text-center">
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Cijfers Berekenen</h1>
            <p className="text-sm font-bold uppercase mt-2">Totaal: {totalPoints} punten &bull; Formule: (p/{totalPoints})*{multiplier}+{base}</p>
        </div>

        <div className="p-8 md:p-12 bg-[#fafafa] flex-1">
          {totalPoints && totalPoints > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 grade-grid">
              {filteredTable.map((row) => {
                const gradeNum = parseFloat(row.grade.replace(',', '.'));
                const isPassing = gradeNum >= 5.5;
                return (
                  <div 
                    key={row.points} 
                    className={`group flex flex-col p-4 border-2 border-black transition-all hover:bg-black hover:text-white bg-white ${!isPassing ? 'border-dashed opacity-80' : 'shadow-[4px_4px_0px_rgba(0,0,0,0.1)]'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-black uppercase tracking-widest">PNT {row.points}</span>
                      {isPassing && <div className="w-1.5 h-1.5 bg-black group-hover:bg-white rounded-full"></div>}
                    </div>
                    <span className={`text-3xl font-black mono leading-none ${!isPassing ? 'opacity-60 italic' : ''}`}>
                      {row.grade}
                    </span>
                  </div>
                );
              })}
              {filteredTable.length === 0 && (
                <div className="col-span-full py-32 text-center flex flex-col items-center justify-center border-2 border-dashed border-black/10">
                  <div className="w-16 h-16 bg-black flex items-center justify-center text-white text-3xl font-bold mb-6">?</div>
                  <h3 className="text-lg font-bold uppercase tracking-[0.3em]">Geen Matches</h3>
                  <p className="text-black/40 text-[10px] uppercase font-bold mt-2">Pas uw zoekfilter aan</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-40 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 border-4 border-black flex items-center justify-center mb-8 animate-pulse">
                <span className="text-4xl font-black">0</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.4em] mb-4">Systeem Standby</h2>
              <p className="text-black/40 text-xs uppercase font-bold max-w-xs leading-loose">Wachtend op input van puntenwaarde om de berekeningsmatrix te genereren.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default App;