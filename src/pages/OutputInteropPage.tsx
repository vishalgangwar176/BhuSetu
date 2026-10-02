import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  Share2, 
  Database, 
  Code2, 
  FileCheck2, 
  Printer, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Copy,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';

export const OutputInteropPage: React.FC = () => {
  const { parcels, activeWard, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'exports' | 'apis' | 'ladm'>('exports');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const sampleGeoJson = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:EPSG::4326" }
    },
    features: parcels.slice(0, 2).map(p => ({
      type: "Feature",
      id: p.id,
      geometry: {
        type: "Polygon",
        coordinates: [p.coordinates.map(([lat, lng]) => [lng, lat])]
      },
      properties: {
        survey_no: p.surveyNo,
        khasra_no: p.khasraNo,
        owner: p.ownerName,
        land_use: p.landUse,
        record_area_sqm: p.recordAreaSqM,
        measured_area_sqm: p.measuredAreaSqM,
        confidence_score: p.confidenceScore,
        ladm_baunit_id: `IN-KA-BAU-${p.id.slice(-4)}`,
        status: p.status
      }
    }))
  };

  const sampleApiCall = `// REST API GET /api/v1/wards/142/harmonized-parcels?crs=EPSG:4326&min_confidence=90
curl -X GET "https://bhusetu.naksha.gov.in/api/v1/wards/142/parcels" \\
  -H "Authorization: Bearer NAKSHA_GEOAI_TOKEN_2026" \\
  -H "Accept: application/geo+json"`;

  const sampleLadmSchema = `{
  "$schema": "https://schemas.opengeospatial.org/ladm/iso19152/v2.0/spatialunit.json",
  "LA_SpatialUnit": {
    "suID": "KA-BLR-W142-P104",
    "area": { "value": 448.2, "type": "calculated" },
    "dimension": "2D",
    "referencePoint": [12.9684, 77.6415],
    "spatialSource": ["ORI_DRONE_2026", "CORS_RTK_FIXED"],
    "quality": {
      "positionalAccuracyMeters": 0.016,
      "iso19157Score": 0.946
    }
  },
  "LA_BAUnit": {
    "name": "Sy. 40/4",
    "type": "basicPropertyUnit",
    "rightHolders": ["Smt. Kamala Devi"]
  }
}`;

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to Clipboard", `${title} snippet copied.`, "info");
  };

  const handleDownloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Download Complete", `${filename} downloaded.`, "info");
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">Statutory Reports</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Gazette & Interoperability Sync</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Gazette Output & Departmental Interoperability Sync
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Publish harmonized cadastral parcels to State Bhoomi Revenue, NAKSHA Portal, and Municipal GIS via OGC standard APIs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Official Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NAKSHA Sync */}
        <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1F4E8C] dark:text-[#7FB0E8] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">National NAKSHA Portal</h3>
              <p className="text-[11px] text-[#4FA37A] font-medium">● Synchronized · 40 Parcels Active</p>
            </div>
          </div>
          <button
            onClick={() => showToast("NAKSHA Synced", "Live spatial handshake confirmed.", "info")}
            className="p-1.5 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] cursor-pointer"
            title="Force Handshake"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* State Bhoomi RoR */}
        <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1F4E8C] dark:text-[#7FB0E8] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">State Bhoomi Revenue Ledger</h3>
              <p className="text-[11px] text-[#4FA37A] font-medium">● Connected · Mutation Stream</p>
            </div>
          </div>
          <button
            onClick={() => showToast("Bhoomi Synced", "Mutation ledger aligned.", "info")}
            className="p-1.5 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] cursor-pointer"
            title="Force Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Municipal GIS */}
        <div className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1F4E8C] dark:text-[#7FB0E8] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Municipal GIS Linkage</h3>
              <p className="text-[11px] text-[#4FA37A] font-medium">● Connected · Property Tax PIDs</p>
            </div>
          </div>
          <button
            onClick={() => showToast("Municipal Synced", "Property tax overlays linked.", "info")}
            className="p-1.5 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] cursor-pointer"
            title="Force Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 border-b border-[#D5D9DE] dark:border-[#2F343A] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('exports')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'exports'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          Standard File Exports (GeoJSON, SHP, CSV)
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'apis'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          OGC API REST Endpoints
        </button>
        <button
          onClick={() => setActiveTab('ladm')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ladm'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          ISO 19152 LADM Schema Viewer
        </button>
      </div>

      {/* Tab 1: Standard File Exports */}
      {activeTab === 'exports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GeoJSON Card */}
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-xs font-mono font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">OGC RFC 7946</span>
                <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-mono">EPSG:4326</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED] mt-3">
                Harmonized GeoJSON Vector
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                Standardized GeoJSON FeatureCollection with polygon boundaries, survey numbers, confidence scores, and lineage tags.
              </p>
            </div>
            <button
              onClick={() => handleDownloadFile("bhusetu_ward142_harmonized.geojson", JSON.stringify(sampleGeoJson, null, 2), "application/json")}
              className="mt-6 w-full h-10 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download GeoJSON</span>
            </button>
          </div>

          {/* ESRI Shapefile Card */}
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-xs font-mono font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">ESRI SHP/PRJ/DBF</span>
                <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-mono">UTM 43N</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED] mt-3">
                ESRI Shapefile Archive
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                Archived multi-file (.shp, .shx, .dbf, .prj) bundle compatible with QGIS, ArcGIS Pro, and desktop AutoCAD civil tools.
              </p>
            </div>
            <button
              onClick={() => showToast("Shapefile Packaging", "Downloading bhusetu_ward142_shp.zip...", "info")}
              className="mt-6 w-full h-10 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] hover:bg-white dark:hover:bg-[#1A1D21] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Shapefile (.zip)</span>
            </button>
          </div>

          {/* Revenue CSV Ledger Card */}
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <span className="text-xs font-mono font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">Tabular CSV / RoR</span>
                <span className="text-[10px] text-[#718096] dark:text-[#7D858E] font-mono">UTF-8</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED] mt-3">
                Revenue Reconciliation CSV
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
                Comprehensive spreadsheet comparing Bhoomi Record Area vs Measured ORI Area, with delta percentages and tax assessment PIDs.
              </p>
            </div>
            <button
              onClick={() => {
                const csvHeader = "ParcelID,SurveyNo,Owner,RecordAreaSqM,MeasuredAreaSqM,DeltaPercent,Confidence,Status\n";
                const csvRows = parcels.map(p => `${p.id},${p.surveyNo},"${p.ownerName}",${p.recordAreaSqM},${p.measuredAreaSqM},${p.areaDeltaPercent},${p.confidenceScore},${p.status}`).join('\n');
                handleDownloadFile("bhusetu_revenue_audit.csv", csvHeader + csvRows, "text/csv");
              }}
              className="mt-6 w-full h-10 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] hover:bg-white dark:hover:bg-[#1A1D21] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Sheet</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: OGC API REST Endpoints */}
      {activeTab === 'apis' && (
        <div className="space-y-4">
          <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">
                <Code2 className="w-4 h-4" />
                <span>OGC API Features / REST Specification</span>
              </div>
              <button
                onClick={() => copyToClipboard(sampleApiCall, "cURL")}
                className="px-2.5 py-1 text-xs rounded-[2px] bg-[#F4F5F7] dark:bg-[#22262B] hover:bg-[#E9ECF0] text-[#1B1F23] dark:text-[#E8EAED] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy cURL</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-[#1B1F23] dark:text-[#E8EAED] overflow-x-auto p-3 bg-[#F4F5F7] dark:bg-[#22262B] rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A]">
              {sampleApiCall}
            </pre>

            <div className="pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A]">
              <span className="text-xs font-semibold text-[#718096] dark:text-[#7D858E] block mb-2">Live Response Preview (JSON)</span>
              <pre className="font-mono text-[11px] text-[#4A5568] dark:text-[#AEB4BB] overflow-x-auto p-3 bg-[#F4F5F7] dark:bg-[#22262B] rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] max-h-64">
                {JSON.stringify(sampleGeoJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ISO 19152 LADM Schema */}
      {activeTab === 'ladm' && (
        <div className="p-5 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
            <div>
              <h3 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Land Administration Domain Model (ISO 19152 Edition)
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
                Standardized schema representing Spatial Units (LA_SpatialUnit) and Basic Administrative Units (LA_BAUnit).
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(sampleLadmSchema, "LADM Schema")}
              className="px-3 py-1.5 text-xs font-semibold rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] hover:bg-white dark:hover:bg-[#1A1D21] flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Schema</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-[#1B1F23] dark:text-[#E8EAED] p-4 bg-[#F4F5F7] dark:bg-[#22262B] rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] overflow-x-auto">
            {sampleLadmSchema}
          </pre>
        </div>
      )}

      {/* Printable Report Modal (6px max radius) */}
      {showPrintModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowPrintModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white dark:bg-[#22262B] max-w-2xl w-full rounded-[4px] shadow-2xl border border-[#D5D9DE] dark:border-[#2F343A] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
              <div>
                <span className="text-[11px] font-semibold text-[#1F4E8C] dark:text-[#7FB0E8] uppercase tracking-wider">
                  Government of India · Department of Land Resources
                </span>
                <h3 className="text-base font-bold text-[#1B1F23] dark:text-[#E8EAED]">
                  NAKSHA Geospatial Harmonization Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#1B1F23] dark:text-[#E8EAED]">
              <div className="p-3 rounded-[2px] bg-[#F4F5F7] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] flex justify-between">
                <div>
                  <span className="text-[#718096] dark:text-[#7D858E] block text-[11px]">Jurisdiction</span>
                  <span className="font-semibold">{activeWard}</span>
                </div>
                <div>
                  <span className="text-[#718096] dark:text-[#7D858E] block text-[11px]">Certification Date</span>
                  <span className="font-mono">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[#718096] dark:text-[#7D858E] block text-[11px]">Target CRS</span>
                  <span className="font-mono">EPSG:4326 (WGS 84)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#22262B]">
                  <div className="text-lg font-semibold font-mono text-[#1B1F23] dark:text-[#E8EAED]">40</div>
                  <div className="text-[10px] text-[#718096] dark:text-[#7D858E]">Total Parcels</div>
                </div>
                <div className="p-2.5 rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#22262B]">
                  <div className="text-lg font-semibold font-mono text-[#1B1F23] dark:text-[#E8EAED]">94.6%</div>
                  <div className="text-[10px] text-[#718096] dark:text-[#7D858E]">Mean Confidence</div>
                </div>
                <div className="p-2.5 rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#22262B]">
                  <div className="text-lg font-semibold font-mono text-[#1B1F23] dark:text-[#E8EAED]">0.016 m</div>
                  <div className="text-[10px] text-[#718096] dark:text-[#7D858E]">Final CORS RMSE</div>
                </div>
              </div>

              <p className="text-[11px] text-[#718096] dark:text-[#7D858E] leading-relaxed">
                This document certifies that multi-source geospatial data including Drone ORI, LiDAR DSM, Tippani vectors, and Bhoomi RoR records have undergone automated Helmert coordinate re-projection, rooftop feature alignment, and planar topology validation conforming to NAKSHA Programme guidelines and Department of Land Resources standards.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D5D9DE] dark:border-[#2F343A] flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
