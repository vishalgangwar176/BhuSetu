export type LandUseType = 'Residential' | 'Commercial' | 'Mixed Use' | 'Public Utility' | 'Institutional' | 'Open Green';

export type ParcelStatus = 'verified' | 'needs_review' | 'conflict';

export interface ScoreBreakdown {
  positional: number;
  attribute: number;
  topology: number;
  sourceAgreement: number;
  temporal: number;
}

export interface Parcel {
  id: string;
  surveyNo: string; // e.g. "Sy. No. 44/2"
  khasraNo: string;
  plotNo: string;
  ward: string;
  ownerName: string;
  fatherHusbandName: string;
  landUse: LandUseType;
  recordAreaSqM: number;
  measuredAreaSqM: number;
  areaDeltaPercent: number;
  confidenceScore: number;
  status: ParcelStatus;
  mutationDate: string;
  encumbranceStatus: 'Clear' | 'Disputed' | 'Pending Verification';
  taxAssessmentId: string;
  coordinates: [number, number][]; // Polygon ring [lat, lng]
  center: [number, number];
  buildingCount: number;
  lineage: string[];
  flags: string[];
  scoreBreakdown: ScoreBreakdown;
}

export interface BuildingFootprint {
  id: string;
  parcelId: string;
  storeys: number;
  heightMeters: number;
  builtUpAreaSqM: number;
  detectionSource: 'ORI Drone Extraction' | 'LiDAR DSM' | 'Municipal Building Plan';
  confidence: number;
  coordinates: [number, number][];
}

export interface UtilityLine {
  id: string;
  type: 'Water Supply' | 'Power Feeder (11kV)' | 'Storm Water Drain' | 'Sewage Pipeline';
  diameterOrRating: string;
  status: 'Operational' | 'Under Maintenance';
  coordinates: [number, number][];
}

export interface GNSSPoint {
  id: string;
  name: string;
  crs: string;
  latitude: number;
  longitude: number;
  elevation: number;
  rmseX: number;
  rmseY: number;
  rmseZ: number;
  status: 'Fixed' | 'Float';
}

export interface DataSource {
  id: string;
  name: string;
  category: string;
  supportedFormats: string;
  sourceType: string;
  crs: string;
  resolution: string;
  recordCount: number;
  lastUpdated: string;
  qualityScore: number;
  loaded: boolean;
  fileSize: string;
  description: string;
}

export interface PipelineStep {
  id: number;
  name: string;
  shortName: string;
  description: string;
  durationMs: number;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  metrics: Record<string, string | number>;
  logs: string[];
}

export interface TopologyIssue {
  id: string;
  type: 'Overlap' | 'Gap' | 'Sliver Polygon' | 'Dangling Edge' | 'Area Discrepancy';
  parcelA: string;
  parcelB?: string;
  severity: 'high' | 'medium' | 'low';
  areaAffectedSqM: number;
  description: string;
  status: 'detected' | 'auto_fixed' | 'ignored' | 'under_review';
  location: [number, number];
  suggestedAction: string;
}

export interface ChangeDetectionRecord {
  id: string;
  parcelId: string;
  changeType: 'New Construction' | 'Demolition' | 'Boundary Shift' | 'Encroachment';
  confidence: number;
  areaDiffSqM: number;
  detectedDate: string;
  previousSource: string;
  currentSource: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  notes: string;
  location: [number, number];
}

export interface ConflictItem {
  id: string;
  parcelId: string;
  surveyNo: string;
  conflictType: 'Area Mismatch' | 'Boundary Contradiction' | 'Ownership Collision' | 'Zoning Disparity';
  sourceA: {
    name: string;
    value: string;
    date: string;
    confidence: number;
  };
  sourceB: {
    name: string;
    value: string;
    date: string;
    confidence: number;
  };
  aiSuggestion: {
    chosenSource: string;
    confidence: number;
    reasoning: string;
  };
  status: 'unresolved' | 'accepted_ai' | 'chose_source_a' | 'chose_source_b' | 'escalated';
  auditTrail: {
    timestamp: string;
    user: string;
    action: string;
  }[];
}

export type UserRole = 'Revenue Officer' | 'Field Surveyor' | 'System Admin' | 'Public Viewer';
export type FirestoreRole = 'revenue_officer' | 'field_surveyor' | 'system_admin' | 'public_viewer';

export const toFirestoreRole = (role: UserRole): FirestoreRole => {
  switch (role) {
    case 'Revenue Officer': return 'revenue_officer';
    case 'Field Surveyor': return 'field_surveyor';
    case 'System Admin': return 'system_admin';
    case 'Public Viewer': return 'public_viewer';
    default: return 'public_viewer';
  }
};

export const fromFirestoreRole = (role?: string | null): UserRole => {
  switch (role) {
    case 'revenue_officer': return 'Revenue Officer';
    case 'field_surveyor': return 'Field Surveyor';
    case 'system_admin': return 'System Admin';
    case 'public_viewer': return 'Public Viewer';
    case 'Revenue Officer': return 'Revenue Officer';
    case 'Field Surveyor': return 'Field Surveyor';
    case 'System Admin': return 'System Admin';
    case 'Public Viewer': return 'Public Viewer';
    default: return 'Public Viewer';
  }
};

export interface GroundingCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  distanceMeters?: number;
  lat: number;
  lng: number;
  uri?: string;
  sourceAttribution?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: GroundingCitation[];
  places?: NearbyPlace[];
  suggestedAction?: {
    type: 'insert_remark' | 'view_parcel' | 'navigate';
    label: string;
    payload: string;
  };
}

export interface SurveyorTask {
  id: string;
  parcelId: string;
  surveyNo: string;
  assignedSurveyor: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Synced';
  dueTime: string;
  address: string;
  taskType: 'Ground Truth Verification' | 'Boundary Conflict Audit' | 'New Construction Check' | 'Encroachment Inspection';
  coordinates: [number, number];
  instructions: string;
  submittedData?: {
    verifiedDate: string;
    gnssLatitude: number;
    gnssLongitude: number;
    accuracyCm: number;
    boundaryAction: 'Accepted AI Boundary' | 'Adjusted Physical Boundary';
    fieldRemarks: string;
    photoAttached: boolean;
  };
}

export interface MutationRecord {
  id: string;
  khasraNo: string;
  surveyNo: string;
  applicantName: string;
  transferorName: string;
  mutationType: 'Devolution / Inheritance' | 'Sale Deed' | 'Gift Deed' | 'Partition';
  filingDate: string;
  hearingDate: string;
  status: 'In Review' | 'Notice Issued' | 'Field Survey Pending' | 'Sanctioned' | 'Rejected';
  tehsil: string;
  ward: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Suspended' | 'Invited';
  lastLogin: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetResource: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
}
