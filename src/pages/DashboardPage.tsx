import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  MapPin, 
  AlertTriangle, 
  Gauge, 
  Clock, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ShieldCheck,
  Activity,
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { MiniMap } from '../components/map/MiniMap';
import { NavViewKey } from '../components/layout/Sidebar';

interface DashboardProps {
  onNavigate: (view: NavViewKey) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { 
    parcels, 
    dataSources, 
    conflicts, 
    runPipeline, 
    isPipelineRunning,
    activeWard,
    showToast
  } = useApp();

  const totalParcels = parcels.length;
  const verifiedCount = parcels.filter(p => p.status === 'verified').length;
  const reviewCount = parcels.filter(p => p.status === 'needs_review').length;
  const conflictCount = parcels.filter(p => p.status === 'conflict').length;
  const loadedSourcesCount = dataSources.filter(d => d.loaded).length;
  const resolvedConflictsCount = conflicts.filter(c => c.status !== 'unresolved').length;

  const averageConfidence = (
    parcels.reduce((acc, p) => acc + p.confidenceScore, 0) / totalParcels
  ).toFixed(1);

  // Muted government colors for charts
  const donutData = [
    { name: 'Verified', value: verifiedCount, color: '#4FA37A' },
    { name: 'Needs Review', value: reviewCount, color: '#C99A3C' },
    { name: 'Conflicts', value: conflictCount, color: '#C4584F' },
  ];

  const confidenceBands = [
    { range: '95–100%', count: parcels.filter(p => p.confidenceScore >= 95).length },
    { range: '90–94%', count: parcels.filter(p => p.confidenceScore >= 90 && p.confidenceScore < 95).length },
    { range: '80–89%', count: parcels.filter(p => p.confidenceScore >= 80 && p.confidenceScore < 90).length },
    { range: '< 80%', count: parcels.filter(p => p.confidenceScore < 80).length },
  ];

  const timeSeriesData = [
    { batch: 'Batch 1 (09:00)', records: 8, rmse: 0.42 },
    { batch: 'Batch 2 (10:00)', records: 18, rmse: 0.28 },
    { batch: 'Batch 3 (11:00)', records: 28, rmse: 0.12 },
    { batch: 'Batch 4 (12:00)', records: 36, rmse: 0.04 },
    { batch: 'Batch 5 (13:00)', records: 40, rmse: 0.016 },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Automated Helmert CRS Transformation Complete",
      desc: "Reprojected 40 cadastral polygons to EPSG:4326 using CORS station CORS-BLR-01.",
      time: "10 mins ago",
      type: "success"
    },
    {
      id: 2,
      title: "Building Footprint Match Inferred",
      desc: "Aligned 32 rooftop polygons against drone orthomosaic with 91.4% mIoU.",
      time: "24 mins ago",
      type: "info"
    },
    {
      id: 3,
      title: "Topology Conflict Queued for Sy. 40/4",
      desc: "14.8 m² overlap detected with adjacent parcel. Recommended median snap.",
      time: "42 mins ago",
      type: "warning"
    },
    {
      id: 4,
      title: "Bhoomi Revenue RoR Synchronized",
      desc: "Mapped ownership attributes for 39 parcels using bilingual phonetic index.",
      time: "1 hour ago",
      type: "success"
    }
  ];

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Geospatial Integration</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Overview</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Geospatial Integration Dashboard
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Status of multi-source land record harmonization for {activeWard}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('pipeline')}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors cursor-pointer"
            >
              Pipeline Logs
            </button>
            <button
              onClick={runPipeline}
              disabled={isPipelineRunning}
              className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isPipelineRunning ? 'Pipeline Running...' : 'Execute Harmonization'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: Single "At a glance" 5-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          {/* Cell 1: Datasets */}
          <div 
            onClick={() => onNavigate('sources')} 
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Datasets Loaded</span>
              <Database className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {loadedSourcesCount} <span className="text-xs font-normal text-[#718096] dark:text-[#7D858E]">/ 10</span>
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              ORI, Cadastral, RoR, LiDAR
            </div>
          </div>

          {/* Cell 2: Parcels */}
          <div 
            onClick={() => onNavigate('map')} 
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Parcels Harmonized</span>
              <Layers className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {verifiedCount} <span className="text-xs font-normal text-[#718096] dark:text-[#7D858E]">/ {totalParcels}</span>
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              82.5% auto-accepted
            </div>
          </div>

          {/* Cell 3: Conflicts */}
          <div 
            onClick={() => onNavigate('conflicts')} 
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Open Conflicts</span>
              <AlertTriangle className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {conflictCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              {resolvedConflictsCount} resolved today
            </div>
          </div>

          {/* Cell 4: Confidence */}
          <div 
            onClick={() => onNavigate('confidence')} 
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Confidence Score</span>
              <Gauge className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {averageConfidence}%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Positional RMSE: 1.6 cm
            </div>
          </div>

          {/* Cell 5: Manual Effort */}
          <div 
            onClick={() => onNavigate('analytics')} 
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Turnaround Efficiency</span>
              <Clock className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              82%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              ~14 person-days saved
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Spatial Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Donut & Bar Charts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Integration Status Donut */}
            <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                  Integration Status Distribution
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
                  Parcels categorized by validation threshold
                </p>
              </div>

              <div className="h-52 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: '#22262B',
                        color: '#E8EAED',
                        border: '1px solid #2F343A'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-around text-xs pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A]">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
                    <span className="text-[#4A5568] dark:text-[#AEB4BB]">{item.name}:</span>
                    <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Confidence Score Distribution */}
            <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                  Confidence Score Spectrum
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
                  Number of parcels per confidence tier
                </p>
              </div>

              <div className="h-52 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceBands} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2F343A" opacity={0.3} />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#7D858E" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#7D858E" allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: '#22262B',
                        color: '#E8EAED',
                        border: '1px solid #2F343A'
                      }} 
                    />
                    <Bar dataKey="count" fill="#3F7CC4" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-[11px] text-[#718096] dark:text-[#7D858E] pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A]">
                Auto-acceptance threshold set at <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">90%</span>
              </p>
            </div>
          </div>

          {/* Chart 3: Records Processed & RMSE Error Over Time */}
          <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                  Throughput & Coordinate Convergence
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                  Parcels completed vs residual RMSE positional error (meters)
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#4A5568] dark:text-[#AEB4BB] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] px-2 py-0.5 rounded-[2px]">
                Final RMSE: 0.016m
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2F343A" opacity={0.3} />
                  <XAxis dataKey="batch" tick={{ fontSize: 11 }} stroke="#7D858E" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#7D858E" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#7D858E" />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: '#22262B',
                      color: '#E8EAED',
                      border: '1px solid #2F343A'
                    }} 
                  />
                  <Line yAxisId="left" type="monotone" dataKey="records" stroke="#3F7CC4" strokeWidth={2} name="Parcels Harmonized" />
                  <Line yAxisId="right" type="monotone" dataKey="rmse" stroke="#4FA37A" strokeWidth={2} strokeDasharray="3 3" name="RMSE Error (m)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Map Preview & Recent Activity */}
        <div className="space-y-6">
          {/* Mini Map Preview */}
          <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Active Ward Preview</h3>
                <p className="text-xs text-[#718096] dark:text-[#7D858E]">Ward 142 Cadastral Grid</p>
              </div>
              <button
                onClick={() => onNavigate('map')}
                className="text-xs text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Open GIS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-[2px] overflow-hidden border border-[#D5D9DE] dark:border-[#2F343A]">
              <MiniMap height="180px" />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#718096] dark:text-[#7D858E]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[1px] bg-[#4FA37A]" />
                <span>33 Verified</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[1px] bg-[#C99A3C]" />
                <span>4 Review</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[1px] bg-[#C4584F]" />
                <span>3 Conflict</span>
              </span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Recent System Activities</h3>
              <Activity className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="text-xs pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                    <span className="truncate pr-2">{act.title}</span>
                    <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-mono shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-[#4A5568] dark:text-[#AEB4BB] mt-0.5 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
