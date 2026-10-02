import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMapView } from '../components/map/LeafletMapView';
import { OfficialPrintHeader } from '../components/common/OfficialPrintHeader';
import { 
  Search, 
  MapPin, 
  Filter, 
  Download, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Building,
  Zap,
  Radio,
  Check,
  Compass,
  Map as MapIcon,
  Maximize2,
  Sparkles,
  RefreshCw,
  Printer
} from 'lucide-react';

export const MapWorkspacePage: React.FC = () => {
  const { 
    parcels, 
    activeWard, 
    setSelectedParcel, 
    showToast,
    activeLayers,
    toggleLayer,
    layerOpacity,
    setLayerOpacity,
    basemap,
    setBasemap,
    isDarkMode
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'needs_review' | 'conflict'>('all');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState<boolean>(true);

  // Count active layers among the four key requested ones
  const keyLayers = [
    { key: 'cadastral' as const, active: activeLayers.cadastral },
    { key: 'buildings' as const, active: activeLayers.buildings },
    { key: 'utilities' as const, active: activeLayers.utilities },
    { key: 'gnss' as const, active: activeLayers.gnss }
  ];
  const activeCount = keyLayers.filter(l => l.active).length;

  const filteredParcels = parcels.filter(p => {
    const matchesSearch = 
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.plotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectFromSearch = (parcel: typeof parcels[0]) => {
    setSelectedParcel(parcel);
    showToast("Parcel Focused", `Centered on ${parcel.surveyNo} (${parcel.ownerName})`, "info");
  };

  const enableAllKeyLayers = () => {
    if (!activeLayers.cadastral) toggleLayer('cadastral');
    if (!activeLayers.buildings) toggleLayer('buildings');
    if (!activeLayers.utilities) toggleLayer('utilities');
    if (!activeLayers.gnss) toggleLayer('gnss');
    showToast("All Layers Active", "Cadastral, Buildings, Utilities, and GNSS points enabled.", "success");
  };

  const disableAllOverlays = () => {
    if (activeLayers.buildings) toggleLayer('buildings');
    if (activeLayers.utilities) toggleLayer('utilities');
    if (activeLayers.gnss) toggleLayer('gnss');
    showToast("Overlays Hidden", "Only base cadastral boundary polygons displayed.", "info");
  };

  const resetLayerDefaults = () => {
    setLayerOpacity('cadastral', 0.85);
    setLayerOpacity('buildings', 0.9);
    setLayerOpacity('droneOverlay', 0.7);
    if (!activeLayers.cadastral) toggleLayer('cadastral');
    if (!activeLayers.buildings) toggleLayer('buildings');
    if (!activeLayers.utilities) toggleLayer('utilities');
    if (!activeLayers.gnss) toggleLayer('gnss');
    showToast("Reset Completed", "Default layer visibility and opacity restored.", "info");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100 dark:bg-[#0B1220]">
      {/* Official Government Print Header - Hidden on screen, active on print */}
      <OfficialPrintHeader 
        reportTitle="Cadastral Map Spatial Sheet (Ward 142)"
        subTitle="High-Resolution Orthorectified Spatial Cadastre · Survey of India Datum"
      />

      {/* Workspace Top Toolbar */}
      <div className="h-14 px-4 sm:px-6 bg-white dark:bg-[#111A2E] border-b border-slate-200 dark:border-[#22304A] flex items-center justify-between gap-3 z-20 shrink-0 transition-colors">
        {/* Left: Layer Toggle Button & Quick Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          {/* Collapsible Layer Panel Trigger */}
          <button
            onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 shadow-sm shrink-0 ${
              isLayerPanelOpen
                ? 'bg-[#0B2545] dark:bg-[#4C8DFF] text-white border-transparent'
                : 'bg-slate-50 dark:bg-[#162238] text-slate-700 dark:text-[#E6EBF5] border-slate-200 dark:border-[#22304A] hover:bg-slate-100'
            }`}
            title={isLayerPanelOpen ? "Collapse Layer Control Panel" : "Expand Layer Control Panel"}
            aria-expanded={isLayerPanelOpen}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              isLayerPanelOpen 
                ? 'bg-white/20 text-white' 
                : 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
            }`}>
              {activeCount}/4
            </span>
            {isLayerPanelOpen ? (
              <ChevronLeft className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Survey No (e.g. Sy. 40/4), Plot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-[#22304A] bg-slate-50 dark:bg-[#162238] text-slate-800 dark:text-[#E6EBF5] focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#22304A] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto p-1 text-xs">
                {filteredParcels.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleSelectFromSearch(p);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-[#162238] rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-[#E6EBF5]">{p.surveyNo}</span>
                      <span className="text-slate-500 dark:text-[#9AA8C2] text-[11px] block">{p.ownerName}</span>
                    </div>
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{p.confidenceScore}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Segmented Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#162238] rounded-xl text-xs font-medium border border-slate-200 dark:border-[#22304A]">
            {(['all', 'verified', 'needs_review', 'conflict'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-white dark:bg-[#111A2E] text-slate-900 dark:text-[#E6EBF5] shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-[#9AA8C2]'
                }`}
              >
                {s === 'all' ? 'All (40)' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Coordinate projection, Print & Export */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono font-medium text-slate-500 dark:text-[#9AA8C2] pl-2 border-l border-slate-200 dark:border-[#22304A]">
            <span>EPSG:4326</span>
            <span>·</span>
            <span className="text-teal-600 dark:text-teal-400">GSD: 0.05m</span>
          </div>

          <button
            onClick={() => {
              showToast("Preparing Map Sheet", "Generating A4/Legal print layout...", "info");
              window.print();
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#22304A] text-slate-800 dark:text-[#E6EBF5] border border-slate-200 dark:border-[#22304A] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Print high-contrast monochrome A4/Legal cadastral sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Map</span>
          </button>

          <button
            onClick={() => showToast("Exporting GeoJSON", "Downloading Ward 142 integrated cadastral layer...", "success")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0B2545] hover:bg-[#133863] dark:bg-[#4C8DFF] dark:hover:bg-blue-600 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Main Map Workspace Area with Collapsible Layer Control Panel */}
      <div className="flex-1 w-full relative flex overflow-hidden">
        {/* Mobile backdrop when panel is open */}
        {isLayerPanelOpen && (
          <div 
            onClick={() => setIsLayerPanelOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/40 z-20 backdrop-blur-[2px] transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Collapsible Layer Control Panel Drawer */}
        <aside
          className={`h-full bg-white dark:bg-[#111A2E] border-r border-slate-200 dark:border-[#22304A] flex flex-col z-30 shadow-xl transition-all duration-300 ease-in-out shrink-0 absolute md:relative ${
            isLayerPanelOpen ? 'w-80 max-w-[85vw] translate-x-0' : 'w-0 -translate-x-full overflow-hidden border-r-0 pointer-events-none'
          }`}
          aria-label="Geospatial Layer Control Panel"
        >
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-100 dark:border-[#22304A] flex items-center justify-between bg-slate-50/70 dark:bg-[#162238]/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-[#E6EBF5] uppercase tracking-wider">
                  Layer Visibility Controls
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-[#9AA8C2]">
                  Independent multi-source toggles
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLayerPanelOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#E6EBF5] rounded-lg hover:bg-slate-100 dark:hover:bg-[#22304A] transition-colors"
              title="Collapse Panel"
              aria-label="Collapse Layer Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Batch Actions */}
          <div className="p-3 border-b border-slate-100 dark:border-[#22304A] bg-slate-50/30 dark:bg-[#111A2E] flex items-center justify-between gap-1 text-[11px]">
            <button
              onClick={enableAllKeyLayers}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#22304A] text-slate-700 dark:text-[#E6EBF5] font-semibold transition-colors text-center"
            >
              Enable All
            </button>
            <button
              onClick={disableAllOverlays}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#22304A] text-slate-700 dark:text-[#E6EBF5] font-semibold transition-colors text-center"
            >
              Hide Overlays
            </button>
            <button
              onClick={resetLayerDefaults}
              className="p-1 px-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#E6EBF5] hover:bg-slate-100 dark:hover:bg-[#22304A] transition-colors"
              title="Reset Layer Settings"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Scrollable Layer Stack Controls */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* 1. Cadastral Parcels Control */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              activeLayers.cadastral 
                ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-[#162238]/60 shadow-sm' 
                : 'border-slate-200 dark:border-[#22304A] bg-slate-50/50 dark:bg-[#111A2E]/50 opacity-70'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLayer('cadastral')}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      activeLayers.cadastral
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-[#22304A] text-slate-400'
                    }`}
                    title={activeLayers.cadastral ? "Hide Cadastral Parcels" : "Show Cadastral Parcels"}
                  >
                    {activeLayers.cadastral ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#E6EBF5] text-xs">
                      Cadastral Parcels
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-[#9AA8C2]">
                      Digitized Tippani Boundaries (40)
                    </span>
                  </div>
                </div>

                {/* Independent Toggle Switch */}
                <button
                  onClick={() => toggleLayer('cadastral')}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    activeLayers.cadastral ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-checked={activeLayers.cadastral}
                  role="switch"
                  title="Toggle Cadastral Parcels"
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    activeLayers.cadastral ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Status Breakdown Legend & Opacity */}
              {activeLayers.cadastral && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#22304A]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-[#9AA8C2]">Layer Opacity</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round(layerOpacity.cadastral * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={layerOpacity.cadastral}
                    onChange={(e) => setLayerOpacity('cadastral', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-center font-semibold">
                    <span className="p-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      33 Verified
                    </span>
                    <span className="p-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      4 Review
                    </span>
                    <span className="p-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                      3 Conflict
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Building Footprints Control */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              activeLayers.buildings 
                ? 'border-indigo-300 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-[#162238]/60 shadow-sm' 
                : 'border-slate-200 dark:border-[#22304A] bg-slate-50/50 dark:bg-[#111A2E]/50 opacity-70'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLayer('buildings')}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      activeLayers.buildings
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-[#22304A] text-slate-400'
                    }`}
                    title={activeLayers.buildings ? "Hide Building Footprints" : "Show Building Footprints"}
                  >
                    {activeLayers.buildings ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#E6EBF5] text-xs flex items-center gap-1.5">
                      <span>Building Footprints</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-mono">
                        AI GeoAI
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-[#9AA8C2]">
                      Mask R-CNN Extracted Rooftops (32)
                    </span>
                  </div>
                </div>

                {/* Independent Toggle Switch */}
                <button
                  onClick={() => toggleLayer('buildings')}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    activeLayers.buildings ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-checked={activeLayers.buildings}
                  role="switch"
                  title="Toggle Building Footprints"
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    activeLayers.buildings ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {activeLayers.buildings && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#22304A]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-[#9AA8C2]">Footprint Opacity</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(layerOpacity.buildings * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={layerOpacity.buildings}
                    onChange={(e) => setLayerOpacity('buildings', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-[#111A2E]/80 border border-slate-200/80 dark:border-[#22304A] text-[10px] text-slate-600 dark:text-[#9AA8C2] space-y-0.5">
                    <div className="flex justify-between">
                      <span>Source Sensor:</span>
                      <span className="font-semibold text-slate-800 dark:text-[#E6EBF5]">5cm UAV ORI + LiDAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Segmentation Accuracy:</span>
                      <span className="font-semibold text-emerald-600">91.4% mIoU</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Utility Networks Control */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              activeLayers.utilities 
                ? 'border-sky-300 dark:border-sky-900/60 bg-sky-50/20 dark:bg-[#162238]/60 shadow-sm' 
                : 'border-slate-200 dark:border-[#22304A] bg-slate-50/50 dark:bg-[#111A2E]/50 opacity-70'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLayer('utilities')}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      activeLayers.utilities
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-[#22304A] text-slate-400'
                    }`}
                    title={activeLayers.utilities ? "Hide Utility Networks" : "Show Utility Networks"}
                  >
                    {activeLayers.utilities ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#E6EBF5] text-xs">
                      Utility Networks
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-[#9AA8C2]">
                      Trunk Engineering Vectors (3)
                    </span>
                  </div>
                </div>

                {/* Independent Toggle Switch */}
                <button
                  onClick={() => toggleLayer('utilities')}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    activeLayers.utilities ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-checked={activeLayers.utilities}
                  role="switch"
                  title="Toggle Utility Networks"
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    activeLayers.utilities ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {activeLayers.utilities && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#22304A] text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-[#111A2E]/80 border border-slate-200/80 dark:border-[#22304A]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-[#E6EBF5]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] shrink-0" />
                      <span>Water Supply Main</span>
                    </div>
                    <span className="text-slate-400 font-mono">300mm DI K9</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-[#111A2E]/80 border border-slate-200/80 dark:border-[#22304A]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-[#E6EBF5]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA] shrink-0" />
                      <span>Power Feeder (11kV)</span>
                    </div>
                    <span className="text-slate-400 font-mono">XLPE U/G</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-[#111A2E]/80 border border-slate-200/80 dark:border-[#22304A]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-[#E6EBF5]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] shrink-0" />
                      <span>Storm Water Drain</span>
                    </div>
                    <span className="text-slate-400 font-mono">1.5m Box</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. GNSS Ground Control Points Control */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              activeLayers.gnss 
                ? 'border-teal-300 dark:border-teal-900/60 bg-teal-50/20 dark:bg-[#162238]/60 shadow-sm' 
                : 'border-slate-200 dark:border-[#22304A] bg-slate-50/50 dark:bg-[#111A2E]/50 opacity-70'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLayer('gnss')}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      activeLayers.gnss
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-[#22304A] text-slate-400'
                    }`}
                    title={activeLayers.gnss ? "Hide GNSS Control Points" : "Show GNSS Control Points"}
                  >
                    {activeLayers.gnss ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#E6EBF5] text-xs">
                      GNSS Ground Control
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-[#9AA8C2]">
                      SoI CORS & RTK Points (3)
                    </span>
                  </div>
                </div>

                {/* Independent Toggle Switch */}
                <button
                  onClick={() => toggleLayer('gnss')}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    activeLayers.gnss ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-checked={activeLayers.gnss}
                  role="switch"
                  title="Toggle GNSS Control Points"
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    activeLayers.gnss ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {activeLayers.gnss && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#22304A] text-[10px]">
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-[#111A2E]/80 border border-slate-200/80 dark:border-[#22304A] space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-[#E6EBF5]">
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-indigo-600" />
                        <span>CORS-BLR-01 Base</span>
                      </span>
                      <span className="text-emerald-600 font-mono">RTK Fixed</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-[#9AA8C2] font-mono text-[9px]">
                      <span>RMSE: 1.4 cm</span>
                      <span>Elev: 914.4m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-[#9AA8C2] px-1 text-[10px]">
                    <span>GCP Targets: GCP-14, GCP-15</span>
                    <span className="text-teal-600 font-bold">UTM 43N</span>
                  </div>
                </div>
              )}
            </div>

            {/* Basemap Selection in Panel */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#22304A]">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Active Basemap
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-[#162238] p-1 rounded-xl text-[11px] font-medium border border-slate-200 dark:border-[#22304A]">
                {(['streets', 'carto', 'satellite'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={`py-1 rounded-lg capitalize transition-all ${
                      basemap === b
                        ? 'bg-white dark:bg-[#111A2E] text-slate-900 dark:text-[#E6EBF5] shadow-sm font-semibold'
                        : 'text-slate-500 dark:text-[#9AA8C2] hover:text-slate-900 dark:hover:text-[#E6EBF5]'
                    }`}
                  >
                    {b === 'carto' ? (isDarkMode ? 'Dark' : 'Carto') : b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Collapsed Panel Dock Handle (when collapsed) */}
        {!isLayerPanelOpen && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => setIsLayerPanelOpen(true)}
              className="p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-[#22304A] bg-white/95 dark:bg-[#111A2E]/95 text-slate-700 dark:text-[#E6EBF5] hover:bg-slate-50 dark:hover:bg-[#162238] flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all group"
              title="Open Layer Control Panel"
            >
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Layers</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold">
                {activeCount}/4
              </span>
            </button>
          </div>
        )}

        {/* Interactive Map View Canvas */}
        <div className="flex-1 h-full relative">
          <LeafletMapView hideFloatingLayerControls={true} />
        </div>
      </div>
    </div>
  );
};
