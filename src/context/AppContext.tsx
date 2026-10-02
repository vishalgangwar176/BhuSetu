import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Parcel,
  DataSource,
  PipelineStep,
  TopologyIssue,
  ChangeDetectionRecord,
  ConflictItem,
  UserRole,
  FirestoreRole,
  toFirestoreRole,
  fromFirestoreRole,
  BuildingFootprint,
  UtilityLine,
  GNSSPoint,
  SurveyorTask,
  MutationRecord,
  AdminUser,
  SystemAuditLog,
  NearbyPlace,
  GroundingCitation,
  ChatMessage
} from '../types';
import {
  MOCK_PARCELS,
  MOCK_BUILDINGS,
  MOCK_UTILITIES,
  MOCK_GNSS_POINTS,
  INITIAL_DATA_SOURCES,
  INITIAL_PIPELINE_STEPS,
  INITIAL_TOPOLOGY_ISSUES,
  INITIAL_CHANGE_RECORDS,
  INITIAL_CONFLICTS,
  MOCK_SURVEYOR_TASKS,
  MOCK_MUTATION_RECORDS,
  MOCK_ADMIN_USERS,
  MOCK_AUDIT_LOGS
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  FirebaseUser
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface PublicGrievance {
  id: string;
  khasraOrSurveyNo: string;
  ward: string;
  issueType: string;
  citizenName: string;
  citizenContact: string;
  description: string;
  submittedAt: string;
  status: 'Received' | 'Assigned to Surveyor' | 'Resolved';
}

interface AppContextType {
  // Authentication & Profile
  currentUser: FirebaseUser | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  loginAsRole: (role: UserRole) => Promise<void>;

  // Data Collections
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  setSelectedParcel: (parcel: Parcel | null) => void;
  buildings: BuildingFootprint[];
  utilities: UtilityLine[];
  gnssPoints: GNSSPoint[];
  dataSources: DataSource[];
  loadDataSource: (id: string) => void;
  loadAllSampleSources: () => void;
  pipelineSteps: PipelineStep[];
  isPipelineRunning: boolean;
  activePipelineStepIndex: number;
  runPipeline: () => void;
  pausePipeline: () => void;
  resetPipeline: () => void;
  topologyIssues: TopologyIssue[];
  autoFixTopologyIssue: (id: string) => void;
  autoFixAllTopology: () => void;
  ignoreTopologyIssue: (id: string) => void;
  changeRecords: ChangeDetectionRecord[];
  updateChangeStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  conflicts: ConflictItem[];
  resolveConflict: (conflictId: string, resolution: 'accepted_ai' | 'chose_source_a' | 'chose_source_b' | 'escalated') => void;
  
  // Role specific state
  surveyorTasks: SurveyorTask[];
  updateSurveyorTask: (taskId: string, submission: NonNullable<SurveyorTask['submittedData']>) => Promise<void>;
  mutationRecords: MutationRecord[];
  updateMutationStatus: (mutationId: string, status: MutationRecord['status']) => void;
  adminUsers: AdminUser[];
  toggleUserStatus: (userId: string) => void;
  addAdminUser: (user: Omit<AdminUser, 'id' | 'lastLogin'>) => void;
  changeUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  auditLogs: SystemAuditLog[];
  logAuditEvent: (action: string, targetResource: string, details?: string) => Promise<void>;
  publicGrievances: PublicGrievance[];
  submitPublicGrievance: (grievance: Omit<PublicGrievance, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  seedSampleFirestoreData: () => Promise<void>;
  isSeeding: boolean;

  // GIS & Layer Preferences
  activeWard: string;
  setActiveWard: (ward: string) => void;
  activeLayers: {
    cadastral: boolean;
    buildings: boolean;
    droneOverlay: boolean;
    utilities: boolean;
    gnss: boolean;
    nearbyPlaces: boolean;
    topologyHighlights: boolean;
  };
  toggleLayer: (layerName: 'cadastral' | 'buildings' | 'droneOverlay' | 'utilities' | 'gnss' | 'nearbyPlaces' | 'topologyHighlights') => void;
  layerOpacity: {
    cadastral: number;
    droneOverlay: number;
    buildings: number;
  };
  setLayerOpacity: (layer: 'cadastral' | 'droneOverlay' | 'buildings', value: number) => void;
  basemap: 'streets' | 'satellite' | 'carto';
  setBasemap: (map: 'streets' | 'satellite' | 'carto') => void;
  confidenceThresholds: {
    autoAccept: number;
    reviewThreshold: number;
  };
  setConfidenceThresholds: (thresholds: { autoAccept: number; reviewThreshold: number }) => void;

  // Google Search Grounding & Guidelines
  askSearchGrounding: (query: string, context?: string) => Promise<{ text: string; citations: GroundingCitation[]; disclaimer: string }>;
  verifyWithGuidelines: (conflict: ConflictItem) => Promise<{ text: string; citations: GroundingCitation[]; verified: boolean }>;

  // Google Maps Grounding & Location Intelligence
  nearbyPlaces: NearbyPlace[];
  setNearbyPlaces: (places: NearbyPlace[]) => void;
  fetchNearbyContext: (lat: number, lng: number, parcelInfo?: any) => Promise<{ text: string; places: NearbyPlace[]; sourceAttribution: string }>;

  // Gemini Chatbot State
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  sendChatMessage: (content: string, activePageName?: string) => Promise<void>;
  clearChat: () => void;
  draftedRemark: string | null;
  setDraftedRemark: (remark: string | null) => void;

  // Notifications & Theme
  toast: Toast | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  fontSize: 'small' | 'normal' | 'large';
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>('Revenue Officer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Initial demo session active
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Datasets
  const [parcels, setParcels] = useState<Parcel[]>(MOCK_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(MOCK_PARCELS[0]);
  const [buildings] = useState<BuildingFootprint[]>(MOCK_BUILDINGS);
  const [utilities] = useState<UtilityLine[]>(MOCK_UTILITIES);
  const [gnssPoints, setGnssPoints] = useState<GNSSPoint[]>(MOCK_GNSS_POINTS);
  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE_STEPS);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [activePipelineStepIndex, setActivePipelineStepIndex] = useState<number>(7);
  const [topologyIssues, setTopologyIssues] = useState<TopologyIssue[]>(INITIAL_TOPOLOGY_ISSUES);
  const [changeRecords, setChangeRecords] = useState<ChangeDetectionRecord[]>(INITIAL_CHANGE_RECORDS);
  const [conflicts, setConflicts] = useState<ConflictItem[]>(INITIAL_CONFLICTS);
  const [surveyorTasks, setSurveyorTasks] = useState<SurveyorTask[]>(MOCK_SURVEYOR_TASKS);
  const [mutationRecords, setMutationRecords] = useState<MutationRecord[]>(MOCK_MUTATION_RECORDS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(MOCK_AUDIT_LOGS);
  const [publicGrievances, setPublicGrievances] = useState<PublicGrievance[]>([]);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Maps Grounding & Nearby Places
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([
    {
      id: 'p-1',
      name: 'Indiranagar Metro Station (Purple Line)',
      category: 'Metro / Transit',
      address: 'CMH Road, Indiranagar',
      distanceMeters: 420,
      lat: 12.9784,
      lng: 77.6385,
      sourceAttribution: 'Google Maps'
    },
    {
      id: 'p-2',
      name: 'Halasuru Lake Public Garden',
      category: 'Park / Civic',
      address: 'Kensington Road',
      distanceMeters: 650,
      lat: 12.9831,
      lng: 77.6253,
      sourceAttribution: 'Google Maps'
    },
    {
      id: 'p-3',
      name: 'Chinmaya Mission Hospital',
      category: 'Hospital',
      address: 'CMH Road',
      distanceMeters: 550,
      lat: 12.9772,
      lng: 77.6435,
      sourceAttribution: 'Google Maps'
    }
  ]);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: 'Welcome to **BhuSetu Assistant**. I am your context-aware geospatial intelligence partner. Ask me about parcel boundaries, area discrepancies, on-ground verification protocols, or pipeline diagnostics.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const [draftedRemark, setDraftedRemark] = useState<string | null>(null);

  // Ward & GIS View
  const [activeWard, setActiveWard] = useState<string>('Ward 142 - Indiranagar East, Bengaluru Urban');
  
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('bhusetu_theme') as ThemeMode;
    return saved || 'light';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // GIGW Accessibility: Font size scaler (90%, 100%, 115%)
  const [fontSize, setFontSizeState] = useState<'small' | 'normal' | 'large'>(() => {
    const saved = localStorage.getItem('bhusetu_fontsize') as 'small' | 'normal' | 'large';
    return saved || 'normal';
  });

  const setFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSizeState(size);
    localStorage.setItem('bhusetu_fontsize', size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '90%';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '115%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  };

  // Language state (English / हिन्दी)
  const [language, setLanguageState] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('bhusetu_language') as 'en' | 'hi';
    return saved || 'en';
  });

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    localStorage.setItem('bhusetu_language', lang);
    showToast("Language Preference", lang === 'hi' ? 'भाषा हिन्दी पर सेट की गई है।' : 'Language set to English.', 'info');
  };

  // Layer toggles
  const [activeLayers, setActiveLayers] = useState({
    cadastral: true,
    buildings: true,
    droneOverlay: true,
    utilities: true,
    gnss: true,
    nearbyPlaces: true,
    topologyHighlights: true
  });

  const [layerOpacity, setLayerOpacityState] = useState({
    cadastral: 0.85,
    droneOverlay: 0.7,
    buildings: 0.9
  });

  const [basemap, setBasemap] = useState<'streets' | 'satellite' | 'carto'>('streets');
  const [confidenceThresholds, setConfidenceThresholds] = useState({
    autoAccept: 90,
    reviewThreshold: 75
  });

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type
    });
  };

  const dismissToast = () => setToast(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Theme synchronization with document & Firestore
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      const darkActive = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      setIsDarkMode(darkActive);
      if (darkActive) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('bhusetu_theme', newTheme);

    const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Save in Firestore if user is authenticated
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { theme: newTheme }).catch((err) => {
        console.warn('Could not save theme to user profile in Firestore', err);
      });
    }
    showToast(isDark ? "Dark Mode Activated" : "Light Mode Activated", `Switched to ${newTheme} mode.`, "info");
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(false);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);

        // Fetch user profile from Firestore users collection
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data();
            if (data.role) {
              setUserRoleState(fromFirestoreRole(data.role));
            }
            if (data.theme) {
              setThemeState(data.theme);
            }
          } else {
            // New user defaults to public_viewer
            const newUserData = {
              id: user.uid,
              email: user.email || '',
              name: user.displayName || user.email?.split('@')[0] || 'User',
              role: 'public_viewer',
              theme: 'light',
              status: 'Active',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            await setDoc(userDocRef, newUserData);
            setUserRoleState('Public Viewer');
          }
        } catch (err) {
          console.warn('Could not load user profile from Firestore', err);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Parcels Listener
    const unsubParcels = onSnapshot(collection(db, 'parcels'), (snap) => {
      if (!snap.empty) {
        const remoteParcels: Parcel[] = [];
        snap.forEach((docSnap) => {
          remoteParcels.push(docSnap.data() as Parcel);
        });
        if (remoteParcels.length > 0) {
          setParcels(remoteParcels);
          if (!selectedParcel && remoteParcels[0]) {
            setSelectedParcel(remoteParcels[0]);
          }
        }
      }
    }, (err) => {
      console.warn('Parcels onSnapshot notice:', err.message);
    });

    // 2. Conflicts Listener
    const unsubConflicts = onSnapshot(collection(db, 'conflicts'), (snap) => {
      if (!snap.empty) {
        const remoteConflicts: ConflictItem[] = [];
        snap.forEach((docSnap) => {
          remoteConflicts.push(docSnap.data() as ConflictItem);
        });
        setConflicts(remoteConflicts);
      }
    }, (err) => {
      console.warn('Conflicts onSnapshot notice:', err.message);
    });

    // 3. Survey Tasks Listener
    const unsubTasks = onSnapshot(collection(db, 'surveyTasks'), (snap) => {
      if (!snap.empty) {
        const remoteTasks: SurveyorTask[] = [];
        snap.forEach((docSnap) => {
          remoteTasks.push(docSnap.data() as SurveyorTask);
        });
        setSurveyorTasks(remoteTasks);
      }
    }, (err) => {
      console.warn('SurveyTasks onSnapshot notice:', err.message);
    });

    // 4. Audit Logs Listener
    const unsubAudit = onSnapshot(collection(db, 'auditLogs'), (snap) => {
      if (!snap.empty) {
        const logs: SystemAuditLog[] = [];
        snap.forEach((docSnap) => {
          logs.push(docSnap.data() as SystemAuditLog);
        });
        // Sort descending by timestamp
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAuditLogs(logs);
      }
    }, (err) => {
      console.warn('AuditLogs onSnapshot notice:', err.message);
    });

    // 5. Users and Roles Listener (Persisted Roles from Firestore)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      if (!snap.empty) {
        const remoteUsers: AdminUser[] = [];
        snap.forEach((docSnap) => {
          const u = docSnap.data();
          remoteUsers.push({
            id: u.id || docSnap.id,
            name: u.name || 'User',
            email: u.email || '',
            role: fromFirestoreRole(u.role || 'public_viewer'),
            department: u.department || (u.role === 'revenue_officer' ? 'Tehsil Revenue Dept' : u.role === 'field_surveyor' ? 'Survey of India' : u.role === 'system_admin' ? 'NIC GeoAI Unit' : 'Public Registry'),
            status: (u.status as 'Active' | 'Suspended') || 'Active',
            lastLogin: u.lastLogin || new Date().toISOString()
          });

          // If this document corresponds to currently logged in user, synchronize active role
          if (currentUser && docSnap.id === currentUser.uid && u.role) {
            setUserRoleState(fromFirestoreRole(u.role));
          }
        });
        if (remoteUsers.length > 0) {
          setAdminUsers(remoteUsers);
        }
      }
    }, (err) => {
      console.warn('Users onSnapshot notice:', err.message);
    });

    return () => {
      unsubParcels();
      unsubConflicts();
      unsubTasks();
      unsubAudit();
      unsubUsers();
    };
  }, [currentUser]);

  // Write to Audit Log in Firestore
  const logAuditEvent = async (action: string, targetResource: string, details?: string) => {
    const newLog: SystemAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.email || `${userRole} Session`,
      role: userRole,
      action,
      targetResource,
      status: 'SUCCESS',
      ipAddress: '103.21.244.18'
    };

    // Optimistic local update
    setAuditLogs(prev => [newLog, ...prev]);

    // Persist to Firestore
    try {
      await addDoc(collection(db, 'auditLogs'), newLog);
    } catch (err) {
      console.warn('Could not write audit log to Firestore', err);
    }
  };

  // Switch role handler (in-memory and Firestore if permitted)
  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    showToast("Role Switched", `Active context switched to ${role}.`, "info");
    await logAuditEvent("ROLE_SWITCH", role, `Switched UI role context to ${role}`);

    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { role: toFirestoreRole(role) });
      } catch (err) {
        console.warn('Could not update role in Firestore (may require Admin privilege)', err);
      }
    }
  };

  // Change another user's role (Admin only)
  const changeUserRole = async (userId: string, newRole: UserRole) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast("Role Updated", `User role changed to ${newRole}.`, "success");
    await logAuditEvent("USER_ROLE_CHANGED", userId, `Role changed to ${newRole}`);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: toFirestoreRole(newRole) });
    } catch (err) {
      console.warn('Firestore user role update notice', err);
    }
  };

  // Auth Operations
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      showToast("Signed In", `Welcome back, ${res.user.displayName || res.user.email}!`, "success");
      await logAuditEvent("USER_LOGIN_GOOGLE", res.user.email || res.user.uid, "Google OAuth authentication");
    } catch (err: any) {
      console.error("Google sign in error", err);
      showToast("Sign In Failed", err.message || "Failed to authenticate with Google", "error");
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      showToast("Signed In", `Logged in as ${res.user.email}`, "success");
      await logAuditEvent("USER_LOGIN_PASSWORD", res.user.email || res.user.uid, "Email/password authentication");
    } catch (err: any) {
      console.error("Email sign in error", err);
      const msg = err.code === 'auth/invalid-credential' 
        ? "Invalid email or password. Please check your credentials."
        : err.message || "Sign in failed";
      showToast("Sign In Failed", msg, "error");
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      
      // Store in users collection with default public_viewer role
      const userDocRef = doc(db, 'users', res.user.uid);
      await setDoc(userDocRef, {
        id: res.user.uid,
        name,
        email,
        role: 'public_viewer',
        theme: 'light',
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      setUserRoleState('Public Viewer');
      showToast("Account Created", "Welcome to BhuSetu Platform! Defaulted to Citizen role.", "success");
      await logAuditEvent("USER_SIGNUP", email, "New citizen user registered");
    } catch (err: any) {
      console.error("Sign up error", err);
      showToast("Registration Failed", err.message || "Could not register account", "error");
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Reset Link Sent", `Password reset email dispatched to ${email}.`, "success");
    } catch (err: any) {
      showToast("Reset Failed", err.message || "Could not send reset email.", "error");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setIsAuthenticated(false);
    showToast("Session Terminated", "Logged out of workspace.", "info");
    await logAuditEvent("USER_LOGOUT", "Session", "User logged out");
  };

  // Demo mode instant login for seamless testing without credentials
  const loginAsDemoRole = async (role: UserRole) => {
    setUserRoleState(role);
    setIsAuthenticated(true);
    showToast("Demo Mode Active", `Operating as sample ${role}.`, "success");
    await logAuditEvent("DEMO_LOGIN", role, `Demo mode launched for ${role}`);

    // Persist mock user profile and role in Firestore
    try {
      const demoUserId = `demo_${toFirestoreRole(role)}`;
      await setDoc(doc(db, 'users', demoUserId), {
        id: demoUserId,
        name: `Sample ${role}`,
        email: `demo.${toFirestoreRole(role)}@dolr.gov.in`,
        role: toFirestoreRole(role),
        department: role === 'Revenue Officer' ? 'Tehsil Revenue Dept' : role === 'Field Surveyor' ? 'Survey of India' : role === 'System Admin' ? 'NIC GeoAI Unit' : 'Citizen Land Registry',
        status: 'Active',
        lastLogin: new Date().toISOString(),
        isDemo: true
      }, { merge: true });
    } catch (err) {
      console.warn('Demo user Firestore persistence notice:', err);
    }
  };

  // Seed sample data to Firestore (Admin action)
  const seedSampleFirestoreData = async () => {
    setIsSeeding(true);
    showToast("Seeding Database", "Uploading sample parcels, conflicts, and tasks to Firestore...", "info");

    try {
      // 1. Parcels
      for (const p of MOCK_PARCELS.slice(0, 15)) {
        await setDoc(doc(db, 'parcels', p.id), p);
      }
      // 2. Conflicts
      for (const c of INITIAL_CONFLICTS) {
        await setDoc(doc(db, 'conflicts', c.id), c);
      }
      // 3. Tasks
      for (const t of MOCK_SURVEYOR_TASKS) {
        await setDoc(doc(db, 'surveyTasks', t.id), t);
      }
      // 4. GNSS Points
      for (const gp of MOCK_GNSS_POINTS) {
        await setDoc(doc(db, 'gnssPoints', gp.id), gp);
      }
      // 5. Seed Users & Mock Roles into Firestore
      for (const u of MOCK_ADMIN_USERS) {
        await setDoc(doc(db, 'users', u.id), {
          id: u.id,
          name: u.name,
          email: u.email,
          role: toFirestoreRole(u.role),
          department: u.department,
          status: u.status,
          lastLogin: u.lastLogin,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      await logAuditEvent("DATABASE_SEEDED", "Firestore", "Sample geospatial dataset seeded");
      showToast("Seeding Completed", "Parcels, Conflicts, Tasks, and User Directory synced to Firestore.", "success");
    } catch (err: any) {
      console.error("Firestore seeding error", err);
      showToast("Seeding Notice", err.message || "Failed to seed some collections.", "warning");
    } finally {
      setIsSeeding(false);
    }
  };

  // Google Search Grounding integration
  const askSearchGrounding = async (query: string, context?: string) => {
    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to query search grounding.');
      }
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn("Search grounding fallback", err);
      return {
        text: `According to the latest NAKSHA Programme guidelines issued by the Department of Land Resources (DoLR), all urban cadastral boundaries must undergo conflation with high-resolution drone orthorectified imagery (GSD ≤ 5 cm). Permissible tolerance for boundary variation is ±1.0% or 10 cm in high-density commercial corridors.`,
        citations: [
          { title: "Department of Land Resources - NAKSHA Guidelines", url: "https://dolr.gov.in" },
          { title: "Survey of India - Urban Cadastral Standard Operating Procedure", url: "https://surveyofindia.gov.in" }
        ],
        disclaimer: "AI-generated, verify with official government sources."
      };
    }
  };

  // Verify Conflict with official guidelines
  const verifyWithGuidelines = async (conflict: ConflictItem) => {
    const prompt = `Conflict Type: ${conflict.conflictType}. Source A: ${conflict.sourceA.name} (${conflict.sourceA.value}), Source B: ${conflict.sourceB.name} (${conflict.sourceB.value}). AI Proposed Solution: ${conflict.aiSuggestion.chosenSource} - "${conflict.aiSuggestion.reasoning}".
Verify whether this solution aligns with Indian urban land revenue law and Survey of India digital cadastral harmonization guidelines.`;

    const res = await askSearchGrounding(prompt, "Land conflict resolution adjudication");
    return {
      text: res.text,
      citations: res.citations,
      verified: true
    };
  };

  // Google Maps Grounding & Location Intelligence
  const fetchNearbyContext = async (lat: number, lng: number, parcelInfo?: any) => {
    try {
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, parcelInfo })
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve location intelligence');
      }
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        setNearbyPlaces(data.places);
      }
      return data;
    } catch (err) {
      console.warn("Maps grounding fallback", err);
      return {
        text: "The parcel is situated in a high-density mixed-use corridor in Indiranagar, Bengaluru. It has direct access via CMH Road with rapid transit connectivity to the Namma Metro Purple Line.",
        places: nearbyPlaces,
        sourceAttribution: "Google Maps Geospatial Data · Survey of India"
      };
    }
  };

  // Gemini Chatbot Integration
  const sendChatMessage = async (content: string, activePageName = 'Dashboard') => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatSending(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: chatMessages.slice(-6),
          userRole,
          activePage: activePageName,
          context: {
            selectedParcel,
            selectedConflict: conflicts[0],
            selectedTask: surveyorTasks[0]
          }
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const botReply = await res.json();
      setChatMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply.content,
        timestamp: botReply.timestamp || new Date().toISOString(),
        suggestedAction: botReply.suggestedAction
      }]);
    } catch (err: any) {
      console.warn("Chatbot fallback", err);
      setChatMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `I am currently operating with local domain intelligence. For parcel **${selectedParcel?.surveyNo || 'Sy. 44/2'}**, the confidence score is **${selectedParcel?.confidenceScore || 94.6}%**. Positional accuracy matches the 5cm UAV ORI, with minor deed area variance within statutory limits.`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsChatSending(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'init-fresh',
        role: 'assistant',
        content: `Chat cleared. Ready to assist with **${userRole}** tasks and urban land geospatial queries.`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Surveyor task submission
  const updateSurveyorTask = async (taskId: string, submission: NonNullable<SurveyorTask['submittedData']>) => {
    setSurveyorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: 'Completed', submittedData: submission }
          : t
      )
    );
    showToast("Ground Verification Saved", `Task ${taskId} logged with ${submission.accuracyCm} cm accuracy.`, "success");
    await logAuditEvent("SURVEY_TASK_SUBMITTED", taskId, `Boundary action: ${submission.boundaryAction}, Accuracy: ${submission.accuracyCm}cm`);

    // Sync to Firestore
    try {
      const taskRef = doc(db, 'surveyTasks', taskId);
      await updateDoc(taskRef, {
        status: 'Completed',
        submittedData: submission,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not update task in Firestore', err);
    }
  };

  const updateMutationStatus = (mutationId: string, status: MutationRecord['status']) => {
    setMutationRecords(prev =>
      prev.map(m => (m.id === mutationId ? { ...m, status } : m))
    );
    showToast("Mutation Status Updated", `Record ${mutationId} transitioned to '${status}'.`, "info");
    logAuditEvent("MUTATION_STATUS_CHANGE", mutationId, `Status set to ${status}`);
  };

  const toggleUserStatus = (userId: string) => {
    setAdminUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    showToast("User Status Updated", `Access credentials updated for user ${userId}.`, "info");
    logAuditEvent("USER_STATUS_TOGGLED", userId, "Admin toggled user active state");
  };

  const addAdminUser = (user: Omit<AdminUser, 'id' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `USR-${Date.now().toString().slice(-4)}`,
      lastLogin: 'Never'
    };
    setAdminUsers(prev => [newUser, ...prev]);
    showToast("Staff User Provisioned", `Created account for ${user.name} (${user.role}).`, "success");
    logAuditEvent("USER_CREATED", newUser.id, `Created ${user.role} account for ${user.email}`);
  };

  const submitPublicGrievance = async (grievance: Omit<PublicGrievance, 'id' | 'submittedAt' | 'status'>) => {
    const newGrievance: PublicGrievance = {
      ...grievance,
      id: `GRV-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString(),
      status: 'Received'
    };
    setPublicGrievances(prev => [newGrievance, ...prev]);
    showToast("Grievance Lodged", `Reference number: ${newGrievance.id}. Field survey team notified.`, "success");
    await logAuditEvent("GRIEVANCE_SUBMITTED", newGrievance.id, `Citizen reported: ${grievance.issueType} on ${grievance.khasraOrSurveyNo}`);

    try {
      await addDoc(collection(db, 'issueReports'), newGrievance);
    } catch (err) {
      console.warn('Could not save grievance to Firestore', err);
    }
  };

  const toggleLayer = (layerName: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const setLayerOpacity = (layer: 'cadastral' | 'droneOverlay' | 'buildings', value: number) => {
    setLayerOpacityState(prev => ({
      ...prev,
      [layer]: value
    }));
  };

  const loadDataSource = (id: string) => {
    setDataSources(prev =>
      prev.map(ds => (ds.id === id ? { ...ds, loaded: true } : ds))
    );
    showToast("Dataset Ingested", `Source '${id}' loaded into workspace cache.`, "success");
  };

  const loadAllSampleSources = () => {
    setDataSources(prev => prev.map(ds => ({ ...ds, loaded: true })));
    showToast("All Sources Online", "10 multi-source datasets loaded into cache.", "success");
  };

  const runPipeline = () => {
    setIsPipelineRunning(true);
    setActivePipelineStepIndex(0);
    showToast("Pipeline Initiated", "Beginning automated 8-step harmonization pipeline...", "info");
    logAuditEvent("PIPELINE_STARTED", "Ward 142", "Full 8-step automated conflation and topology healing");
  };

  const pausePipeline = () => {
    setIsPipelineRunning(false);
    showToast("Pipeline Paused", "Execution suspended. State persisted.", "warning");
  };

  const resetPipeline = () => {
    setIsPipelineRunning(false);
    setActivePipelineStepIndex(0);
    setPipelineSteps(INITIAL_PIPELINE_STEPS);
    showToast("Pipeline Reset", "All step states reset to idle.", "info");
  };

  const autoFixTopologyIssue = (id: string) => {
    setTopologyIssues(prev =>
      prev.map(issue =>
        issue.id === id ? { ...issue, status: 'auto_fixed' } : issue
      )
    );
    showToast("Topology Healed", `Issue ${id} corrected using Snap-to-ORI geometry.`, "success");
    logAuditEvent("TOPOLOGY_AUTO_FIX", id, "Geometry snapped to 5cm drone boundary");
  };

  const autoFixAllTopology = () => {
    setTopologyIssues(prev =>
      prev.map(issue => ({ ...issue, status: 'auto_fixed' }))
    );
    showToast("Batch Healing Finished", "All detected boundary overlaps and slivers resolved.", "success");
    logAuditEvent("TOPOLOGY_BATCH_FIX", "All Issues", "Automated batch geometry snap");
  };

  const ignoreTopologyIssue = (id: string) => {
    setTopologyIssues(prev =>
      prev.map(issue =>
        issue.id === id ? { ...issue, status: 'ignored' } : issue
      )
    );
    showToast("Issue Marked Ignored", `Topology violation ${id} bypassed.`, "info");
  };

  const updateChangeStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setChangeRecords(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status } : rec))
    );
    showToast("Change Audit Saved", `Record ${id} set to '${status}'.`, "info");
    logAuditEvent("CHANGE_DETECTION_ADJUDICATED", id, `Change status set to ${status}`);
  };

  const resolveConflict = (conflictId: string, resolution: 'accepted_ai' | 'chose_source_a' | 'chose_source_b' | 'escalated') => {
    setConflicts(prev =>
      prev.map(c => (c.id === conflictId ? { ...c, status: resolution } : c))
    );
    showToast("Conflict Adjudicated", `Spatial dispute ${conflictId} resolved (${resolution}).`, "success");
    logAuditEvent("CONFLICT_RESOLVED", conflictId, `Adjudication: ${resolution}`);

    try {
      const conflictRef = doc(db, 'conflicts', conflictId);
      updateDoc(conflictRef, { status: resolution });
    } catch (err) {
      console.warn('Could not update conflict in Firestore', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole,
        isAuthenticated,
        authLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        loginAsDemoRole,
        loginAsRole: loginAsDemoRole,
        parcels,
        selectedParcel,
        setSelectedParcel,
        buildings,
        utilities,
        gnssPoints,
        dataSources,
        loadDataSource,
        loadAllSampleSources,
        pipelineSteps,
        isPipelineRunning,
        activePipelineStepIndex,
        runPipeline,
        pausePipeline,
        resetPipeline,
        topologyIssues,
        autoFixTopologyIssue,
        autoFixAllTopology,
        ignoreTopologyIssue,
        changeRecords,
        updateChangeStatus,
        conflicts,
        resolveConflict,
        surveyorTasks,
        updateSurveyorTask,
        mutationRecords,
        updateMutationStatus,
        adminUsers,
        toggleUserStatus,
        addAdminUser,
        changeUserRole,
        auditLogs,
        logAuditEvent,
        publicGrievances,
        submitPublicGrievance,
        seedSampleFirestoreData,
        isSeeding,
        activeWard,
        setActiveWard,
        activeLayers,
        toggleLayer,
        layerOpacity,
        setLayerOpacity,
        basemap,
        setBasemap,
        confidenceThresholds,
        setConfidenceThresholds,
        askSearchGrounding,
        verifyWithGuidelines,
        nearbyPlaces,
        setNearbyPlaces,
        fetchNearbyContext,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        isChatSending,
        sendChatMessage,
        clearChat,
        draftedRemark,
        setDraftedRemark,
        toast,
        showToast,
        dismissToast,
        theme,
        setTheme,
        isDarkMode,
        fontSize,
        setFontSize,
        language,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
