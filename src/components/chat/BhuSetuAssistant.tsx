import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  X, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  FileText
} from 'lucide-react';

interface BhuSetuAssistantProps {
  currentPageName?: string;
}

export const BhuSetuAssistant: React.FC<BhuSetuAssistantProps> = ({ currentPageName = 'Workspace' }) => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    isChatSending, 
    sendChatMessage, 
    clearChat, 
    userRole, 
    selectedParcel,
    setDraftedRemark,
    showToast
  } = useApp();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatSending) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg, currentPageName);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("Copied to Clipboard", "Text copied to clipboard.", "info");
  };

  const handleInsertRemark = (remark: string) => {
    setDraftedRemark(remark);
    showToast("Remark Prepared", "Draft observation copied to form buffer.", "info");
  };

  // Official FAQ and prompt links
  const queryLinks: Record<string, string[]> = {
    'Revenue Officer': [
      "Permissible deed area variance criteria under NAKSHA",
      "Draft an official approval remark for parcel discrepancy",
      "Statutory procedure for mutation arbitration under Land Revenue Code"
    ],
    'Field Surveyor': [
      "Standard CORS RTK fix tolerance benchmarks (cm level)",
      "Boundary stone verification protocol for urban khasra",
      "Draft field truthing observation for compound wall mismatch"
    ],
    'System Admin': [
      "Summarize ingestion stream health across 10 sources",
      "Planar topology healing rule specifications",
      "Explain the multi-source confidence score formula"
    ],
    'Public Viewer': [
      "Procedure to verify citizen parcel boundary online",
      "Interpretation of ISO 19157 data confidence score",
      "Official grievance submission timeline and redressal"
    ]
  };

  const currentQueries = queryLinks[userRole] || queryLinks['Public Viewer'];

  return (
    <>
      {/* Official Help Trigger Button (bottom right, 4px radius, no glow/circle) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white px-3.5 py-2.5 rounded-[4px] shadow-md flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer border border-transparent focus:ring-2 focus:ring-[#C9A24B]"
          aria-label="Open Help Assistant"
          title="Open Help & Reference Assistant"
        >
          <HelpCircle className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold tracking-wide">
            Help Assistant
          </span>
        </button>
      )}

      {/* Official Help Panel (modal-like, 4px corners, solid backgrounds) */}
      {isChatOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white dark:bg-[#1A1D21] rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-labelledby="help-assistant-title"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#E9ECF0] dark:bg-[#22262B] border-b border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#1F4E8C] dark:text-[#7FB0E8]" />
              <div>
                <h3 id="help-assistant-title" className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                  Help Assistant · {userRole}
                </h3>
                <p className="text-[11px] text-[#718096] dark:text-[#7D858E]">
                  Module: {currentPageName} {selectedParcel ? `· Sy. ${selectedParcel.surveyNo}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] transition-colors cursor-pointer"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] transition-colors cursor-pointer"
                title="Close Help Assistant"
                aria-label="Close Help Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {selectedParcel && (
            <div className="px-3 py-1.5 bg-[#F4F5F7] dark:bg-[#121417] border-b border-[#D5D9DE] dark:border-[#2F343A] text-[11px] text-[#4A5568] dark:text-[#AEB4BB] flex items-center justify-between">
              <span>Active Subject: <strong>Survey No. {selectedParcel.surveyNo}</strong> ({selectedParcel.khasraNo})</span>
              <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.deedAreaSqM} m²</span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#F4F5F7] dark:bg-[#121417] text-xs">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-[#718096] dark:text-[#7D858E] mb-1 px-1">
                    {isAssistant ? 'Help Reference' : 'You'} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div 
                    className={`max-w-[90%] p-3 rounded-[4px] border ${
                      isAssistant
                        ? 'bg-white dark:bg-[#1A1D21] border-[#D5D9DE] dark:border-[#2F343A] text-[#1B1F23] dark:text-[#E8EAED]'
                        : 'bg-[#1F4E8C] dark:bg-[#3F7CC4] border-[#1F4E8C] dark:border-[#3F7CC4] text-white'
                    }`}
                  >
                    <div className="leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Actions on Assistant messages */}
                    {isAssistant && (
                      <div className="mt-2 pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-between text-[11px]">
                        <span className="text-[#718096] dark:text-[#7D858E]">
                          Reference: DoLR NAKSHA
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-[#4FA37A]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          {(userRole === 'Revenue Officer' || userRole === 'Field Surveyor') && (
                            <button
                              onClick={() => handleInsertRemark(msg.content)}
                              className="flex items-center gap-1 text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline cursor-pointer"
                              title="Copy text to observation notes"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Apply to Form</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isChatSending && (
              <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] text-xs text-[#718096] dark:text-[#AEB4BB]">
                <div className="w-3 h-3 border-2 border-[#1F4E8C] dark:border-[#3F7CC4] border-t-transparent rounded-full animate-spin" />
                <span>Consulting official land guidelines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Reference Queries (plain text links, not chips) */}
          <div className="px-3 py-2 bg-white dark:bg-[#1A1D21] border-t border-[#D5D9DE] dark:border-[#2F343A] text-[11px]">
            <span className="font-semibold text-[#718096] dark:text-[#7D858E] block mb-1">
              Suggested queries:
            </span>
            <div className="space-y-1">
              {currentQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => sendChatMessage(query, currentPageName)}
                  className="block text-left text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline truncate w-full cursor-pointer"
                >
                  • {query}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-[#1A1D21] border-t border-[#D5D9DE] dark:border-[#2F343A] flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter your departmental inquiry or regulation query..."
              className="flex-1 h-10 px-3 text-xs bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isChatSending}
              className="h-10 px-4 bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white text-xs font-semibold rounded-[4px] hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
