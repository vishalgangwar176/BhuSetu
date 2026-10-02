import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopologyIssue } from '../types';
import { 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  EyeOff, 
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { MiniMap } from '../components/map/MiniMap';

export const TopologyPage: React.FC = () => {
  const { 
    topologyIssues, 
    autoFixTopologyIssue, 
    autoFixAllTopology, 
    ignoreTopologyIssue, 
    showToast 
  } = useApp();

  const [selectedIssue, setSelectedIssue] = useState<TopologyIssue>(topologyIssues[0]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const activeIssues = topologyIssues.filter(i => i.status === 'detected');
  const fixedCount = topologyIssues.filter(i => i.status === 'auto_fixed').length;

  const filteredIssues = topologyIssues.filter(i => {
    if (severityFilter === 'all') return true;
    return i.severity === severityFilter;
  });

  const handleDownloadCSV = () => {
    showToast("Download Initialized", "Exporting topology audit log as official CSV...", "info");
  };

  const handleDownloadPDF = () => {
    showToast("Download Initialized", "Generating official Planar Topology Gazette PDF...", "info");
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
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Topology & Planar Rules</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Boundary Geometry & Planar Topology Rules
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Enforce planarity constraints, vertex snapping tolerances, and sliver polygon resolution across ward parcels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Log</span>
            </button>
            <button
              onClick={autoFixAllTopology}
              disabled={activeIssues.length === 0}
              className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Fix All Auto-Correctable ({activeIssues.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 4-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Detected Anomalies</span>
              <AlertTriangle className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {topologyIssues.length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Planar boundary rules
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Auto-Repaired</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {fixedCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Vertex snapping applied
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Pending Review</span>
              <ShieldCheck className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {activeIssues.length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Exceeds auto-snap radius
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Planar Integrity</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              99.8%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Zero gap/overlap surface
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Issues Table + Mini Map Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-xs">
          <div className="p-4 border-b border-[#D5D9DE] dark:border-[#2F343A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Topology Discrepancy Queue
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                Tolerance benchmark: 0.20m snap radius
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[#718096] dark:text-[#7D858E]">Severity:</label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] text-xs text-[#1B1F23] dark:text-[#E8EAED]"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#E9ECF0] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] font-semibold border-b border-[#D5D9DE] dark:border-[#2F343A] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Rule ID</th>
                  <th className="py-2.5 px-3">Anomaly Type</th>
                  <th className="py-2.5 px-3">Affected Parcels</th>
                  <th className="py-2.5 px-3 text-right">Affected Area (m²)</th>
                  <th className="py-2.5 px-3 text-center">Severity</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D9DE] dark:divide-[#2F343A]">
                {filteredIssues.map((issue, idx) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  return (
                    <tr
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#E9ECF0]/70 dark:bg-[#22262B]'
                          : idx % 2 === 0
                          ? 'bg-white dark:bg-[#1A1D21]'
                          : 'bg-[#F8F9FA] dark:bg-[#1E2227]'
                      } hover:bg-[#E9ECF0] dark:hover:bg-[#22262B]`}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-[#1F4E8C] dark:text-[#7FB0E8]">{issue.id}</td>
                      <td className="py-3 px-3 font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{issue.type}</td>
                      <td className="py-3 px-3 text-[#4A5568] dark:text-[#AEB4BB]">
                        {issue.parcelA} {issue.parcelB ? `↔ ${issue.parcelB}` : ''}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#1B1F23] dark:text-[#E8EAED]">{issue.areaAffectedSqM}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded-[2px] border text-[10px] font-medium ${
                          issue.severity === 'high'
                            ? 'border-[#C4584F]/40 text-[#C4584F]'
                            : issue.severity === 'medium'
                            ? 'border-[#C99A3C]/40 text-[#C99A3C]'
                            : 'border-[#4FA37A]/40 text-[#4FA37A]'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {issue.status === 'detected' ? (
                            <>
                              <button
                                onClick={() => autoFixTopologyIssue(issue.id)}
                                className="px-2.5 py-1 text-xs font-semibold rounded-[2px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 cursor-pointer"
                              >
                                Auto-Fix
                              </button>
                              <button
                                onClick={() => ignoreTopologyIssue(issue.id)}
                                className="p-1 text-[#718096] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] cursor-pointer"
                                title="Ignore Issue"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : issue.status === 'auto_fixed' ? (
                            <span className="text-[11px] font-medium text-[#4FA37A] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Fixed</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#718096] dark:text-[#7D858E]">
                              Ignored
                            </span>
                          )}
                        </div>
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
              <span>Showing 1 to {filteredIssues.length} of {filteredIssues.length} entries</span>
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

        {/* Selected Issue Preview & Mini Map (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <span className="text-xs font-semibold text-[#718096] dark:text-[#7D858E]">
                Geometric Inspector
              </span>
              <span className="text-xs font-mono text-[#1B1F23] dark:text-[#E8EAED]">
                Affected: {selectedIssue.areaAffectedSqM} m²
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                {selectedIssue.type} on {selectedIssue.parcelA}
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                {selectedIssue.description}
              </p>
            </div>

            {/* Before / After Mini Map Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#718096] dark:text-[#7D858E]">
                <span>Spatial Snapping Node</span>
                <span className="font-mono">Node: [12.9684, 77.6415]</span>
              </div>
              <div className="rounded-[2px] overflow-hidden border border-[#D5D9DE] dark:border-[#2F343A]">
                <MiniMap height="180px" focusPoint={selectedIssue.location} zoom={18} />
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] text-xs">
              <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] block mb-1">
                Correction Recipe
              </span>
              <p className="text-[#4A5568] dark:text-[#AEB4BB] text-[11px] leading-relaxed">
                {selectedIssue.suggestedAction}
              </p>
            </div>

            {selectedIssue.status === 'detected' && (
              <button
                onClick={() => autoFixTopologyIssue(selectedIssue.id)}
                className="w-full h-10 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Execute Auto-Correction</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
