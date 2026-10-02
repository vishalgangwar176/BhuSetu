import React from 'react';
import { 
  Landmark, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  FileCheck2, 
  Compass, 
  Sparkles,
  CheckCircle2,
  Lock,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LandingView: React.FC = () => {
  const { loginAsRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-[#E6EBF5] flex flex-col justify-between selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-200/80 dark:border-[#22304A] bg-white/70 dark:bg-[#111A2E]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2545] dark:bg-[#162238] flex items-center justify-center text-teal-400 shadow-md border border-slate-200 dark:border-[#22304A]">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-[#E6EBF5]">BhuSetu</span>
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-900">
                NAKSHA Programme
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9AA8C2]">
              Department of Land Resources · Ministry of Rural Development
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsRole('Revenue Officer')}
            className="px-4 py-2 bg-[#0B2545] hover:bg-[#133863] dark:bg-[#4C8DFF] dark:hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 lg:py-16 flex flex-col items-center text-center justify-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>National Geospatial Integration Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-[#E6EBF5] max-w-4xl text-balance leading-tight">
          One platform. Every land record. <span className="text-teal-600 dark:text-teal-400">Harmonized.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-[#9AA8C2] max-w-2xl leading-relaxed text-balance">
          Seamlessly integrate drone orthomosaics (ORI), cadastral Tippani maps, state revenue registers (Bhoomi), and municipal GIS layers with sub-centimeter CORS accuracy and explainable GeoAI.
        </p>

        {/* Role Quick Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full text-left">
          {/* 1. Revenue Officer */}
          <div 
            onClick={() => loginAsRole('Revenue Officer')}
            className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A] shadow-sm hover:shadow-md hover:border-teal-500/50 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E6EBF5] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Revenue Officer
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-1 leading-snug">
              Sanction mutations, arbitrate area discrepancies, and review parcel approvals.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
              <span>Enter Revenue Portal</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Field Surveyor */}
          <div 
            onClick={() => loginAsRole('Field Surveyor')}
            className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A] shadow-sm hover:shadow-md hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E6EBF5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Field Surveyor
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-1 leading-snug">
              Mobile rover GNSS entry, ground truthing, and RTK boundary validation.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>Enter GNSS Rover</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. System Admin */}
          <div 
            onClick={() => loginAsRole('System Admin')}
            className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A] shadow-sm hover:shadow-md hover:border-purple-500/50 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E6EBF5] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              System Admin
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-1 leading-snug">
              Execute 8-stage automated pipelines, manage data streams and users.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
              <span>Enter System Console</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Public Viewer */}
          <div 
            onClick={() => loginAsRole('Public Viewer')}
            className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A] shadow-sm hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E6EBF5] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Public Viewer
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-1 leading-snug">
              Transparent, privacy-preserving parcel boundary search and citizen inquiries.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Search Public Records</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Quantitative Rigor Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full text-left">
          <div className="p-4 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A]">
            <div className="text-2xl font-bold font-mono text-[#0B2545] dark:text-[#4C8DFF]">10 Sources</div>
            <div className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-0.5">Multi-source Integration</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A]">
            <div className="text-2xl font-bold font-mono text-[#0B2545] dark:text-[#4C8DFF]">1.6 cm</div>
            <div className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-0.5">Post-CORS RMSE Accuracy</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A]">
            <div className="text-2xl font-bold font-mono text-[#0B2545] dark:text-[#4C8DFF]">82% Saved</div>
            <div className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-0.5">Manual GIS Time Reduced</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A]">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">ISO 19152</div>
            <div className="text-xs text-slate-500 dark:text-[#9AA8C2] mt-0.5">LADM Compliant Schema</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-200 dark:border-[#22304A] text-center text-xs text-slate-500 dark:text-[#6B7A96] flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full">
        <div>Department of Land Resources · Ministry of Rural Development · Government of India</div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <span>NAKSHA Programme</span>
          <span>·</span>
          <span>Survey of India</span>
        </div>
      </footer>
    </div>
  );
};
