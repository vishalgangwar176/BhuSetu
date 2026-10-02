import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Users, 
  Coins, 
  CheckCircle2, 
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';

export const AnalyticsImpactPage: React.FC = () => {
  const { showToast } = useApp();

  const turnaroundData = [
    { stage: 'Data Ingestion & Scrubbing', manualDays: 5.0, automatedMinutes: 0.1 },
    { stage: 'Geo-referencing (GCP/CORS)', manualDays: 7.5, automatedMinutes: 0.15 },
    { stage: 'Cadastral & Drone Matching', manualDays: 12.0, automatedMinutes: 0.3 },
    { stage: 'Topology & Slivers Healing', manualDays: 6.0, automatedMinutes: 0.1 },
    { stage: 'Attribute Bhoomi Linkage', manualDays: 4.5, automatedMinutes: 0.12 },
    { stage: 'Dispute & Conflict Audit', manualDays: 8.0, automatedMinutes: 0.2 },
  ];

  const outcomes = [
    {
      title: "Reduced Manual GIS Effort",
      metric: "82% Reduction",
      detail: "Shifts labor-intensive digitizing, manual edge-matching, and node-snapping to automated pipelines.",
      icon: Clock
    },
    {
      title: "Improved Accuracy & Consistency",
      metric: "1.6cm RMSE",
      detail: "Continuous CORS GNSS geodetic reference eliminates human vectorization biases and local datum distortion.",
      icon: ShieldCheck
    },
    {
      title: "Inter-Departmental Data Exchange",
      metric: "100% OGC LADM",
      detail: "Bridges silos between Revenue (Bhoomi), Urban Local Bodies, and Survey of India via ISO 19152.",
      icon: Users
    },
    {
      title: "Accelerated Cadastral Finalization",
      metric: "43 Days → 3 Days",
      detail: "Ward-level settlement cycles compressed from months to days with automated confidence gating.",
      icon: Zap
    },
    {
      title: "Public Expenditure ROI",
      metric: "₹4.8L Saved / Ward",
      detail: "Direct expenditure savings in repeat field survey visits, litigation mitigation, and manual draftsman hours.",
      icon: Coins
    },
    {
      title: "Digital Land Governance",
      metric: "Audit Provenance",
      detail: "Immutable digital trail for every boundary snap, mutation record, and surveyor decision.",
      icon: CheckCircle2
    }
  ];

  const handleDownloadCSV = () => {
    showToast("Download Initialized", "Exporting benchmark metrics as official CSV...", "info");
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Revenue Administration</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Turnaround Benchmarks</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Performance & Turnaround Benchmarks
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Empirical evaluation of automated geospatial harmonization versus legacy manual GIS workflows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 4-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Turnaround Speedup</span>
              <Clock className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              93% Faster
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              End-to-end ward settlement
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Geodetic Precision</span>
              <ShieldCheck className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              1.6 cm RMSE
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              CORS RTK benchmark
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Public Cost Savings</span>
              <Coins className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              ₹4.8 Lakh
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Per ward survey cycle
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Interoperability</span>
              <Users className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              100%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              OGC ISO 19152 compliant
            </div>
          </div>
        </div>
      </div>

      {/* Manual vs Automated Chart */}
      <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
          <div>
            <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
              Workflow Turnaround Time Comparison (Days of Effort)
            </h3>
            <p className="text-xs text-[#718096] dark:text-[#7D858E]">
              Comparative benchmark across standard 40-parcel urban ward integration lifecycle
            </p>
          </div>
          <span className="text-xs font-mono text-[#4A5568] dark:text-[#AEB4BB] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] px-2.5 py-1 rounded-[2px]">
            Comparative Metric: 40 Parcels
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={turnaroundData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2F343A" opacity={0.3} />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#7D858E" interval={0} angle={-10} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} stroke="#7D858E" label={{ value: 'Days of Manual Effort', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: '#22262B',
                  color: '#E8EAED',
                  border: '1px solid #2F343A'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="manualDays" fill="#5C8FCB" name="Manual GIS Workflow (Days)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="automatedMinutes" fill="#4FA37A" name="Automated Workflow (Days Equiv: < 10 mins)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6 Key Outcomes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {outcomes.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                  <div className="w-8 h-8 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center text-[#718096] dark:text-[#AEB4BB]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                    {item.metric}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED] mt-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#D5D9DE] dark:border-[#2F343A] text-[11px] text-[#4A5568] dark:text-[#AEB4BB]">
                Verified in Ward 142 Evaluation
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
