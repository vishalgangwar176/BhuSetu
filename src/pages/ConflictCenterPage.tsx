import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConflictItem, GroundingCitation } from '../types';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Download,
  Info
} from 'lucide-react';

export const ConflictCenterPage: React.FC = () => {
  const { conflicts, resolveConflict, userRole, verifyWithGuidelines, showToast } = useApp();
  const [selectedConflictId, setSelectedConflictId] = useState<string>(conflicts[0]?.id || '');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedGuidelines, setVerifiedGuidelines] = useState<Record<string, { text: string; citations: GroundingCitation[] }>>({});

  const selectedConflict = conflicts.find(c => c.id === selectedConflictId) || conflicts[0];

  const handleVerify = async (e: React.MouseEvent, conflict: ConflictItem) => {
    e.stopPropagation();
    setVerifyingId(conflict.id);
    showToast("Consulting Guidelines", "Checking resolution parameters against NAKSHA statutory standards...", "info");

    try {
      const res = await verifyWithGuidelines(conflict);
      setVerifiedGuidelines(prev => ({
        ...prev,
        [conflict.id]: {
          text: res.text,
          citations: res.citations
        }
      }));
      showToast("Guideline Verification Complete", "Statutory references retrieved from official gazettes.", "success");
    } catch (err: any) {
      showToast("Verification Notice", err.message || "Using cached departmental guidelines.", "info");
    } finally {
      setVerifyingId(null);
    }
  };

  const unresolvedCount = conflicts.filter(c => c.status === 'unresolved').length;
  const resolvedCount = conflicts.filter(c => c.status !== 'unresolved').length;

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Dispute Arbitration</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Conflict Center</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Spatial Conflict Resolution & Arbitration Center
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Statutory arbitration workflow evaluating discrepancies between legacy Tippani vectors, Bhoomi RoR records, and drone orthomosaics.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#B78103] dark:text-[#C99A3C] font-semibold">
              ● {unresolvedCount} Open Discrepancies
            </span>
            <span className="text-[#D5D9DE] dark:text-[#2F343A]" aria-hidden="true">|</span>
            <span className="text-[#2E7D32] dark:text-[#4FA37A] font-semibold">
              ● {resolvedCount} Arbitrated
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conflict Cards Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {conflicts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] text-xs text-[#718096] dark:text-[#7D858E]">
              No active spatial conflicts found in queue.
            </div>
          ) : (
            conflicts.map((conflict, idx) => {
              const isSelected = selectedConflict?.id === conflict.id;
              const isResolved = conflict.status !== 'unresolved';

              return (
                <div
                  key={conflict.id}
                  onClick={() => setSelectedConflictId(conflict.id)}
                  className={`p-4 rounded-[4px] border transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'border-[#1F4E8C] dark:border-[#3F7CC4] bg-[#E9ECF0]/60 dark:bg-[#22262B]'
                      : idx % 2 === 0
                      ? 'border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21]'
                      : 'border-[#D5D9DE] dark:border-[#2F343A] bg-[#F8F9FA] dark:bg-[#1E2227]'
                  } hover:border-[#1F4E8C] dark:hover:border-[#3F7CC4]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">{conflict.id}</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] text-[#718096] dark:text-[#AEB4BB]">
                          {conflict.conflictType}
                        </span>
                        <span className="text-[#718096] dark:text-[#7D858E]">
                          Sy. {conflict.surveyNo}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] text-sm mt-1">
                        {(conflict as any).title || `${conflict.conflictType} on ${conflict.surveyNo}`}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded-[2px] border text-[11px] font-medium shrink-0 ${
                      isResolved
                        ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                        : 'border-[#B78103]/40 text-[#B78103] dark:text-[#C99A3C]'
                    }`}>
                      {conflict.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A5568] dark:text-[#AEB4BB] mt-2 leading-relaxed">
                    {(conflict as any).description || conflict.aiSuggestion?.reasoning}
                  </p>

                  {/* Discrepancy comparison: Source A vs Source B */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-[2px] bg-[#F4F5F7] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A]">
                      <div className="text-[#718096] dark:text-[#7D858E] font-semibold">{conflict.sourceA.name}:</div>
                      <div className="text-[#1B1F23] dark:text-[#E8EAED] mt-0.5 font-medium">{conflict.sourceA.value}</div>
                    </div>
                    <div className="p-2.5 rounded-[2px] bg-[#F4F5F7] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A]">
                      <div className="text-[#718096] dark:text-[#7D858E] font-semibold">{conflict.sourceB.name}:</div>
                      <div className="text-[#1B1F23] dark:text-[#E8EAED] mt-0.5 font-medium">{conflict.sourceB.value}</div>
                    </div>
                  </div>

                  {/* Evidence Metrics if available */}
                  {(conflict as any).evidence && (
                    <div className="mt-2.5 p-2 rounded-[2px] bg-[#F4F5F7] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] flex flex-wrap gap-4 text-[11px] font-mono">
                      {(conflict as any).evidence.revenueDeedArea !== undefined && (
                        <div>
                          <span className="text-[#718096] dark:text-[#7D858E]">RoR Deed: </span>
                          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{(conflict as any).evidence.revenueDeedArea} m²</span>
                        </div>
                      )}
                      {(conflict as any).evidence.droneArea !== undefined && (
                        <div>
                          <span className="text-[#718096] dark:text-[#7D858E]">Drone (ORI): </span>
                          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{(conflict as any).evidence.droneArea} m²</span>
                        </div>
                      )}
                      {(conflict as any).evidence.physicalSurveyOffsetCm !== undefined && (
                        <div>
                          <span className="text-[#718096] dark:text-[#7D858E]">Offset: </span>
                          <span className="font-semibold text-[#B78103] dark:text-[#C99A3C]">{(conflict as any).evidence.physicalSurveyOffsetCm} cm</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guideline Citation Box if verified */}
                  {verifiedGuidelines[conflict.id] && (
                    <div className="mt-3 p-3 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] space-y-1.5">
                      <span className="font-semibold text-[#1F4E8C] dark:text-[#7FB0E8] block text-[11px]">
                        Statutory Reference Guideline:
                      </span>
                      <div className="text-[11px] text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed">
                        {verifiedGuidelines[conflict.id].text}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Arbitration Inspector (5 cols) */}
        {selectedConflict ? (
          <div className="lg:col-span-5 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-3">
              <span className="text-[11px] text-[#718096] dark:text-[#7D858E]">Arbitration Case Record</span>
              <h2 className="text-base font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Case {selectedConflict.id} · Survey No. {selectedConflict.surveyNo}
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                Classification: {selectedConflict.conflictType} · Parcel: {selectedConflict.parcelId}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] space-y-1.5">
                <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] block">
                  Recommended Statutory Action:
                </span>
                <p className="text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed">
                  {(selectedConflict.aiSuggestion as any)?.action || `Adopt ${selectedConflict.aiSuggestion.chosenSource} as authoritative ground truth.`}
                </p>
                <div className="pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] text-[11px] text-[#718096] dark:text-[#7D858E]">
                  <strong>Technical Basis:</strong> {selectedConflict.aiSuggestion.reasoning}
                </div>
              </div>

              {/* Source comparison in detail */}
              <div className="space-y-2 border border-[#D5D9DE] dark:border-[#2F343A] p-3 rounded-[2px] bg-[#F4F5F7]/40 dark:bg-[#121417]">
                <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] block text-[11px]">
                  Contending Data Streams:
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2 border-b border-[#D5D9DE]/60 dark:border-[#2F343A] pb-2">
                    <div>
                      <div className="font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">{selectedConflict.sourceA.name}</div>
                      <div className="text-[#4A5568] dark:text-[#AEB4BB] mt-0.5">{selectedConflict.sourceA.value}</div>
                    </div>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21] text-[#718096] dark:text-[#AEB4BB]">
                      {selectedConflict.sourceA.confidence}%
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <div className="font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">{selectedConflict.sourceB.name}</div>
                      <div className="text-[#4A5568] dark:text-[#AEB4BB] mt-0.5">{selectedConflict.sourceB.value}</div>
                    </div>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21] text-[#718096] dark:text-[#AEB4BB]">
                      {selectedConflict.sourceB.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {Array.isArray((selectedConflict as any).affectedParties) && (selectedConflict as any).affectedParties.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-[#718096] dark:text-[#7D858E] block text-[11px]">
                    Adjoining Affected Parties:
                  </span>
                  <ul className="space-y-1 text-xs text-[#4A5568] dark:text-[#AEB4BB]">
                    {(selectedConflict as any).affectedParties.map((p: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#718096]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] space-y-2">
                <button
                  type="button"
                  onClick={(e) => handleVerify(e, selectedConflict)}
                  disabled={verifyingId === selectedConflict.id}
                  className="w-full h-10 px-4 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1F4E8C] dark:text-[#7FB0E8] hover:text-[#1B1F23] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {verifyingId === selectedConflict.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Scale className="w-3.5 h-3.5" />
                  )}
                  <span>Verify with Latest Guidelines</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resolveConflict(selectedConflict.id, 'accepted_ai');
                    showToast("Order Sanctioned", `Arbitration accepted for ${selectedConflict.id}.`, "success");
                  }}
                  className="w-full h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity cursor-pointer"
                >
                  Sanction Recommendation Order
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resolveConflict(selectedConflict.id, 'escalated');
                    showToast("Requisition Ordered", `Re-survey order issued to SoI Rover team for ${selectedConflict.id}.`, "info");
                  }}
                  className="w-full h-10 px-4 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] cursor-pointer"
                >
                  Re-dispatch for Physical Field Truthing
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-6 text-center text-xs text-[#718096] dark:text-[#7D858E]">
            Select a dispute from the queue to inspect arbitration evidence.
          </div>
        )}
      </div>
    </div>
  );
};
