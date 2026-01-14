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
      <section className="tactile-card p-6 md:p-10 no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">Input: Totaal Aantal Punten</span>
            <div className="flex items-baseline gap-4">
              <input
                type="number"
                min="1"
                step="0.5"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-32 text-5xl font-bold text-black border-b-4 border-black/10 focus:border-black focus:outline-none transition-all bg-transparent pb-2 input-focus"
                placeholder="0"
                aria-label="Totaal aantal punten"
              />
              <span className="text-2xl font-black uppercase tracking-tighter">PNT</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <label className="flex items-center gap-4 cursor-pointer select-none group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={showHalfPoints} 
                  onChange={() => setShowHalfPoints(!showHalfPoints)}
                  className="peer sr-only"
                />
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center transition-all peer-checked:bg-black group-hover:bg-black/5 group-active:scale-90">
                  <svg className={`w-8 h-8 text-white ${showHalfPoints ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">Resolutie</span>
                <span className="text-[10px] font-medium text-black/50 uppercase">Halve punten tonen</span>
              </div>
            </label>

            <div className="hidden lg:block w-px h-12 bg-black/10"></div>

            <div className="mono text-[11px] font-bold text-black/30 border-2 border-black/5 px-4 py-2 bg-black/[0.02]">
              ALGO: GRADE = (P/{totalPoints || '?'}) * 9 + 1
            </div>
          </div>
        </div>
      </section>

      {/* Main Display Matrix */}
      <section className="tactile-card min-h-[500px] flex flex-col overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-bold">M</span>
            </div>
            <span className="font-bold uppercase tracking-[0.2em] text-xs">Resultaten Matrix</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <input 
                type="text" 
                placeholder="FILTER OP WAARDE..." 
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
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Omrekentabel Cijfer Focus</h1>
            <p className="text-sm font-bold uppercase mt-2">Totaal: {totalPoints} punten &bull; Formule: (p/{totalPoints})*9+1</p>
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
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">PNT {row.points}</span>
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

      {/* Documentation Footer Section */}
      <section className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="tactile-card p-8 bg-black text-white flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6">01 / Functionaliteit</h3>
          <p className="text-[11px] text-white/60 leading-relaxed uppercase font-medium">
            De berekening hanteert een strikte lineaire schaal. Dit betekent dat elke behaalde punt even zwaar meeweegt in de eindbeoordeling. 
            Resultaten worden afgerond op de eerste decimaal.
          </p>
        </div>
        <div className="tactile-card p-8 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6">02 / Sneltoetsen</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-black/5 pb-2">
              <span className="text-[10px] font-bold uppercase text-black/40 tracking-widest">Snel Afdrukken</span>
              <span className="mono text-[10px] font-bold bg-black text-white px-2">CTRL + P</span>
            </div>
            <div className="flex justify-between items-center border-b border-black/5 pb-2">
              <span className="text-[10px] font-bold uppercase text-black/40 tracking-widest">Opslaan</span>
              <span className="mono text-[10px] font-bold bg-black text-white px-2">CTRL + D</span>
            </div>
            <div className="flex justify-between items-center border-b border-black/5 pb-2">
              <span className="text-[10px] font-bold uppercase text-black/40 tracking-widest">Filter Focus</span>
              <span className="mono text-[10px] font-bold bg-black text-white px-2">TAB</span>
            </div>
          </div>
        </div>
        <div className="tactile-card p-8 bg-zinc-50 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6">03 / Privacy</h3>
          <p className="text-[11px] text-black/50 leading-relaxed uppercase font-bold">
            Data-loze verwerking. Geen cookies. Geen tracking. Uw berekeningen blijven volledig binnen de context van uw browser. 
            Veilig voor gebruik met gevoelige onderwijsdata.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default App;