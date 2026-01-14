
import React, { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState<number>(20);
  const [showHalfPoints, setShowHalfPoints] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateGradeValue = useCallback((points: number, total: number): string => {
    if (total <= 0) return "1.0";
    let grade = (points / total) * 9 + 1;
    grade = Math.max(1.0, Math.min(10.0, grade));
    // Afronden volgens de Nederlandse 5,45 -> 5,5 regel
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
    const search = searchTerm.toLowerCase().replace(',', '.');
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
      {/* Configuration Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center no-print">
        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Configuratie</h2>
        <div className="flex flex-col items-center gap-4">
          <label className="text-3xl font-black text-slate-800">
            Totaal: 
            <input
              type="number"
              min="1"
              value={totalPoints}
              onChange={(e) => setTotalPoints(Number(e.target.value))}
              className="mx-4 w-28 px-2 py-1 border-b-4 border-indigo-500 text-indigo-600 focus:outline-none focus:border-indigo-700 text-center transition-all bg-transparent appearance-none"
            />
            punten
          </label>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium hover:text-indigo-600 transition-colors">
              <input 
                type="checkbox" 
                checked={showHalfPoints} 
                onChange={() => setShowHalfPoints(!showHalfPoints)}
                className="w-5 h-5 accent-indigo-600 rounded"
              />
              Toon halve punten
            </label>
            <div className="text-xs text-slate-400 font-mono bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              Formule: (p / {totalPoints || '?'}) × 9 + 1
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Table Container */}
      <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print-container">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Omrekentabel
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Zoek score of cijfer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full transition-all shadow-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={handlePrint}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
              title="Print tabel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredTable.map((row) => {
              const gradeNum = parseFloat(row.grade.replace(',', '.'));
              return (
                <div 
                  key={row.points} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${gradeNum >= 5.5 ? 'bg-emerald-50/30 border-emerald-100 text-emerald-900' : 'bg-rose-50/30 border-rose-100 text-rose-900'}`}
                >
                  <span className="text-slate-500 font-bold text-sm">{row.points}</span>
                  <span className="font-black text-base">
                    {row.grade}
                  </span>
                </div>
              );
            })}
          </div>
          
          {filteredTable.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-slate-300 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400 italic font-medium">Geen resultaten voor "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 text-slate-600 text-sm shadow-sm no-print">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hoe het werkt
        </h3>
        <p className="leading-relaxed">
          Deze tool berekent een lineaire schaal. Bij 0 punten krijg je een 1,0 en bij het maximaal aantal punten een 10,0. 
          Resultaten worden afgerond op één decimaal. Gebruik de print-knop om de tabel op papier te krijgen voor tijdens het nakijken.
        </p>
      </section>
    </Layout>
  );
};

export default App;
