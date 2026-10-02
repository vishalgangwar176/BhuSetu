import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Gauge, 
  Sliders, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpDown,
  ChevronRight,
  Download
} from 'lucide-react';
import { Parcel } from '../types';

export const ConfidenceScoringPage: React.FC = () => {
  const { 
    parcels, 
    confidenceThresholds, 
    setConfidenceThresholds, 
    setSelectedParcel,
    showToast 
  } = useApp();

  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'confidenceScore' | 'surveyNo' | 'areaDeltaPercent'>('confidenceScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [pageSize, setPageSize] = useState<number>(10);

  const avgConfidence = (
    parcels.reduce((acc, p) => acc + p.confidenceScore, 0) / parcels.length
  ).toFixed(1);

  const filteredParcels = parcels
    .filter(p => {
      const matchSearch = p.surveyNo.toLowerCase().includes(search.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());

      const matchTier = 
        selectedFilter === 'all' ? true :
        selectedFilter === 'high' ? p.confidenceScore >= confidenceThresholds.autoAccept :
        selectedFilter === 'medium' ? (p.confidenceScore < confidenceThresholds.autoAccept && p.confidenceScore >= confidenceThresholds.reviewThreshold) :
        p.confidenceScore < confidenceThresholds.reviewThreshold;

      return matchSearch && matchTier;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const handleSort = (field: 'confidenceScore' | 'surveyNo' | 'areaDeltaPercent') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleDownloadCSV = () => {
    showToast("Download Initialized", "Exporting ISO 19157 quality matrix as official CSV...", "info");
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Geodetic Quality</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">ISO 19157 Quality Matrix</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Confidence Scoring & ISO 19157 Quality Matrix
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Multivariate quality index synthesizing positional accuracy, attribute concordance, and topological consensus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 4-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Ward Mean Confidence</span>
              <Gauge className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {avgConfidence}%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Ward 142 cadastral envelope
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Auto-Accept Verification</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {parcels.filter(p => p.confidenceScore >= confidenceThresholds.autoAccept).length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Score ≥ {confidenceThresholds.autoAccept}% threshold
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Human Review Tier</span>
              <AlertTriangle className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {parcels.filter(p => p.confidenceScore < confidenceThresholds.autoAccept && p.confidenceScore >= confidenceThresholds.reviewThreshold).length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              {confidenceThresholds.reviewThreshold}%–{confidenceThresholds.autoAccept - 1}% bracket
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Conflict Discrepancy</span>
              <ShieldCheck className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {parcels.filter(p => p.confidenceScore < confidenceThresholds.reviewThreshold).length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Score &lt; {confidenceThresholds.reviewThreshold}% tolerance
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Controller Card */}
      <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1F4E8C] dark:text-[#7FB0E8]" />
            <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
              Acceptance Threshold Governor
            </h3>
          </div>
          <span className="text-xs text-[#718096] dark:text-[#7D858E]">
            Auto-Accept: ≥ {confidenceThresholds.autoAccept}% · Review: {confidenceThresholds.reviewThreshold}%–{confidenceThresholds.autoAccept - 1}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Auto-accept */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#4A5568] dark:text-[#AEB4BB]">Auto-Accept Verification Cutoff</span>
              <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{confidenceThresholds.autoAccept}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="98"
              value={confidenceThresholds.autoAccept}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setConfidenceThresholds({
                  ...confidenceThresholds,
                  autoAccept: val
                });
              }}
              className="w-full h-1 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] appearance-none cursor-pointer accent-[#1F4E8C] dark:accent-[#3F7CC4]"
            />
            <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Parcels scoring above this are marked verified without surveyor review.</span>
          </div>

          {/* Slider 2: Review threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#4A5568] dark:text-[#AEB4BB]">Human Review Minimum Floor</span>
              <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{confidenceThresholds.reviewThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="85"
              value={confidenceThresholds.reviewThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setConfidenceThresholds({
                  ...confidenceThresholds,
                  reviewThreshold: val
                });
              }}
              className="w-full h-1 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] appearance-none cursor-pointer accent-[#1F4E8C] dark:accent-[#3F7CC4]"
            />
            <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Parcels below this floor are automatically routed to the Spatial Conflict queue.</span>
          </div>
        </div>
      </div>

      {/* Parcel-wise Score Table */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-xs">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-[#D5D9DE] dark:border-[#2F343A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parcel or owner name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 h-10 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
            />
          </div>

          <div className="flex items-center gap-1 border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-0.5 bg-[#F4F5F7] dark:bg-[#22262B] text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                selectedFilter === 'all' ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs' : 'text-[#4A5568] dark:text-[#AEB4BB]'
              }`}
            >
              All (40)
            </button>
            <button
              onClick={() => setSelectedFilter('high')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                selectedFilter === 'high' ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs' : 'text-[#4A5568] dark:text-[#AEB4BB]'
              }`}
            >
              Auto-Accept (≥{confidenceThresholds.autoAccept}%)
            </button>
            <button
              onClick={() => setSelectedFilter('medium')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                selectedFilter === 'medium' ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs' : 'text-[#4A5568] dark:text-[#AEB4BB]'
              }`}
            >
              Review Tier
            </button>
            <button
              onClick={() => setSelectedFilter('low')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                selectedFilter === 'low' ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs' : 'text-[#4A5568] dark:text-[#AEB4BB]'
              }`}
            >
              Conflict (&lt;{confidenceThresholds.reviewThreshold}%)
            </button>
          </div>
        </div>

        {/* Dense Tabular Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#E9ECF0] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] font-semibold border-b border-[#D5D9DE] dark:border-[#2F343A] sticky top-0">
              <tr>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('surveyNo')}>
                  <div className="flex items-center gap-1">
                    <span>Survey / Plot</span>
                    <ArrowUpDown className="w-3 h-3 text-[#718096]" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Registered Owner</th>
                <th className="py-2.5 px-3 text-right">RoR Deed (m²)</th>
                <th className="py-2.5 px-3 text-right">ORI Measured (m²)</th>
                <th className="py-2.5 px-3 text-right">Positional</th>
                <th className="py-2.5 px-3 text-right">Attribute</th>
                <th className="py-2.5 px-3 text-right">Topology</th>
                <th className="py-2.5 px-3 text-right">Consensus</th>
                <th className="py-2.5 px-3 cursor-pointer text-right" onClick={() => handleSort('confidenceScore')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Final Score</span>
                    <ArrowUpDown className="w-3 h-3 text-[#718096]" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5D9DE] dark:divide-[#2F343A]">
              {filteredParcels.map((parcel, idx) => {
                return (
                  <tr
                    key={parcel.id}
                    onClick={() => {
                      setSelectedParcel(parcel);
                      showToast("Parcel Selected", `${parcel.surveyNo} loaded into memory.`, "info");
                    }}
                    className={`cursor-pointer transition-colors ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-[#1A1D21]'
                        : 'bg-[#F8F9FA] dark:bg-[#1E2227]'
                    } hover:bg-[#E9ECF0] dark:hover:bg-[#22262B]`}
                  >
                    <td className="py-3 px-3 font-mono font-medium text-[#1F4E8C] dark:text-[#7FB0E8]">
                      {parcel.surveyNo}
                      <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-normal block">{parcel.id}</span>
                    </td>
                    <td className="py-3 px-3 text-[#1B1F23] dark:text-[#E8EAED]">
                      {parcel.ownerName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#718096] dark:text-[#AEB4BB]">{parcel.recordAreaSqM}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{parcel.measuredAreaSqM}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#718096] dark:text-[#AEB4BB]">{parcel.scoreBreakdown.positional}%</td>
                    <td className="py-3 px-3 text-right font-mono text-[#718096] dark:text-[#AEB4BB]">{parcel.scoreBreakdown.attribute}%</td>
                    <td className="py-3 px-3 text-right font-mono text-[#718096] dark:text-[#AEB4BB]">{parcel.scoreBreakdown.topology}%</td>
                    <td className="py-3 px-3 text-right font-mono text-[#718096] dark:text-[#AEB4BB]">{parcel.scoreBreakdown.sourceAgreement}%</td>
                    <td className="py-3 px-3 font-mono text-sm font-semibold text-right text-[#1B1F23] dark:text-[#E8EAED]">
                      {parcel.confidenceScore}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded-[2px] border text-[10px] font-medium ${
                        parcel.confidenceScore >= confidenceThresholds.autoAccept
                          ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                          : parcel.confidenceScore >= confidenceThresholds.reviewThreshold
                          ? 'border-[#C99A3C]/40 text-[#C99A3C]'
                          : 'border-[#C4584F]/40 text-[#C4584F]'
                      }`}>
                        {parcel.confidenceScore >= confidenceThresholds.autoAccept ? 'Verified' : parcel.confidenceScore >= confidenceThresholds.reviewThreshold ? 'Review' : 'Conflict'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-xs text-[#718096] dark:text-[#7D858E] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] text-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>Showing 1 to {filteredParcels.length} of {filteredParcels.length} entries</span>
          </div>

          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] bg-white dark:bg-[#1A1D21] disabled:opacity-50">
              Previous
            </button>
            <span className="px-2 py-1 font-semibold text-[#1B1F23] dark:text-[#E8EAED]">1</span>
            <button disabled className="px-2.5 py-1 border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] bg-white dark:bg-[#1A1D21] disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
