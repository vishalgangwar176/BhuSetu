import { 
  Parcel, 
  BuildingFootprint, 
  UtilityLine, 
  GNSSPoint, 
  DataSource, 
  PipelineStep, 
  TopologyIssue, 
  ChangeDetectionRecord, 
  ConflictItem,
  SurveyorTask,
  MutationRecord,
  AdminUser,
  SystemAuditLog
} from '../types';

// Anchor center: Bengaluru Urban, Ward 142 (Indiranagar / Halasuru zone)
export const MAP_CENTER: [number, number] = [12.9716, 77.6412];
export const MAP_ZOOM = 16;

// Generate 40 realistic parcels with realistic polygon rings
function generateMockParcels(): Parcel[] {
  const parcels: Parcel[] = [];
  const startLat = 12.9680;
  const startLng = 77.6370;
  const latStep = 0.0009;
  const lngStep = 0.0011;

  const owners = [
    { name: "Smt. Kamala Devi", relation: "W/o Late R. Sundaram", landUse: "Residential" },
    { name: "Sri Anand Vardhan Rao", relation: "S/o K. V. Rao", landUse: "Commercial" },
    { name: "BBMP Zonal Office (Asset)", relation: "Municipal Estate Dept", landUse: "Public Utility" },
    { name: "M/s GreenTree Tech Park Ltd", relation: "Rep. by Dir. R. Nair", landUse: "Commercial" },
    { name: "Sri Devendra Patel", relation: "S/o Mansukhbhai", landUse: "Mixed Use" },
    { name: "Smt. Fatima Begum", relation: "D/o M. Farooq", landUse: "Residential" },
    { name: "Indira Community Park (BDA)", relation: "Bangalore Dev. Authority", landUse: "Open Green" },
    { name: "Sri Rajeshwar Hegde", relation: "S/o G. Hegde", landUse: "Residential" },
    { name: "HAL Employees Housing Coop", relation: "Society Reg. #441", landUse: "Residential" },
    { name: "M/s Metro Rail Feeder Substation", relation: "BMRCL Infrastructure", landUse: "Public Utility" },
    { name: "Dr. Sandeep Kulkarni", relation: "S/o Prabhakar Kulkarni", landUse: "Institutional" },
    { name: "Sri Arvind Swamy", relation: "S/o R. Swamy", landUse: "Residential" },
    { name: "Smt. Meenakshi Sundaram", relation: "W/o T. Sundaram", landUse: "Residential" },
    { name: "Vidya Mandir Trust", relation: "Public Educational Trust", landUse: "Institutional" },
    { name: "Sri Manoj Kumar Jain", relation: "S/o B. C. Jain", landUse: "Commercial" },
  ];

  let idCounter = 101;
  const rows = 5;
  const cols = 8;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pId = `KA-BLR-W142-P${idCounter}`;
      const surveyNo = `Sy. ${40 + r}/${c + 1}`;
      const khasraNo = `Kh-${100 + (r * 10) + c}`;
      const plotNo = `Plot ${idCounter}`;
      const ownerInfo = owners[(r * cols + c) % owners.length];

      // Introduce natural irregularity in parcel boundaries
      const jitter1 = ((r * 13 + c * 7) % 5 - 2) * 0.00004;
      const jitter2 = ((r * 11 + c * 17) % 5 - 2) * 0.00004;
      const jitter3 = ((r * 19 + c * 3) % 5 - 2) * 0.00003;

      const pLat = startLat + (r * latStep) + jitter1;
      const pLng = startLng + (c * lngStep) + jitter2;
      const pWidth = lngStep * 0.88 + jitter3;
      const pHeight = latStep * 0.88 - jitter3;

      const ring: [number, number][] = [
        [pLat, pLng],
        [pLat, pLng + pWidth],
        [pLat + pHeight, pLng + pWidth],
        [pLat + pHeight, pLng],
        [pLat, pLng]
      ];

      // Calculate area approx in sq meters
      const baseArea = Math.round((pWidth * 111320) * (pHeight * 110574) * 0.82);
      // Variations for some parcels to trigger reviews / conflicts
      const isConflict = idCounter === 104 || idCounter === 119 || idCounter === 131;
      const isReview = idCounter === 108 || idCounter === 115 || idCounter === 122 || idCounter === 138;

      const delta = isConflict ? Math.round(baseArea * 0.08) : isReview ? Math.round(baseArea * 0.035) : Math.round(baseArea * 0.004);
      const measuredArea = baseArea + (idCounter % 2 === 0 ? delta : -delta);
      const areaDeltaPercent = parseFloat(((Math.abs(measuredArea - baseArea) / baseArea) * 100).toFixed(2));

      const confidenceScore = isConflict ? 68 + ((r + c) % 5) : isReview ? 82 + ((r + c) % 4) : 94 + ((r + c) % 6);
      const status = isConflict ? 'conflict' : isReview ? 'needs_review' : 'verified';

      parcels.push({
        id: pId,
        surveyNo,
        khasraNo,
        plotNo,
        ward: "Ward 142 - Indiranagar East",
        ownerName: ownerInfo.name,
        fatherHusbandName: ownerInfo.relation,
        landUse: ownerInfo.landUse as any,
        recordAreaSqM: baseArea,
        measuredAreaSqM: measuredArea,
        areaDeltaPercent,
        confidenceScore,
        status,
        mutationDate: `202${(idCounter % 5) + 1}-0${((idCounter % 8) + 1)}-15`,
        encumbranceStatus: isConflict ? 'Disputed' : isReview ? 'Pending Verification' : 'Clear',
        taxAssessmentId: `BBMP-REV-2026-${8800 + idCounter}`,
        coordinates: ring,
        center: [pLat + pHeight / 2, pLng + pWidth / 2],
        buildingCount: ownerInfo.landUse === 'Open Green' ? 0 : (idCounter % 3) + 1,
        lineage: [
          "Drone High-Res Orthomosaic (ORI) 2026",
          "Survey of India Cadastral Base (EPSG:32643)",
          "Bhoomi Karnataka Revenue Register Vol. 14"
        ],
        flags: isConflict 
          ? ["Area discrepancy > 5%", "Boundary shift against ORI drone layer"]
          : isReview 
          ? ["Slight topology sliver with adjacent parcel", "Fuzzy owner name match (91%)"]
          : ["Geo-referenced to CORS base", "Topology rules 100% verified"],
        scoreBreakdown: {
          positional: isConflict ? 72 : isReview ? 85 : 98,
          attribute: isConflict ? 68 : isReview ? 81 : 96,
          topology: isConflict ? 65 : isReview ? 83 : 99,
          sourceAgreement: isConflict ? 64 : isReview ? 79 : 94,
          temporal: isConflict ? 70 : isReview ? 84 : 95
        }
      });

      idCounter++;
    }
  }

  return parcels;
}

export const MOCK_PARCELS: Parcel[] = generateMockParcels();

// Building Footprints extracted from Drone ORI & LiDAR
export const MOCK_BUILDINGS: BuildingFootprint[] = MOCK_PARCELS
  .filter(p => p.buildingCount > 0)
  .slice(0, 32)
  .map((p, idx) => {
    const [cLat, cLng] = p.center;
    const w = 0.0003;
    const h = 0.00025;
    return {
      id: `BLD-W142-${200 + idx}`,
      parcelId: p.id,
      storeys: (idx % 4) + 1,
      heightMeters: ((idx % 4) + 1) * 3.2,
      builtUpAreaSqM: Math.round(p.measuredAreaSqM * 0.45),
      detectionSource: idx % 3 === 0 ? 'ORI Drone Extraction' : 'LiDAR DSM',
      confidence: 91 + (idx % 8),
      coordinates: [
        [cLat - h / 2, cLng - w / 2],
        [cLat - h / 2, cLng + w / 2],
        [cLat + h / 2, cLng + w / 2],
        [cLat + h / 2, cLng - w / 2],
        [cLat - h / 2, cLng - w / 2]
      ]
    };
  });

// Mock Utility Networks (Water, Underground Power, Storm Drain)
export const MOCK_UTILITIES: UtilityLine[] = [
  {
    id: "UTIL-WTR-01",
    type: "Water Supply",
    diameterOrRating: "300mm DI K9 Main",
    status: "Operational",
    coordinates: [
      [12.9682, 77.6368],
      [12.9682, 77.6465],
      [12.9725, 77.6465]
    ]
  },
  {
    id: "UTIL-PWR-01",
    type: "Power Feeder (11kV)",
    diameterOrRating: "11kV XLPE Underground Cable",
    status: "Operational",
    coordinates: [
      [12.9700, 77.6368],
      [12.9700, 77.6460],
      [12.9720, 77.6460]
    ]
  },
  {
    id: "UTIL-DRN-01",
    type: "Storm Water Drain",
    diameterOrRating: "1.5m Reinforced Concrete Box",
    status: "Operational",
    coordinates: [
      [12.9678, 77.6372],
      [12.9722, 77.6372],
      [12.9722, 77.6420]
    ]
  }
];

// GNSS / CORS Ground Control Stations
export const MOCK_GNSS_POINTS: GNSSPoint[] = [
  {
    id: "CORS-BLR-01",
    name: "Survey of India CORS Base Bangalore 01",
    crs: "EPSG:32643 (UTM 43N)",
    latitude: 12.9728,
    longitude: 77.6385,
    elevation: 914.42,
    rmseX: 0.012,
    rmseY: 0.014,
    rmseZ: 0.018,
    status: "Fixed"
  },
  {
    id: "GCP-NAKSHA-14",
    name: "Ground Control Target Point 14",
    crs: "EPSG:32643 (UTM 43N)",
    latitude: 12.9692,
    longitude: 77.6410,
    elevation: 911.20,
    rmseX: 0.018,
    rmseY: 0.021,
    rmseZ: 0.024,
    status: "Fixed"
  },
  {
    id: "GCP-NAKSHA-15",
    name: "Ground Control Target Point 15",
    crs: "EPSG:32643 (UTM 43N)",
    latitude: 12.9710,
    longitude: 77.6450,
    elevation: 916.85,
    rmseX: 0.015,
    rmseY: 0.017,
    rmseZ: 0.022,
    status: "Fixed"
  }
];

// 9 Supported Data Sources
export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    id: "src_drone",
    name: "High-Resolution Drone Imagery",
    category: "Aerial & Remote Sensing",
    supportedFormats: "GeoTIFF, COG, ECW",
    sourceType: "UAV Aerial Photogrammetry",
    crs: "EPSG:32643 (WGS 84 / UTM zone 43N)",
    resolution: "5 cm GSD (Ground Sampling Distance)",
    recordCount: 4,
    lastUpdated: "2026-09-15",
    qualityScore: 98,
    loaded: true,
    fileSize: "1.84 GB",
    description: "Sub-decimeter multispectral orthomosaic captured under NAKSHA flight run #42."
  },
  {
    id: "src_ori",
    name: "Orthorectified Imagery (ORI)",
    category: "Aerial & Remote Sensing",
    supportedFormats: "GeoTIFF, MrSID",
    sourceType: "Survey of India Ground-Orthorectified",
    crs: "EPSG:32643",
    resolution: "8 cm GSD",
    recordCount: 2,
    lastUpdated: "2026-08-20",
    qualityScore: 96,
    loaded: true,
    fileSize: "920 MB",
    description: "Geometrically corrected imagery eliminating sensor tilt and topographic relief displacement."
  },
  {
    id: "src_dsm",
    name: "DSM / DTM Elevation Datasets",
    category: "Topography & Elevation",
    supportedFormats: "GeoTIFF, LAS / LAZ",
    sourceType: "Airborne LiDAR Point Cloud",
    crs: "EPSG:32643 + EGM2008 Geoid",
    resolution: "0.25 m Grid",
    recordCount: 1,
    lastUpdated: "2026-08-18",
    qualityScore: 94,
    loaded: true,
    fileSize: "1.42 GB",
    description: "Digital Surface and Terrain Models for slope assessment and 3D building height extraction."
  },
  {
    id: "src_cadastral",
    name: "Existing Cadastral Maps (Tippani/Village Map)",
    category: "Revenue & Land Administration",
    supportedFormats: "DWG, DXF, ESRI Shapefile",
    sourceType: "Legacy Revenue Cadastre (Digitized)",
    crs: "Local Datum (Transformed to EPSG:4326)",
    resolution: "Scale 1:1,000 Cadastral",
    recordCount: 40,
    lastUpdated: "2024-03-10",
    qualityScore: 82,
    loaded: true,
    fileSize: "18.5 MB",
    description: "Digitized boundaries from historic Tippani sheets, village settlement surveys, and pakka books."
  },
  {
    id: "src_revenue",
    name: "Revenue Records (RoR / Khasra / Bhoomi)",
    category: "Revenue & Land Administration",
    supportedFormats: "PostgreSQL, CSV, XML / JSON",
    sourceType: "State Bhoomi / E-Dharti DB Sync",
    crs: "Tabular (Linked by Survey/Khasra No.)",
    resolution: "40 Record Parcels",
    recordCount: 40,
    lastUpdated: "2026-09-28",
    qualityScore: 91,
    loaded: true,
    fileSize: "2.4 MB",
    description: "Records of Rights (RoR), owner lineage, encumbrance certificates, and mutation histories."
  },
  {
    id: "src_municipal",
    name: "Municipal GIS Layers (Urban Planning / Master Plan)",
    category: "Urban Local Body (ULB)",
    supportedFormats: "GeoJSON, ESRI FileGeodatabase",
    sourceType: "BBMP Town Planning & Tax GIS",
    crs: "EPSG:4326 (WGS 84)",
    resolution: "Ward-level Planning Polygons",
    recordCount: 12,
    lastUpdated: "2026-07-12",
    qualityScore: 89,
    loaded: true,
    fileSize: "44 MB",
    description: "Zoning bylaws, setback lines, property tax PID polygons, and municipal wards."
  },
  {
    id: "src_utility",
    name: "Utility Network Infrastructure",
    category: "Infrastructure & Utilities",
    supportedFormats: "Shapefile, GeoJSON, DWG",
    sourceType: "BWSSB & BESCOM Engineering Assets",
    crs: "EPSG:32643",
    resolution: "Linear Vector Networks",
    recordCount: 3,
    lastUpdated: "2026-05-30",
    qualityScore: 88,
    loaded: true,
    fileSize: "12 MB",
    description: "Water distribution mains, underground 11kV power cables, and municipal storm drains."
  },
  {
    id: "src_gt",
    name: "Ground Truthing (GT) Datasets",
    category: "Field Verification",
    supportedFormats: "GeoPackage, KML, CSV",
    sourceType: "Mobile GIS Rover Surveyor App",
    crs: "EPSG:4326",
    resolution: "Centimeter Accuracy GNSS Points",
    recordCount: 68,
    lastUpdated: "2026-09-22",
    qualityScore: 97,
    loaded: true,
    fileSize: "8.6 MB",
    description: "In-situ field validation, owner signatures, boundary boundary stone coordinates, and geotagged photos."
  },
  {
    id: "src_cors",
    name: "GNSS / CORS Survey Data",
    category: "Geodetic Reference",
    supportedFormats: "RINEX 3.0, NMEA, CSV",
    sourceType: "Survey of India National CORS Network",
    crs: "ITRF2020 / WGS 84",
    resolution: "Sub-centimeter Real-time Kinematic",
    recordCount: 3,
    lastUpdated: "2026-10-01",
    qualityScore: 99,
    loaded: true,
    fileSize: "145 MB",
    description: "Continuous Operating Reference Station data for precise differential baseline correction."
  },
  {
    id: "src_footprints",
    name: "AI Building Footprint Layer",
    category: "GeoAI Feature Extraction",
    supportedFormats: "GeoJSON, FlatGeobuf",
    sourceType: "Deep Learning Segment Anything / Mask R-CNN",
    crs: "EPSG:4326",
    resolution: "Instance Segmentation Polygons",
    recordCount: 32,
    lastUpdated: "2026-10-01",
    qualityScore: 93,
    loaded: true,
    fileSize: "6.2 MB",
    description: "High-fidelity rooftop polygons extracted automatically from 5cm drone orthomosaics."
  }
];

// Topology Issues detected in Ward 142
export const INITIAL_TOPOLOGY_ISSUES: TopologyIssue[] = [
  {
    id: "TOPO-001",
    type: "Overlap",
    parcelA: "KA-BLR-W142-P104",
    parcelB: "KA-BLR-W142-P105",
    severity: "high",
    areaAffectedSqM: 14.8,
    description: "Boundary overlap of 14.8 m² between Survey 40/4 and 40/5 along eastern boundary edge.",
    status: "detected",
    location: [12.9684, 77.6415],
    suggestedAction: "Snap boundary edge to ORI drone rooftop setback line with equalized median split."
  },
  {
    id: "TOPO-002",
    type: "Gap",
    parcelA: "KA-BLR-W142-P112",
    parcelB: "KA-BLR-W142-P113",
    severity: "medium",
    areaAffectedSqM: 8.2,
    description: "Unassigned spatial gap (sliver vacuum) between Sy. 41/4 and Sy. 41/5.",
    status: "detected",
    location: [12.9698, 77.6414],
    suggestedAction: "Bridge gap by expanding parcel Sy. 41/4 to conform to surveyed boundary wall."
  },
  {
    id: "TOPO-003",
    type: "Sliver Polygon",
    parcelA: "KA-BLR-W142-P119",
    parcelB: "KA-BLR-W142-P120",
    severity: "high",
    areaAffectedSqM: 4.1,
    description: "Elongated sliver with thin perimeter-to-area ratio created during legacy CAD vectorization.",
    status: "detected",
    location: [12.9708, 77.6425],
    suggestedAction: "Merge sliver polygon into dominant parcel P119 according to Ground Truth peg marker."
  },
  {
    id: "TOPO-004",
    type: "Dangling Edge",
    parcelA: "KA-BLR-W142-P127",
    severity: "low",
    areaAffectedSqM: 0.0,
    description: "Unclosed boundary polyline node with 0.18m vertex overshoot into municipal right-of-way.",
    status: "detected",
    location: [12.9715, 77.6440],
    suggestedAction: "Trim dangling node and snap vertex to municipal road reserve boundary."
  },
  {
    id: "TOPO-005",
    type: "Area Discrepancy",
    parcelA: "KA-BLR-W142-P131",
    severity: "medium",
    areaAffectedSqM: 32.4,
    description: "Measured drone area differs by +6.8% compared to Bhoomi Khata RoR registered area.",
    status: "detected",
    location: [12.9719, 77.6398],
    suggestedAction: "Flag for Field Surveyor physical cross-measurement and update RoR provisional annexure."
  }
];

// Change Detection Cases
export const INITIAL_CHANGE_RECORDS: ChangeDetectionRecord[] = [
  {
    id: "CHG-2026-01",
    parcelId: "KA-BLR-W142-P106",
    changeType: "New Construction",
    confidence: 96,
    areaDiffSqM: 184,
    detectedDate: "2026-09-18",
    previousSource: "Cadastral Map 2024 (Vacant Plot)",
    currentSource: "ORI Drone Extraction 2026 (G+2 Structure)",
    status: "Pending Review",
    notes: "New G+2 residential structure detected on previously vacant registered plot. Setbacks compliant.",
    location: [12.9682, 77.6432]
  },
  {
    id: "CHG-2026-02",
    parcelId: "KA-BLR-W142-P114",
    changeType: "Encroachment",
    confidence: 91,
    areaDiffSqM: 19.5,
    detectedDate: "2026-09-20",
    previousSource: "Municipal Right of Way 2024",
    currentSource: "High-Res Drone ORI 2026",
    status: "Pending Review",
    notes: "Compound wall extended 1.2m into municipal road shoulder alignment. Recommended for notice.",
    location: [12.9695, 77.6445]
  },
  {
    id: "CHG-2026-03",
    parcelId: "KA-BLR-W142-P121",
    changeType: "Demolition",
    confidence: 94,
    areaDiffSqM: 142,
    detectedDate: "2026-09-24",
    previousSource: "LiDAR Building Model 2025",
    currentSource: "ORI Drone 2026",
    status: "Approved",
    notes: "Old tiled shed cleared; site prepared for sanctioned municipal community hall construction.",
    location: [12.9705, 77.6385]
  },
  {
    id: "CHG-2026-04",
    parcelId: "KA-BLR-W142-P133",
    changeType: "Boundary Shift",
    confidence: 88,
    areaDiffSqM: 11.2,
    detectedDate: "2026-09-25",
    previousSource: "Tippani Settlement Survey",
    currentSource: "GNSS Rover & CORS Base",
    status: "Pending Review",
    notes: "Boundary shifted 0.8m southwards consistent with verified stone pillar #P-142.",
    location: [12.9720, 77.6420]
  }
];

// Spatial Conflicts in Queue
export const INITIAL_CONFLICTS: ConflictItem[] = [
  {
    id: "CONF-001",
    parcelId: "KA-BLR-W142-P104",
    surveyNo: "Sy. No. 40/4",
    conflictType: "Boundary Contradiction",
    sourceA: {
      name: "Legacy Cadastral Tippani Map",
      value: "Boundary follows straight north-south line (Azimuth 0°)",
      date: "2024-03-10",
      confidence: 76
    },
    sourceB: {
      name: "High-Res Drone Orthomosaic (ORI)",
      value: "Boundary has 0.9m physical compound wall jog with active fence",
      date: "2026-09-15",
      confidence: 96
    },
    aiSuggestion: {
      chosenSource: "High-Res Drone Orthomosaic (ORI)",
      confidence: 94,
      reasoning: "Physical masonry boundary wall confirmed on 5cm ORI drone imagery and verified by GNSS GCP-14 station (RMSE 0.018m)."
    },
    status: "unresolved",
    auditTrail: [
      {
        timestamp: "2026-10-01 11:20:00",
        user: "GeoAI Auto-Ingest Engine",
        action: "Detected boundary contradiction between Tippani vector and ORI raster edge."
      }
    ]
  },
  {
    id: "CONF-002",
    parcelId: "KA-BLR-W142-P119",
    surveyNo: "Sy. No. 42/3",
    conflictType: "Area Mismatch",
    sourceA: {
      name: "Bhoomi Revenue RoR Register",
      value: "Registered Area: 480.00 sq. meters",
      date: "2025-11-04",
      confidence: 84
    },
    sourceB: {
      name: "Harmonized PostGIS Measurement",
      value: "Calculated Geodesic Area: 518.40 sq. meters (+8.0%)",
      date: "2026-09-28",
      confidence: 95
    },
    aiSuggestion: {
      chosenSource: "Harmonized PostGIS Measurement",
      confidence: 89,
      reasoning: "Field boundary stones correlate with GNSS RTK survey. Legacy register omitted the triangular rear setback strip."
    },
    status: "unresolved",
    auditTrail: [
      {
        timestamp: "2026-10-01 11:22:15",
        user: "Attribute Sync Engine",
        action: "Area discrepancy 38.4m² exceeded 5% tolerance threshold."
      }
    ]
  },
  {
    id: "CONF-003",
    parcelId: "KA-BLR-W142-P131",
    surveyNo: "Sy. No. 43/7",
    conflictType: "Ownership Collision",
    sourceA: {
      name: "Bhoomi Revenue Land Ledger",
      value: "Owner: Sri Rameshwar Rao (Khata #4410)",
      date: "2023-08-12",
      confidence: 80
    },
    sourceB: {
      name: "Municipal Property Tax PID Register",
      value: "Owner: Smt. Sunita Rao (Wife/Co-owner, PID #142-098)",
      date: "2026-04-10",
      confidence: 92
    },
    aiSuggestion: {
      chosenSource: "Harmonized Joint Khata Record",
      confidence: 91,
      reasoning: "Mutation Entry M-2024-89 recorded devolution of joint tenancy. Suggest updating spatial parcel attribute to 'Sri Rameshwar Rao & Smt. Sunita Rao (Joint)'."
    },
    status: "unresolved",
    auditTrail: [
      {
        timestamp: "2026-10-01 11:25:40",
        user: "Fuzzy Attribute Matcher",
        action: "Spousal mutation discrepancy identified across Municipal and Revenue silos."
      }
    ]
  }
];

// Initial Pipeline Steps (8 Guided Steps aligned with NAKSHA Standards)
export const INITIAL_PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    name: "Ingest and Validate Files",
    shortName: "Data Ingestion",
    description: "Parse multi-format geospatial inputs (GeoTIFF, Shapefile, CSV, RINEX, GeoJSON), check headers and geometry validity.",
    durationMs: 2200,
    status: "completed",
    progress: 100,
    metrics: {
      "Datasets Validated": "10 of 10",
      "Corrupted Polygons": "0",
      "Total Data Volume": "4.4 GB",
      "Ingestion Throughput": "180 MB/s"
    },
    logs: [
      "Mounted 10 input streams: Drone ORI, Cadastral Shapefiles, Bhoomi RoR, GNSS CORS.",
      "Validated GeoTIFF headers: 4-band RGB-NIR GSD verified at 0.05m.",
      "Validated GeoJSON & Shapefile topology syntax: zero invalid geometries found.",
      "Stage 1 completed with exit code 0 (SUCCESS)."
    ]
  },
  {
    id: 2,
    name: "Geo-referencing & Coordinate Transformation",
    shortName: "CRS Transformation",
    description: "Detect native coordinate reference systems (local village datums, EPSG:32643) and reproject to EPSG:4326 using CORS control network.",
    durationMs: 3100,
    status: "completed",
    progress: 100,
    metrics: {
      "Input CRS": "EPSG:32643 / Local",
      "Output Target CRS": "EPSG:4326 (WGS 84)",
      "Initial RMSE": "0.412 m",
      "Final Post-CORS RMSE": "0.016 m",
      "Control Points Used": "3 CORS + 6 GCPs"
    },
    logs: [
      "Identified local village datum distortion in legacy cadastral Tippani maps.",
      "Loaded Survey of India CORS Station CORS-BLR-01 coordinates [12.9728, 77.6385].",
      "Executed Helmert 7-Parameter Affine Transformation on 40 cadastral polygons.",
      "Residual positional error reduced from 41.2cm to 1.6cm (96.1% improvement).",
      "Stage 2 completed with high geodetic accuracy."
    ]
  },
  {
    id: 3,
    name: "AI/ML Spatial Matching",
    shortName: "Spatial Feature Matching",
    description: "Align cadastral boundary vectors with AI-segmented rooftop footprints and drone edges using deep spatial similarity graph.",
    durationMs: 2800,
    status: "completed",
    progress: 100,
    metrics: {
      "Parcels Processed": 40,
      "Direct Matched": 35,
      "Partial Alignments": 4,
      "Unmatched Candidates": 1,
      "Mean Intersection over Union (mIoU)": "0.914"
    },
    logs: [
      "Inferred Mask R-CNN building footprints from drone orthomosaic (32 structures).",
      "Constructed spatial bipartite matching graph between cadastral plots and extracted roofs.",
      "Computed Hausdorff distances and angular orientation vectors.",
      "35 parcels aligned with >92% IoU; 4 parcels flagged for boundary adjustment.",
      "Stage 3 completed."
    ]
  },
  {
    id: 4,
    name: "Automated Topology Correction",
    shortName: "Topology Correction",
    description: "Run automated topological rules: enforce planar partition, eliminate overlaps, bridge sliver vacuums, and snap dangling nodes.",
    durationMs: 2500,
    status: "completed",
    progress: 100,
    metrics: {
      "Total Issues Found": 5,
      "Auto-Corrected": 4,
      "Pending Human Review": 1,
      "Snapping Tolerance": "0.20 m",
      "Clean Area Preserved": "99.8%"
    },
    logs: [
      "Detected 1 boundary overlap (14.8m²), 1 vacuum gap (8.2m²), 1 sliver (4.1m²), 1 dangling node.",
      "Auto-snapped dangling node TOPO-004 to municipal road line.",
      "Dissolved sliver polygon TOPO-003 into parent parcel P119 via vertex snapping.",
      "Auto-partitioned gap TOPO-002 along surveyor boundary fence.",
      "High severity overlap TOPO-001 routed to Conflict Resolution queue."
    ]
  },
  {
    id: 5,
    name: "Intelligent Attribute Mapping",
    shortName: "Attribute Mapping",
    description: "Link state Bhoomi revenue ledger fields (Khasra No, Owner name, Area, Land Use) to spatial parcels using Levenshtein fuzzy matching.",
    durationMs: 2200,
    status: "completed",
    progress: 100,
    metrics: {
      "Attributes Mapped": "39 of 40",
      "Fuzzy Match Accuracy": "97.4%",
      "Exact Survey No Matches": "38",
      "Unlinked Records": "0"
    },
    logs: [
      "Parsed 40 Bhoomi Khata RoR records from municipal database.",
      "Executed phonetic name matching on bilingual Kannada-English owner names.",
      "Matched 38 records with 100% confidence on survey number index.",
      "Mapped 2 fuzzy discrepancies (e.g. spelling variation 'Deshmukh' vs 'Deshmukhe').",
      "Stage 5 completed successfully."
    ]
  },
  {
    id: 6,
    name: "Change Detection Engine",
    shortName: "Change Detection",
    description: "Perform bi-temporal differential comparison between historic cadastral vectors and fresh 2026 drone orthophoto extraction.",
    durationMs: 2600,
    status: "completed",
    progress: 100,
    metrics: {
      "Changes Detected": 4,
      "New Constructions": 1,
      "Encroachments Flagged": 1,
      "Demolitions": 1,
      "Boundary Adjustments": 1
    },
    logs: [
      "Loaded 2024 cadastral baseline vector layer.",
      "Rasterized 2026 drone segmentation masks and computed NDVI + elevation differential.",
      "Detected unmapped 2-storey residential construction on Plot 106 (+184 m² built-up).",
      "Flagged 19.5 m² compound wall encroachment on municipal right-of-way (Plot 114).",
      "Stage 6 completed."
    ]
  },
  {
    id: 7,
    name: "Spatial Conflict Resolution",
    shortName: "Conflict Resolution",
    description: "Identify multi-source discrepancies and invoke Explainable GeoAI rules engine to generate prioritized arbitration suggestions.",
    durationMs: 2100,
    status: "completed",
    progress: 100,
    metrics: {
      "Total Conflicts": 3,
      "AI Recommended": 3,
      "High Confidence Decisions": "2",
      "Surveyor Escalations": "1"
    },
    logs: [
      "Evaluated competing claims between Tippani vector, Drone ORI, and Bhoomi RoR ledger.",
      "Computed source credibility weights (CORS GNSS: 0.99, Drone ORI: 0.96, Legacy CAD: 0.76).",
      "Generated explainable reasoning logs with Ground Control Point references.",
      "Enqueued 3 items for officer review in Conflict Resolution Center.",
      "Stage 7 completed."
    ]
  },
  {
    id: 8,
    name: "Confidence Scoring & Final Export",
    shortName: "Confidence Scoring",
    description: "Synthesize 5-factor quality matrix (positional, attribute, topology, source agreement, temporal) and generate NAKSHA compliant GeoJSON.",
    durationMs: 1900,
    status: "completed",
    progress: 100,
    metrics: {
      "Mean Ward Confidence": "94.6%",
      "Verified (Auto-Accepted)": "33 parcels",
      "Needs Review": "4 parcels",
      "Open Conflicts": "3 parcels",
      "Export Ready": "OGC GeoJSON / PostGIS"
    },
    logs: [
      "Calculated weighted ISO 19157 geographic data quality scores for 40 parcels.",
      "Mean positional accuracy: 1.6cm RMSE across ward boundary.",
      "Assembled standardized Land Administration Domain Model (ISO 19152 LADM) packages.",
      "Generated publication ready GeoJSON, ESRI Shapefile, and PostGIS SQL dumps.",
      "Pipeline fully completed."
    ]
  }
];

// Surveyor Tasks (Field Verification Queue)
export const MOCK_SURVEYOR_TASKS: SurveyorTask[] = [
  {
    id: "TSK-W142-01",
    parcelId: "KA-BLR-W142-P104",
    surveyNo: "Sy. No. 40/4",
    assignedSurveyor: "Vikram Rathore (ID: SV-884)",
    priority: "High",
    status: "Pending",
    dueTime: "Today, 15:00",
    address: "Plot 104, 12th Main Road, Indiranagar East, Bengaluru",
    taskType: "Boundary Conflict Audit",
    coordinates: [12.9684, 77.6415],
    instructions: "Verify eastern physical masonry boundary wall against 0.9m jog detected on 5cm drone orthomosaic. Collect 4-corner RTK points with CORS-BLR-01 lock."
  },
  {
    id: "TSK-W142-02",
    parcelId: "KA-BLR-W142-P114",
    surveyNo: "Sy. No. 41/6",
    assignedSurveyor: "Vikram Rathore (ID: SV-884)",
    priority: "High",
    status: "Pending",
    dueTime: "Today, 17:30",
    address: "Plot 114, 8th Cross, Halasuru Border, Bengaluru",
    taskType: "Encroachment Inspection",
    coordinates: [12.9695, 77.6445],
    instructions: "Inspect alleged 1.2m compound wall extension into municipal road reserve line. Log physical fence boundary vertices with cm precision."
  },
  {
    id: "TSK-W142-03",
    parcelId: "KA-BLR-W142-P106",
    surveyNo: "Sy. No. 40/6",
    assignedSurveyor: "Vikram Rathore (ID: SV-884)",
    priority: "Medium",
    status: "In Progress",
    dueTime: "Tomorrow, 11:00",
    address: "Plot 106, 14th Main, Indiranagar, Bengaluru",
    taskType: "New Construction Check",
    coordinates: [12.9682, 77.6432],
    instructions: "Ground-truth unmapped G+2 residential RCC structure. Measure building plinth setbacks and record building height."
  },
  {
    id: "TSK-W142-04",
    parcelId: "KA-BLR-W142-P119",
    surveyNo: "Sy. No. 42/3",
    assignedSurveyor: "Vikram Rathore (ID: SV-884)",
    priority: "Medium",
    status: "Completed",
    dueTime: "Completed 09:30",
    address: "Plot 119, Cambridge Layout Extension, Bengaluru",
    taskType: "Ground Truth Verification",
    coordinates: [12.9708, 77.6425],
    instructions: "Locate boundary stone #P-142. Verify triangular rear strip omitted in legacy pakka register.",
    submittedData: {
      verifiedDate: "2026-10-02 09:28",
      gnssLatitude: 12.97084,
      gnssLongitude: 77.64252,
      accuracyCm: 1.4,
      boundaryAction: "Accepted AI Boundary",
      fieldRemarks: "Physical stone monument found intact. Boundary aligns with 2026 ORI rooftop edge.",
      photoAttached: true
    }
  },
  {
    id: "TSK-W142-05",
    parcelId: "KA-BLR-W142-P131",
    surveyNo: "Sy. No. 43/7",
    assignedSurveyor: "Vikram Rathore (ID: SV-884)",
    priority: "Low",
    status: "Pending",
    dueTime: "Tomorrow, 16:00",
    address: "Plot 131, Old Madras Road Fringe, Bengaluru",
    taskType: "Ground Truth Verification",
    coordinates: [12.9719, 77.6398],
    instructions: "Physical verification of joint tenancy occupancy per Municipal PID #142-098 claim."
  }
];

// Mutation Records for Revenue Officer
export const MOCK_MUTATION_RECORDS: MutationRecord[] = [
  {
    id: "MUT-2026-8812",
    khasraNo: "Kh-104",
    surveyNo: "Sy. 40/4",
    applicantName: "Smt. Kamala Devi",
    transferorName: "Late R. Sundaram",
    mutationType: "Devolution / Inheritance",
    filingDate: "2026-09-12",
    hearingDate: "2026-10-08",
    status: "Notice Issued",
    tehsil: "Bengaluru East",
    ward: "Ward 142 - Indiranagar East"
  },
  {
    id: "MUT-2026-8815",
    khasraNo: "Kh-119",
    surveyNo: "Sy. 42/3",
    applicantName: "Sri Anand Vardhan Rao",
    transferorName: "Sri K. V. Rao",
    mutationType: "Sale Deed",
    filingDate: "2026-09-18",
    hearingDate: "2026-10-12",
    status: "Field Survey Pending",
    tehsil: "Bengaluru East",
    ward: "Ward 142 - Indiranagar East"
  },
  {
    id: "MUT-2026-8819",
    khasraNo: "Kh-131",
    surveyNo: "Sy. 43/7",
    applicantName: "Smt. Sunita Rao & Sri Rameshwar Rao",
    transferorName: "Sri Rameshwar Rao",
    mutationType: "Partition",
    filingDate: "2026-09-22",
    hearingDate: "2026-10-15",
    status: "In Review",
    tehsil: "Bengaluru East",
    ward: "Ward 142 - Indiranagar East"
  },
  {
    id: "MUT-2026-8798",
    khasraNo: "Kh-101",
    surveyNo: "Sy. 40/1",
    applicantName: "Sri Devendra Patel",
    transferorName: "Mansukhbhai Patel",
    mutationType: "Gift Deed",
    filingDate: "2026-08-14",
    hearingDate: "2026-09-02",
    status: "Sanctioned",
    tehsil: "Bengaluru East",
    ward: "Ward 142 - Indiranagar East"
  }
];

// System Admin Users
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "USR-001",
    name: "Dr. K. S. Murthy, IAS",
    email: "murthy.ks@landrecords.gov.in",
    role: "Revenue Officer",
    department: "Department of Land Resources (DoLR)",
    status: "Active",
    lastLogin: "10 mins ago"
  },
  {
    id: "USR-002",
    name: "Vikram Rathore",
    email: "rathore.v@surveyofindia.gov.in",
    role: "Field Surveyor",
    department: "Survey of India (SoI) Karnataka Circle",
    status: "Active",
    lastLogin: "Just now (Mobile RTK Rover)"
  },
  {
    id: "USR-003",
    name: "Pooja Sharma",
    email: "sharma.p@nic.in",
    role: "System Admin",
    department: "National Informatics Centre (NIC) GeoAI Unit",
    status: "Active",
    lastLogin: "42 mins ago"
  },
  {
    id: "USR-004",
    name: "Citizen Guest Session",
    email: "public.portal@bhusetu.gov.in",
    role: "Public Viewer",
    department: "Public Open Land Registry",
    status: "Active",
    lastLogin: "Live"
  }
];

// System Audit Logs
export const MOCK_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: "LOG-9921",
    timestamp: "2026-10-02 05:12:10",
    actor: "Pooja Sharma (System Admin)",
    role: "System Admin",
    action: "Triggered 8-Step Automated Pipeline on Ward 142",
    targetResource: "Pipeline / Ward-142",
    status: "SUCCESS",
    ipAddress: "10.24.110.42 (NIC MeghRaj)"
  },
  {
    id: "LOG-9920",
    timestamp: "2026-10-02 04:58:33",
    actor: "Dr. K. S. Murthy (Revenue Officer)",
    role: "Revenue Officer",
    action: "Arbitrated Spatial Conflict CONF-001: Adopted AI Drone ORI Masonry Line",
    targetResource: "Parcel KA-BLR-W142-P104",
    status: "SUCCESS",
    ipAddress: "10.24.110.15"
  },
  {
    id: "LOG-9919",
    timestamp: "2026-10-02 04:45:18",
    actor: "Vikram Rathore (Field Surveyor)",
    role: "Field Surveyor",
    action: "Uploaded GNSS Rover RTK verification for Stone P-142 (RMSE 1.4cm)",
    targetResource: "Task TSK-W142-04",
    status: "SUCCESS",
    ipAddress: "192.168.4.120 (Trimble Geo7X)"
  },
  {
    id: "LOG-9918",
    timestamp: "2026-10-02 04:10:04",
    actor: "NAKSHA API Gateway Daemon",
    role: "System Admin",
    action: "Synchronized 40 GeoJSON parcels with National NAKSHA Registry",
    targetResource: "API /v1/wards/142/sync",
    status: "SUCCESS",
    ipAddress: "10.24.8.1"
  }
];

// Public Viewer FAQs
export const MOCK_PUBLIC_FAQS = [
  {
    q: "What is BhuSetu?",
    a: "BhuSetu is the National Urban Land Record Management Platform developed for automated multi-source geospatial harmonization, aligned with the NAKSHA Programme under the Department of Land Resources (Ministry of Rural Development)."
  },
  {
    q: "How does BhuSetu ensure boundary accuracy?",
    a: "BhuSetu integrates high-resolution drone orthomosaics (5cm GSD) and continuous geodetic reference from the Survey of India CORS network, reducing spatial boundary distortion to sub-centimeter accuracy."
  },
  {
    q: "Why are owner names and personal records not visible on the public map?",
    a: "In compliance with national data privacy standards and the Digital Personal Data Protection Act, the public map provides parcel spatial footprints, land-use zoning, and verification status without exposing personal ownership details."
  },
  {
    q: "How can I report a boundary or record discrepancy?",
    a: "Citizens can submit a discrepancy inquiry directly using the 'Report an Issue with a Record' tool on this portal. Requests are routed to the Tehsil Revenue Officer for ground verification."
  }
];

