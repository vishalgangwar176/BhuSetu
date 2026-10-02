import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChangeDetectionRecord } from '../types';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { MiniMap } from '../components/map/MiniMap';

export const ChangeDetectionPage: React.FC = () => {
  const { changeRecords, updateChangeStatus, showToast } = useApp();
  const [selectedRecord, setSelectedRecord] = useState<ChangeDetectionRecord>(changeRecords[0]);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(10);

  const filteredRecords = changeRecords.filter(r => 
    typeFilter === 'All' || r.changeType === typeFilter
  );

  const pendingCount = changeRecords.filter(r => r.status === 'Pending Review').length;
  const approvedCount = changeRecords.filter(r => r.status === 'Approved').length;

  const handleDownloadCSV = () => {
    showToast("Download Initialized", "Exporting spatial change audit ledger as official CSV...", "info");
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Cadastral Audit</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Bi-temporal Change Detection</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Bi-Temporal Spatial Change Detection
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Audit spatial modifications comparing 2024 cadastral baselines against 2026 high-resolution drone orthomosaics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 4-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Total Detected Changes</span>
              <History className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {changeRecords.length}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              2024 baseline vs 2026 ORI
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {pendingCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Requires officer signoff
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Approved Changes</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {approvedCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Synced to NAKSHA registry
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Extraction Precision</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              94.2%
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Photogrammetric DSM alignment
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-[#D5D9DE] dark:border-[#2F343A] text-xs font-semibold overflow-x-auto">
        {['All', 'New Construction', 'Encroachment', 'Demolition', 'Boundary Shift'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              typeFilter === t
                ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
                : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Grid: Table & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-xs">
          <div className="p-4 border-b border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
              Spatial Modifications Audit Ledger
            </h3>
            <span className="text-xs text-[#718096] dark:text-[#7D858E]">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#E9ECF0] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] font-semibold border-b border-[#D5D9DE] dark:border-[#2F343A] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Record ID</th>
                  <th className="py-2.5 px-3">Modification Type</th>
                  <th className="py-2.5 px-3">Subject Parcel</th>
                  <th className="py-2.5 px-3 text-right">Area Delta (m²)</th>
                  <th className="py-2.5 px-3 text-center">Audit Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D9DE] dark:divide-[#2F343A]">
                {filteredRecords.map((rec, idx) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#E9ECF0]/70 dark:bg-[#22262B]'
                          : idx % 2 === 0
                          ? 'bg-white dark:bg-[#1A1D21]'
                          : 'bg-[#F8F9FA] dark:bg-[#1E2227]'
                      } hover:bg-[#E9ECF0] dark:hover:bg-[#22262B]`}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-[#1F4E8C] dark:text-[#7FB0E8]">{rec.id}</td>
                      <td className="py-3 px-3 font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{rec.changeType}</td>
                      <td className="py-3 px-3 text-[#4A5568] dark:text-[#AEB4BB]">{rec.parcelId}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#1B1F23] dark:text-[#E8EAED]">Δ {rec.areaDiffSqM}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded-[2px] border text-[10px] font-medium ${
                          rec.status === 'Approved'
                            ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                            : rec.status === 'Rejected'
                            ? 'border-[#C4584F]/40 text-[#C4584F]'
                            : 'border-[#C99A3C]/40 text-[#C99A3C]'
                        }`}>
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {rec.status === 'Pending Review' ? (
                            <>
                              <button
                                onClick={() => updateChangeStatus(rec.id, 'Approved')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-[2px] bg-[#2E7D32] dark:bg-[#4FA37A] text-white hover:opacity-90 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateChangeStatus(rec.id, 'Rejected')}
                                className="px-2 py-1 text-xs border border-[#D5D9DE] dark:border-[#2F343A] text-[#C4584F] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] rounded-[2px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-[#718096] dark:text-[#7D858E]">
                              Finalized
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
              <span>Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries</span>
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

        {/* Selected Change Inspector (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <span className="text-xs font-semibold text-[#718096] dark:text-[#7D858E]">
                Modification Inspector
              </span>
              <span className="text-xs font-mono text-[#1B1F23] dark:text-[#E8EAED]">
                Confidence: {selectedRecord.confidence}%
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                {selectedRecord.changeType} on {selectedRecord.parcelId}
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                {selectedRecord.notes}
              </p>
            </div>

            {/* Split Comparison MiniMap */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#718096] dark:text-[#7D858E]">
                <span>Imagery Verification Preview</span>
                <span className="font-mono">Δ {selectedRecord.areaDiffSqM} m²</span>
              </div>
              <div className="rounded-[2px] overflow-hidden border border-[#D5D9DE] dark:border-[#2F343A]">
                <MiniMap height="180px" focusPoint={selectedRecord.location} zoom={18} />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Detection Date:</span>
                <span className="font-mono text-[#1B1F23] dark:text-[#E8EAED]">{selectedRecord.detectedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Audit Decision:</span>
                <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{selectedRecord.status}</span>
              </div>
            </div>

            {selectedRecord.status === 'Pending Review' && (
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => updateChangeStatus(selectedRecord.id, 'Approved')}
                  className="flex-1 h-10 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity cursor-pointer"
                >
                  Confirm & Update Cadastre
                </button>
                <button
                  onClick={() => updateChangeStatus(selectedRecord.id, 'Rejected')}
                  className="h-10 px-3 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
