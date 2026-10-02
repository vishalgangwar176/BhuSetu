import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Parcel, BuildingFootprint, UtilityLine, GNSSPoint, NearbyPlace } from '../../types';
import { NearbyContextDrawer } from './NearbyContextDrawer';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  MapPin, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Zap, 
  Droplet, 
  X, 
  FileCheck, 
  ExternalLink,
  SplitSquareVertical,
  Compass
} from 'lucide-react';
import L from 'leaflet';

interface LeafletMapViewProps {
  hideFloatingLayerControls?: boolean;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({ hideFloatingLayerControls = false }) => {
  const { 
    parcels, 
    selectedParcel, 
    setSelectedParcel,
    buildings,
    utilities,
    gnssPoints,
    nearbyPlaces,
    activeLayers,
    toggleLayer,
    layerOpacity,
    setLayerOpacity,
    basemap,
    setBasemap,
    showToast,
    isDarkMode,
    userRole
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(!hideFloatingLayerControls);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage

  // Tile layer URLs
  const getTileUrl = (bm: 'streets' | 'satellite' | 'carto', dark: boolean) => {
    if (bm === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (dark) {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    if (bm === 'carto') {
      return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const basemapAttributions = {
    streets: '&copy; OpenStreetMap contributors',
    carto: '&copy; CARTO &copy; OpenStreetMap',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.6412],
      zoom: 16,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileLayer = L.tileLayer(getTileUrl(basemap, isDarkMode), {
      attribution: basemapAttributions[basemap],
      maxZoom: 19
    }).addTo(map);

    (map as any)._currentTileLayer = tileLayer;

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Basemap when changed or dark mode changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if ((map as any)._currentTileLayer) {
      map.removeLayer((map as any)._currentTileLayer);
    }

    const newTileLayer = L.tileLayer(getTileUrl(basemap, isDarkMode), {
      attribution: basemapAttributions[basemap],
      maxZoom: 19
    }).addTo(map);

    (map as any)._currentTileLayer = newTileLayer;
    newTileLayer.bringToBack();
  }, [basemap, isDarkMode]);

  // Render Vectors (Parcels, Buildings, Utilities, GNSS)
  useEffect(() => {
    const map = leafletMapRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Render Parcels Layer
    if (activeLayers.cadastral) {
      parcels.forEach((parcel) => {
        const isSelected = selectedParcel?.id === parcel.id;
        
        let fillColor = '#4FA37A'; // Muted green for verified
        let borderColor = '#3D8663';

        if (parcel.status === 'conflict') {
          fillColor = '#C4584F'; // Muted red
          borderColor = '#A3433C';
        } else if (parcel.status === 'needs_review') {
          fillColor = '#C99A3C'; // Muted gold/amber
          borderColor = '#A57B28';
        }

        if (isSelected) {
          borderColor = isDarkMode ? '#C9A24B' : '#1F4E8C';
        }

        const polygon = L.polygon(parcel.coordinates, {
          color: borderColor,
          weight: isSelected ? 2.5 : 1.5,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.35 : 0.25,
          dashArray: parcel.status === 'conflict' ? '4, 4' : undefined
        });

        polygon.on('click', () => {
          setSelectedParcel(parcel);
          map.flyTo(parcel.center, Math.max(map.getZoom(), 16), { duration: 0.5 });
        });

        polygon.bindTooltip(
          `<div class="font-sans text-xs bg-white dark:bg-[#22262B] p-1.5 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs text-[#1B1F23] dark:text-[#E8EAED]">
            <p class="font-semibold text-xs leading-tight">Sy. ${parcel.surveyNo} (${parcel.plotNo})</p>
            <p class="text-[11px] text-[#718096] dark:text-[#AEB4BB] leading-tight">${parcel.ownerName}</p>
            <p class="text-[10px] font-mono mt-1 ${parcel.status === 'verified' ? 'text-[#4FA37A]' : parcel.status === 'conflict' ? 'text-[#C4584F]' : 'text-[#C99A3C]'}">
              Score: ${parcel.confidenceScore}% · ${parcel.measuredAreaSqM} m²
            </p>
          </div>`,
          { sticky: true, opacity: 0.98, className: 'gov-leaflet-tooltip' }
        );

        polygon.addTo(group);
      });
    }

    // 2. Render Drone Extraction / Building Footprints
    if (activeLayers.buildings) {
      buildings.forEach((bld) => {
        const bldPolygon = L.polygon(bld.coordinates, {
          color: '#1E293B',
          weight: 1.2,
          fillColor: '#334155',
          fillOpacity: layerOpacity.buildings
        });

        bldPolygon.bindTooltip(
          `<div class="text-xs">
            <span class="font-semibold block">${bld.id}</span>
            <span>${bld.storeys} Storeys (${bld.heightMeters}m)</span>
            <span class="block text-slate-500 font-mono text-[10px]">Built-up: ${bld.builtUpAreaSqM} m²</span>
          </div>`,
          { sticky: true }
        );

        bldPolygon.addTo(group);
      });
    }

    // 3. Render Utility Lines
    if (activeLayers.utilities) {
      utilities.forEach((util) => {
        const utilColors: Record<string, string> = {
          'Water Supply': '#0284C7',
          'Power Feeder (11kV)': '#9333EA',
          'Storm Water Drain': '#0D9488'
        };

        const color = utilColors[util.type] || '#64748B';

        const line = L.polyline(util.coordinates, {
          color: color,
          weight: 3,
          dashArray: util.type === 'Power Feeder (11kV)' ? '6, 6' : undefined,
          opacity: 0.9
        });

        line.bindPopup(
          `<div class="p-1 text-xs">
            <div class="font-bold text-slate-900">${util.type}</div>
            <div class="text-slate-600 mt-0.5">Rating: ${util.diameterOrRating}</div>
            <div class="text-[10px] text-emerald-600 font-medium">Status: ${util.status}</div>
          </div>`
        );

        line.addTo(group);
      });
    }

    // 4. Render GNSS & CORS Stations
    if (activeLayers.gnss) {
      gnssPoints.forEach((pt) => {
        const isCors = pt.id.includes('CORS');
        const customIcon = L.divIcon({
          className: 'custom-gnss-marker',
          html: `<div class="w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white ${
            isCors ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
          }">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" y1="12" x2="18" y2="12"></line>
              <line x1="6" y1="12" x2="2" y2="12"></line>
              <line x1="12" y1="6" x2="12" y2="2"></line>
              <line x1="12" y1="22" x2="12" y2="18"></line>
            </svg>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon });

        marker.bindPopup(
          `<div class="p-1 text-xs">
            <div class="font-bold text-slate-900">${pt.name}</div>
            <div class="text-slate-500 font-mono text-[11px]">${pt.id} · ${pt.crs}</div>
            <div class="mt-1.5 grid grid-cols-2 gap-1 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200">
              <div>Elevation: <b>${pt.elevation}m</b></div>
              <div>Status: <b class="text-emerald-700">${pt.status}</b></div>
              <div>RMSE X: <b>${(pt.rmseX * 100).toFixed(1)} cm</b></div>
              <div>RMSE Y: <b>${(pt.rmseY * 100).toFixed(1)} cm</b></div>
            </div>
          </div>`
        );

        marker.addTo(group);
      });
    }

    // 5. Render Grounded Nearby Places (Google Maps Grounding)
    if (activeLayers.nearbyPlaces && nearbyPlaces && nearbyPlaces.length > 0) {
      nearbyPlaces.forEach((place) => {
        const customPlaceIcon = L.divIcon({
          className: 'custom-place-marker',
          html: `<div class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-rose-600 text-white" title="${place.name}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const placeMarker = L.marker([place.lat, place.lng], { icon: customPlaceIcon });
        placeMarker.bindPopup(
          `<div class="p-1 text-xs">
            <div class="font-bold text-slate-900">${place.name}</div>
            <div class="text-[11px] text-teal-600 font-medium">${place.category}</div>
            <div class="text-slate-500 text-[10px] mt-0.5">${place.address}</div>
            <div class="text-[9px] text-slate-400 mt-1 italic">${place.sourceAttribution || 'Google Maps Grounding'}</div>
          </div>`
        );
        placeMarker.addTo(group);
      });
    }

  }, [parcels, selectedParcel, buildings, utilities, gnssPoints, nearbyPlaces, activeLayers, layerOpacity]);

  const fitWardBounds = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([12.9716, 77.6412], 16, { animate: true });
      showToast("View Reset", "Centered on Ward 142 cadastral envelope.", "info");
    }
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-[#F4F5F7] dark:bg-[#121417]">
      {/* Map Canvas */}
      <div className="relative flex-1 h-full">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Split / Swipe Mode Indicator */}
        {isSplitMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-[#1A1D21] px-4 py-1.5 rounded-[4px] shadow-sm border border-[#D5D9DE] dark:border-[#2F343A] text-xs font-semibold flex items-center gap-3">
            <span className="text-[#C99A3C]">Left: Legacy Cadastral (2024)</span>
            <span className="text-[#D5D9DE] dark:text-[#2F343A]">|</span>
            <span className="text-[#4FA37A]">Right: Harmonized ORI (2026)</span>
          </div>
        )}

        {/* Floating Quick Map Tools */}
        <div className={`absolute top-4 ${hideFloatingLayerControls ? 'right-4' : 'left-4'} z-20 flex flex-col gap-2`}>
          {/* Layer Panel Toggle */}
          {!hideFloatingLayerControls && (
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`p-2.5 rounded-[4px] shadow-xs border transition-colors cursor-pointer ${
                showLayerPanel
                  ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white border-transparent'
                  : 'bg-white dark:bg-[#1A1D21] text-[#4A5568] dark:text-[#AEB4BB] border-[#D5D9DE] dark:border-[#2F343A] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B]'
              }`}
              title="Toggle Geospatial Layers & Opacity"
              aria-label="Toggle Layers"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          {/* Reset Zoom */}
          <button
            onClick={fitWardBounds}
            className="p-2.5 rounded-[4px] shadow-xs border bg-white dark:bg-[#1A1D21] text-[#4A5568] dark:text-[#AEB4BB] border-[#D5D9DE] dark:border-[#2F343A] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
            title="Recenter on Ward 142"
            aria-label="Recenter Map"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Split Mode Toggle */}
          <button
            onClick={() => {
              setIsSplitMode(!isSplitMode);
              showToast(
                !isSplitMode ? "Split View Active" : "Standard View",
                !isSplitMode ? "Comparing Legacy Cadastre vs 2026 ORI" : "Returned to integrated view",
                "info"
              );
            }}
            className={`p-2.5 rounded-[4px] shadow-xs border transition-colors cursor-pointer ${
              isSplitMode
                ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white border-transparent'
                : 'bg-white dark:bg-[#1A1D21] text-[#4A5568] dark:text-[#AEB4BB] border-[#D5D9DE] dark:border-[#2F343A] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B]'
            }`}
            title="Before/After Split Comparison View"
            aria-label="Split Comparison View"
          >
            <SplitSquareVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Map Legend */}
        <div className="absolute bottom-6 left-4 z-20 bg-white dark:bg-[#1A1D21] p-3 rounded-[4px] shadow-md border border-[#D5D9DE] dark:border-[#2F343A] text-xs">
          <div className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-2 flex items-center justify-between gap-4">
            <span>Cadastral Status</span>
            <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-mono">40 Parcels</span>
          </div>
          <div className="space-y-1.5 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-[#4FA37A] shrink-0" />
              <span className="text-[#4A5568] dark:text-[#AEB4BB]">Verified (Score ≥ 90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-[#C99A3C] shrink-0" />
              <span className="text-[#4A5568] dark:text-[#AEB4BB]">Needs Review (75%–89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-[#C4584F] shrink-0" />
              <span className="text-[#4A5568] dark:text-[#AEB4BB]">Spatial Conflict (&lt; 75%)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[#D5D9DE] dark:border-[#2F343A]">
              <span className="w-3 h-3 rounded-[2px] bg-[#4A5568] shrink-0" />
              <span className="text-[#718096] dark:text-[#7D858E]">Building Footprints (ORI)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#5C8FCB] shrink-0" />
              <span className="text-[#718096] dark:text-[#7D858E]">Utility Trunk Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Layer Controller Flyout Panel */}
        {!hideFloatingLayerControls && showLayerPanel && (
          <div className="absolute top-4 left-16 z-20 w-72 bg-white dark:bg-[#1A1D21] p-4 rounded-[4px] shadow-xl border border-[#D5D9DE] dark:border-[#2F343A] animate-in fade-in duration-100">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B1F23] dark:text-[#E8EAED]">
                <Sliders className="w-4 h-4 text-[#1F4E8C] dark:text-[#7FB0E8]" />
                <span>Geospatial Layers</span>
              </div>
              <button
                onClick={() => setShowLayerPanel(false)}
                className="text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] p-1 cursor-pointer"
                aria-label="Close layer panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Basemap Switcher */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#718096] dark:text-[#7D858E] block mb-1.5">
                Basemap
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#F4F5F7] dark:bg-[#22262B] p-1 rounded-[4px] text-[11px] font-medium border border-[#D5D9DE] dark:border-[#2F343A]">
                {(['streets', 'carto', 'satellite'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={`py-1 rounded-[2px] capitalize transition-colors cursor-pointer ${
                      basemap === b
                        ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white font-semibold'
                        : 'text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Toggles & Opacity */}
            <div className="space-y-3 text-xs">
              <label className="text-[11px] font-semibold text-[#718096] dark:text-[#7D858E] block">
                Active Layers
              </label>

              {/* Cadastral Parcels */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => toggleLayer('cadastral')}
                    className="flex items-center gap-2 font-medium text-[#1B1F23] dark:text-[#E8EAED] hover:text-[#1F4E8C] cursor-pointer"
                  >
                    {activeLayers.cadastral ? <Eye className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#7FB0E8]" /> : <EyeOff className="w-3.5 h-3.5 text-[#718096]" />}
                    <span>Cadastral Parcels</span>
                  </button>
                  <span className="text-[10px] font-mono text-[#718096] dark:text-[#7D858E]">{Math.round(layerOpacity.cadastral * 100)}%</span>
                </div>
                {activeLayers.cadastral && (
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={layerOpacity.cadastral}
                    onChange={(e) => setLayerOpacity('cadastral', parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] appearance-none cursor-pointer accent-[#1F4E8C] dark:accent-[#3F7CC4]"
                  />
                )}
              </div>

              {/* Drone Building Footprints */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => toggleLayer('buildings')}
                    className="flex items-center gap-2 font-medium text-[#1B1F23] dark:text-[#E8EAED] hover:text-[#1F4E8C] cursor-pointer"
                  >
                    {activeLayers.buildings ? <Eye className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#7FB0E8]" /> : <EyeOff className="w-3.5 h-3.5 text-[#718096]" />}
                    <span>Building Footprints (ORI)</span>
                  </button>
                  <span className="text-[10px] font-mono text-[#718096] dark:text-[#7D858E]">{Math.round(layerOpacity.buildings * 100)}%</span>
                </div>
                {activeLayers.buildings && (
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={layerOpacity.buildings}
                    onChange={(e) => setLayerOpacity('buildings', parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] appearance-none cursor-pointer accent-[#1F4E8C] dark:accent-[#3F7CC4]"
                  />
                )}
              </div>

              {/* Utility Networks */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleLayer('utilities')}
                  className="flex items-center gap-2 font-medium text-[#1B1F23] dark:text-[#E8EAED] hover:text-[#1F4E8C] cursor-pointer"
                >
                  {activeLayers.utilities ? <Eye className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#7FB0E8]" /> : <EyeOff className="w-3.5 h-3.5 text-[#718096]" />}
                  <span>Utility Infrastructure (3)</span>
                </button>
              </div>

              {/* GNSS / CORS Stations */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleLayer('gnss')}
                  className="flex items-center gap-2 font-medium text-[#1B1F23] dark:text-[#E8EAED] hover:text-[#1F4E8C] cursor-pointer"
                >
                  {activeLayers.gnss ? <Eye className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#7FB0E8]" /> : <EyeOff className="w-3.5 h-3.5 text-[#718096]" />}
                  <span>GNSS / CORS Stations (3)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parcel Inspector Side Drawer */}
      {selectedParcel && (
        <aside className="w-96 h-full bg-white dark:bg-[#1A1D21] border-l border-[#D5D9DE] dark:border-[#2F343A] flex flex-col z-20 shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-[#D5D9DE] dark:border-[#2F343A] flex items-start justify-between bg-[#F4F5F7] dark:bg-[#22262B]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1F4E8C] dark:text-[#7FB0E8]">{selectedParcel.id}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] border ${
                  selectedParcel.status === 'verified'
                    ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                    : selectedParcel.status === 'conflict'
                    ? 'border-[#C4584F]/40 text-[#C4584F]'
                    : 'border-[#C99A3C]/40 text-[#C99A3C]'
                }`}>
                  {selectedParcel.status === 'verified' ? 'Verified' : selectedParcel.status === 'conflict' ? 'Conflict' : 'Review Needed'}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#1B1F23] dark:text-[#E8EAED] mt-1">
                Survey {selectedParcel.surveyNo} ({selectedParcel.plotNo})
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                Khasra: {selectedParcel.khasraNo} · {selectedParcel.landUse}
              </p>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              className="text-[#718096] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] p-1 cursor-pointer"
              aria-label="Close parcel drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1 text-xs">
            {/* Confidence Score Summary */}
            <div className="p-3 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Confidence Score</span>
                <span className="font-mono text-base font-bold text-[#1B1F23] dark:text-[#E8EAED]">
                  {selectedParcel.confidenceScore}%
                </span>
              </div>

              {/* 5-Factor Score Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#718096] dark:text-[#7D858E]">Positional:</span>
                  <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.scoreBreakdown.positional}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096] dark:text-[#7D858E]">Attribute:</span>
                  <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.scoreBreakdown.attribute}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096] dark:text-[#7D858E]">Topology:</span>
                  <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.scoreBreakdown.topology}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096] dark:text-[#7D858E]">Agreement:</span>
                  <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.scoreBreakdown.sourceAgreement}%</span>
                </div>
              </div>
            </div>

            {/* Ownership & Revenue Attributes */}
            <div>
              <h3 className="font-bold text-[#1B1F23] dark:text-[#E8EAED] mb-2 text-xs">
                Revenue & Ownership
              </h3>
              <div className="space-y-2 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] p-3 bg-white dark:bg-[#1A1D21]">
                <div>
                  <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Registered Khata Holder</span>
                  <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.ownerName}</span>
                  <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">{selectedParcel.fatherHusbandName}</span>
                </div>
                <div className="pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] flex justify-between">
                  <div>
                    <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Tax Assessment PID</span>
                    <span className="font-mono font-medium text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.taxAssessmentId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Encumbrance</span>
                    <span className={`font-semibold ${selectedParcel.encumbranceStatus === 'Clear' ? 'text-[#4FA37A]' : 'text-[#C4584F]'}`}>
                      {selectedParcel.encumbranceStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Comparison */}
            <div>
              <h3 className="font-bold text-[#1B1F23] dark:text-[#E8EAED] mb-2 text-xs">
                Area Harmonization
              </h3>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21]">
                <div>
                  <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Record RoR Area</span>
                  <span className="font-mono text-sm font-bold text-[#1B1F23] dark:text-[#E8EAED]">{selectedParcel.recordAreaSqM} m²</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#718096] dark:text-[#7D858E] block">Measured ORI Area</span>
                  <span className="font-mono text-sm font-bold text-[#1F4E8C] dark:text-[#7FB0E8]">{selectedParcel.measuredAreaSqM} m²</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-between text-[11px]">
                  <span className="text-[#718096] dark:text-[#7D858E]">Area Delta:</span>
                  <span className={`font-mono font-semibold ${selectedParcel.areaDeltaPercent > 5 ? 'text-[#C4584F]' : 'text-[#4FA37A]'}`}>
                    {selectedParcel.areaDeltaPercent}% ({Math.abs(selectedParcel.measuredAreaSqM - selectedParcel.recordAreaSqM).toFixed(1)} m²)
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Flags */}
            <div>
              <h3 className="font-bold text-[#1B1F23] dark:text-[#E8EAED] mb-2 text-xs">
                Harmonization Flags
              </h3>
              <div className="space-y-1.5">
                {selectedParcel.flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4FA37A] mt-0.5 shrink-0" />
                    <span className="text-[#4A5568] dark:text-[#AEB4BB] leading-tight text-[11px]">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Lineage */}
            <div>
              <h3 className="font-bold text-[#1B1F23] dark:text-[#E8EAED] mb-2 text-xs">
                Source Lineage Trail
              </h3>
              <div className="space-y-1 text-[11px] text-[#4A5568] dark:text-[#AEB4BB] pl-2 border-l-2 border-[#1F4E8C] dark:border-[#3F7CC4]">
                {selectedParcel.lineage.map((src, idx) => (
                  <p key={idx} className="leading-relaxed">{src}</p>
                ))}
              </div>
            </div>

            {/* Location Intelligence & Nearby Places */}
            <NearbyContextDrawer parcel={selectedParcel} />
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] flex gap-2">
            <button
              onClick={() => showToast("Export Initiated", `GeoJSON for parcel ${selectedParcel.id} downloaded.`, "success")}
              className="flex-1 h-10 px-3 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity cursor-pointer"
            >
              Export Parcel GeoJSON
            </button>
            <button
              onClick={() => showToast("Survey Task Created", `Field verification task queued for ${selectedParcel.surveyNo}.`, "info")}
              className="h-10 px-3 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] text-[#4A5568] dark:text-[#AEB4BB] hover:bg-white dark:hover:bg-[#1A1D21] transition-colors cursor-pointer"
            >
              Survey Ticket
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
