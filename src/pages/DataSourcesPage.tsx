import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DataSource } from '../types';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileBox, 
  Layers, 
  Compass, 
  FileText, 
  Building2, 
  Zap, 
  Crosshair, 
  Satellite, 
  RefreshCw,
  ChevronRight,
  Download
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { dataSources, loadDataSource, loadAllSampleSources, showToast } = useApp();
  const [selectedSource, setSelectedSource] = useState<DataSource>(dataSources[0]);

  const sourceIcons: Record<string, any> = {
    src_drone: Satellite,
    src_ori: Compass,
    src_dsm: Layers,
    src_cadastral: FileBox,
    src_revenue: FileText,
    src_municipal: Building2,
    src_utility: Zap,
    src_gt: Crosshair,
    src_cors: Satellite,
    src_footprints: Layers
  };

  const handleSimulatedUpload = (ds: DataSource) => {
    loadDataSource(ds.id);
  };

  const loadedCount = dataSources.filter(d => d.loaded).length;

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Data Ingestion</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">10 Ingestion Streams</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Multi-Source Geospatial Ingestion Center
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Ingest and normalize 10 heterogeneous geospatial datasets conforming to MoRD NAKSHA guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllSampleSources}
              className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load All Sample Datasets</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 4-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Configured Streams</span>
              <Layers className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              10
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              NAKSHA data specifications
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Active Ingested</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {loadedCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Loaded into runtime database
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Pending Feeds</span>
              <AlertCircle className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {10 - loadedCount}
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Awaiting sensor data
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Geodetic Alignment</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              EPSG:4326
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Unified WGS 84 datum
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Cards Grid + Selected Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Cards List (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataSources.map((ds) => {
            const Icon = sourceIcons[ds.id] || FileBox;
            const isSelected = selectedSource.id === ds.id;

            return (
              <div
                key={ds.id}
                onClick={() => setSelectedSource(ds)}
                className={`p-4 rounded-[4px] border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1F4E8C] dark:border-[#3F7CC4] bg-[#E9ECF0]/60 dark:bg-[#22262B]'
                    : 'border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21] hover:border-[#1F4E8C] dark:hover:border-[#3F7CC4]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                    <div className="w-8 h-8 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center text-[#718096] dark:text-[#AEB4BB] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] border ${
                      ds.loaded
                        ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                        : 'border-[#D5D9DE] dark:border-[#2F343A] text-[#718096] dark:text-[#7D858E]'
                    }`}>
                      {ds.loaded ? 'Active / Ingested' : 'Pending Upload'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] text-xs mt-3 leading-snug">
                    {ds.name}
                  </h3>
                  <p className="text-[11px] text-[#718096] dark:text-[#7D858E] mt-1 line-clamp-2">
                    {ds.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D5D9DE] dark:border-[#2F343A]">
                  <div className="flex items-center justify-between text-[11px] text-[#718096] dark:text-[#7D858E] font-mono mb-2.5">
                    <span>Format: {ds.supportedFormats.split(',')[0]}</span>
                    <span>Score: {ds.qualityScore}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!ds.loaded ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulatedUpload(ds);
                        }}
                        className="w-full h-9 rounded-[4px] text-xs font-semibold bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Load Dataset</span>
                      </button>
                    ) : (
                      <div className="w-full h-9 rounded-[4px] text-xs font-medium border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4FA37A] flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Loaded ({ds.fileSize})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Dataset Metadata Inspector */}
        <div className="space-y-4">
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <span className="text-xs font-semibold text-[#718096] dark:text-[#7D858E]">
                Dataset Specification
              </span>
              <span className="text-[11px] font-mono text-[#1F4E8C] dark:text-[#7FB0E8]">
                ID: {selectedSource.id}
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                {selectedSource.name}
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                {selectedSource.description}
              </p>
            </div>

            {/* Spec Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Category:</span>
                <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Source Type:</span>
                <span className="text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.sourceType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Coordinate Reference:</span>
                <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.crs}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Resolution / Scale:</span>
                <span className="font-mono text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">Record Volume:</span>
                <span className="font-mono font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.recordCount} features</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-[#718096] dark:text-[#7D858E]">File Size:</span>
                <span className="font-mono text-[#1B1F23] dark:text-[#E8EAED]">{selectedSource.fileSize}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#718096] dark:text-[#7D858E]">Quality Standard:</span>
                <span className="font-mono font-semibold text-[#4FA37A]">{selectedSource.qualityScore}% ISO compliant</span>
              </div>
            </div>

            {/* Dropzone Simulation Box */}
            <div className="p-4 rounded-[4px] border border-dashed border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-center space-y-2">
              <UploadCloud className="w-5 h-5 text-[#718096] dark:text-[#7D858E] mx-auto" />
              <p className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Upload Custom Dataset
              </p>
              <p className="text-[11px] text-[#718096] dark:text-[#7D858E]">
                Supported: {selectedSource.supportedFormats}
              </p>
              <button
                onClick={() => showToast("File Uploaded", `Custom ${selectedSource.supportedFormats.split(',')[0]} file simulated.`, "info")}
                className="h-9 px-3 text-xs font-semibold border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] rounded-[4px] hover:border-[#1F4E8C] transition-colors cursor-pointer"
              >
                Select Local File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
