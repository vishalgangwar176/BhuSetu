import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Terminal, 
  Layers, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { NavViewKey } from '../components/layout/Sidebar';

interface PipelineProps {
  onNavigate: (view: NavViewKey) => void;
}

export const PipelinePage: React.FC<PipelineProps> = ({ onNavigate }) => {
  const { 
    pipelineSteps, 
    isPipelineRunning, 
    activePipelineStepIndex, 
    runPipeline, 
    pausePipeline, 
    resetPipeline 
  } = useApp();

  const [selectedStepId, setSelectedStepId] = useState<number>(activePipelineStepIndex + 1);

  const activeStep = pipelineSteps.find(s => s.id === selectedStepId) || pipelineSteps[0];
  const allCompleted = pipelineSteps.every(s => s.status === 'completed');

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">System Administration</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Harmonization Pipeline</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Automated Integration & Harmonization Pipeline
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              8-Stage processing pipeline executing geodetic re-projection, feature matching, topology healing, and confidence scoring.
            </p>
          </div>

          {/* Pipeline Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetPipeline}
              disabled={isPipelineRunning}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {isPipelineRunning ? (
              <button
                onClick={pausePipeline}
                className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#C99A3C] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Run</span>
              </button>
            ) : (
              <button
                onClick={runPipeline}
                className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{allCompleted ? 'Re-run Pipeline' : 'Execute Pipeline'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Progress Ribbon */}
      <div className="bg-white dark:bg-[#1A1D21] p-4 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs overflow-x-auto">
        <div className="flex items-center min-w-[760px] justify-between relative">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';
            const isSelected = selectedStepId === step.id;

            return (
              <div 
                key={step.id} 
                onClick={() => setSelectedStepId(step.id)}
                className="flex items-center flex-1 last:flex-none cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-[2px] flex items-center justify-center text-xs font-bold transition-colors border ${
                      isCompleted
                        ? 'bg-[#2E7D32] dark:bg-[#4FA37A] text-white border-transparent'
                        : isRunning
                        ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white border-transparent'
                        : 'bg-[#F4F5F7] dark:bg-[#22262B] text-[#718096] dark:text-[#7D858E] border-[#D5D9DE] dark:border-[#2F343A]'
                    } ${isSelected ? 'ring-2 ring-[#C9A24B]' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 text-center whitespace-nowrap ${
                    isSelected ? 'font-bold text-[#1B1F23] dark:text-[#E8EAED]' : 'text-[#718096] dark:text-[#7D858E]'
                  }`}>
                    {step.shortName}
                  </span>
                </div>

                {idx < pipelineSteps.length - 1 && (
                  <div className={`h-[1px] flex-1 mx-2 ${
                    isCompleted ? 'bg-[#2E7D32] dark:bg-[#4FA37A]' : 'bg-[#D5D9DE] dark:border-[#2F343A]'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content: Step Details & Live Log Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Selected Step Details & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
            <div className="flex items-start justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <div>
                <span className="text-xs font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">
                  Stage {activeStep.id} of 8
                </span>
                <h2 className="text-base font-semibold text-[#1B1F23] dark:text-[#E8EAED] mt-0.5">
                  {activeStep.name}
                </h2>
                <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                  {activeStep.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-[2px] border ${
                  activeStep.status === 'completed'
                    ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                    : activeStep.status === 'running'
                    ? 'border-[#C99A3C]/40 text-[#C99A3C]'
                    : 'border-[#D5D9DE] dark:border-[#2F343A] text-[#718096] dark:text-[#7D858E]'
                }`}>
                  {activeStep.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[#718096] dark:text-[#7D858E]">Execution Progress</span>
                <span className="font-mono text-[#1B1F23] dark:text-[#E8EAED]">{activeStep.progress}%</span>
              </div>
              <div className="w-full bg-[#E9ECF0] dark:bg-[#22262B] h-2 rounded-[2px] overflow-hidden">
                <div
                  className="bg-[#1F4E8C] dark:bg-[#3F7CC4] h-full transition-all duration-300"
                  style={{ width: `${activeStep.progress}%` }}
                />
              </div>
            </div>

            {/* Step Metrics Grid */}
            <div className="mt-6 pt-4 border-t border-[#D5D9DE] dark:border-[#2F343A]">
              <h3 className="text-xs font-semibold text-[#718096] dark:text-[#7D858E] mb-3">
                Stage Execution Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(activeStep.metrics).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A]">
                    <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block truncate">{key}</span>
                    <span className="text-sm font-semibold font-mono text-[#1B1F23] dark:text-[#E8EAED] mt-0.5 block truncate">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Card */}
          {allCompleted && (
            <div className="p-5 rounded-[4px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[2px] bg-[#2E7D32] dark:bg-[#4FA37A] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                    Harmonization Pipeline Successfully Executed
                  </h3>
                  <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
                    40 parcels validated with 94.6% mean confidence. Standardized LADM dataset ready.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('map')}
                className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Open Cadastral Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Terminal Console Logs */}
        <div className="space-y-4">
          <div className="p-4 rounded-[4px] bg-[#1A1D21] text-[#E8EAED] border border-[#2F343A] shadow-xs flex flex-col h-full min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F343A]">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#AEB4BB]">
                <Terminal className="w-4 h-4 text-[#7FB0E8]" />
                <span>GEOSPATIAL-DAEMON LOGS</span>
              </div>
              <span className="w-2 h-2 rounded-[1px] bg-[#4FA37A]" />
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2 font-mono text-[11px] text-[#AEB4BB] pr-1">
              <p className="text-[#7D858E]">// BhuSetu Pipeline Execution Core</p>
              <p className="text-[#7D858E]">// CRS Target: EPSG:4326 · CORS Base: CORS-BLR-01</p>
              
              {activeStep.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#E8EAED] leading-relaxed">
                  <span className="text-[#7FB0E8] shrink-0">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}

              {isPipelineRunning && (
                <div className="flex items-center gap-2 text-[#C99A3C] pt-2">
                  <span>Executing spatial geometry transforms...</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#2F343A] flex items-center justify-between text-[10px] text-[#7D858E] font-mono">
              <span>Status: OK (Exit 0)</span>
              <span>Memory: 342 MB RSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
