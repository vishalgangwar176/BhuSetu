/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavViewKey } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { RestrictedAccessView } from './components/common/RestrictedAccessView';
import { BhuSetuAssistant } from './components/chat/BhuSetuAssistant';

import { LoginView } from './pages/LoginView';
import { DashboardPage } from './pages/DashboardPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { PipelinePage } from './pages/PipelinePage';
import { MapWorkspacePage } from './pages/MapWorkspacePage';
import { TopologyPage } from './pages/TopologyPage';
import { ChangeDetectionPage } from './pages/ChangeDetectionPage';
import { ConflictCenterPage } from './pages/ConflictCenterPage';
import { ConfidenceScoringPage } from './pages/ConfidenceScoringPage';
import { OutputInteropPage } from './pages/OutputInteropPage';
import { AnalyticsImpactPage } from './pages/AnalyticsImpactPage';
import { SettingsAboutPage } from './pages/SettingsAboutPage';

// Distinct Role Dashboards & Pages
import { RevenueDashboard } from './pages/roles/RevenueDashboard';
import { SurveyorDashboard } from './pages/roles/SurveyorDashboard';
import { AdminDashboard } from './pages/roles/AdminDashboard';
import { PublicPortalPage } from './pages/roles/PublicPortalPage';

function AppContent() {
  const { isAuthenticated, userRole, isDarkMode } = useApp();
  const [activeView, setActiveView] = useState<NavViewKey>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [restrictedRouteRequirement, setRestrictedRouteRequirement] = useState<string | null>(null);

  // Sync active role with URL hash route
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncRouteFromHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!hash) {
        // Set default hash based on active persona
        const defaultHash = userRole === 'Revenue Officer' 
          ? '#/revenue' 
          : userRole === 'Field Surveyor' 
          ? '#/surveyor' 
          : userRole === 'System Admin' 
          ? '#/admin' 
          : '#/public';
        window.location.hash = defaultHash;
        setActiveView('dashboard');
        setRestrictedRouteRequirement(null);
        return;
      }

      // Check role route groups
      if (hash === 'revenue') {
        if (userRole === 'Revenue Officer' || userRole === 'System Admin') {
          setActiveView('dashboard');
          setRestrictedRouteRequirement(null);
        } else {
          setRestrictedRouteRequirement('Revenue Officer');
        }
      } else if (hash === 'surveyor') {
        if (userRole === 'Field Surveyor' || userRole === 'System Admin') {
          setActiveView('dashboard');
          setRestrictedRouteRequirement(null);
        } else {
          setRestrictedRouteRequirement('Field Surveyor');
        }
      } else if (hash === 'admin') {
        if (userRole === 'System Admin') {
          setActiveView('dashboard');
          setRestrictedRouteRequirement(null);
        } else {
          setRestrictedRouteRequirement('System Administrator');
        }
      } else if (hash === 'public') {
        setActiveView('dashboard');
        setRestrictedRouteRequirement(null);
      } else if (['sources', 'pipeline', 'map', 'topology', 'changes', 'conflicts', 'confidence', 'output', 'analytics', 'settings'].includes(hash)) {
        setActiveView(hash as NavViewKey);
        setRestrictedRouteRequirement(null);
      }
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, [isAuthenticated, userRole]);

  // When activeView changes, update hash if appropriate
  const handleViewChange = (view: NavViewKey) => {
    setActiveView(view);
    setRestrictedRouteRequirement(null);
    if (view === 'dashboard') {
      const defaultHash = userRole === 'Revenue Officer' 
        ? '#/revenue' 
        : userRole === 'Field Surveyor' 
        ? '#/surveyor' 
        : userRole === 'System Admin' 
        ? '#/admin' 
        : '#/public';
      window.location.hash = defaultHash;
    } else {
      window.location.hash = `#/${view}`;
    }
  };

  // If not logged in, show Login Role Gateway
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <Toast />
      </>
    );
  }

  // Handle route restriction
  if (restrictedRouteRequirement) {
    return (
      <div className={`min-h-screen bg-[#F4F5F7] dark:bg-[#121417] text-[#1B1F23] dark:text-[#E8EAED] flex flex-col justify-between transition-colors duration-150 ${isDarkMode ? 'dark' : ''}`}>
        <Navbar currentViewTitle="Access Verification" />
        <main id="main-content" className="flex-1 flex items-center justify-center p-6">
          <RestrictedAccessView 
            requiredRole={restrictedRouteRequirement} 
            onBackToDashboard={() => {
              setRestrictedRouteRequirement(null);
              const defaultHash = userRole === 'Revenue Officer' 
                ? '#/revenue' 
                : userRole === 'Field Surveyor' 
                ? '#/surveyor' 
                : userRole === 'System Admin' 
                ? '#/admin' 
                : '#/public';
              window.location.hash = defaultHash;
              setActiveView('dashboard');
            }} 
          />
        </main>
        <Footer />
        <Toast />
      </div>
    );
  }

  // Public Viewer has a specialized citizen-first portal without heavy sidebar
  if (userRole === 'Public Viewer') {
    return (
      <div className={`min-h-screen bg-[#F4F5F7] dark:bg-[#121417] text-[#1B1F23] dark:text-[#E8EAED] flex flex-col justify-between transition-colors duration-150 ${isDarkMode ? 'dark' : ''}`}>
        <Navbar currentViewTitle="Citizen Open Registry" />
        <main id="main-content" className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="flex-1">
            <PublicPortalPage />
          </div>
          <Footer />
        </main>
        <BhuSetuAssistant currentPageName="Citizen Registry" />
        <Toast />
      </div>
    );
  }

  // View Titles
  const viewTitles: Record<NavViewKey, string> = {
    dashboard: userRole === 'Revenue Officer' 
      ? 'Revenue Administration' 
      : userRole === 'Field Surveyor' 
      ? 'Field GNSS Rover' 
      : 'System Overview & Engine',
    sources: 'Multi-Source Data Ingestion',
    pipeline: 'Harmonization Pipeline',
    map: 'Interactive GIS Workspace',
    topology: 'Topology & Planar Rules',
    changes: 'Bi-Temporal Change Detection',
    conflicts: 'Dispute Arbitration Center',
    confidence: 'ISO 19157 Quality Scoring',
    output: 'Interoperability & Gazette Reports',
    analytics: 'Impact & Turnaround Benchmarks',
    settings: 'Platform Overview & Architecture',
    mutations: 'Mutation Tracker',
    surveyor_tasks: 'Assigned Field Tasks',
    admin_users: 'User & Permissions Management'
  };

  // Permission checks
  const isViewAuthorized = (view: NavViewKey): boolean => {
    if (userRole === 'System Admin') return true;

    if (userRole === 'Revenue Officer') {
      const allowedViews: NavViewKey[] = ['dashboard', 'conflicts', 'map', 'changes', 'confidence', 'output', 'analytics', 'mutations'];
      return allowedViews.includes(view);
    }

    if (userRole === 'Field Surveyor') {
      const allowedViews: NavViewKey[] = ['dashboard', 'map', 'topology', 'confidence', 'output', 'surveyor_tasks'];
      return allowedViews.includes(view);
    }

    return true;
  };

  const renderMainContent = () => {
    if (!isViewAuthorized(activeView)) {
      return (
        <RestrictedAccessView 
          requiredRole="System Administrator" 
          onBackToDashboard={() => handleViewChange('dashboard')} 
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        if (userRole === 'Revenue Officer') return <RevenueDashboard />;
        if (userRole === 'Field Surveyor') return <SurveyorDashboard />;
        return <AdminDashboard />;

      case 'sources':
        return <DataSourcesPage />;

      case 'pipeline':
        return <PipelinePage onNavigate={handleViewChange} />;

      case 'map':
        return <MapWorkspacePage />;

      case 'topology':
        return <TopologyPage />;

      case 'changes':
        return <ChangeDetectionPage />;

      case 'conflicts':
        return <ConflictCenterPage />;

      case 'confidence':
        return <ConfidenceScoringPage />;

      case 'output':
        return <OutputInteropPage />;

      case 'analytics':
        return <AnalyticsImpactPage />;

      case 'settings':
        return <SettingsAboutPage />;

      default:
        return <DashboardPage onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#F4F5F7] dark:bg-[#121417] text-[#1B1F23] dark:text-[#E8EAED] flex flex-col font-sans transition-colors duration-150 ${isDarkMode ? 'dark' : ''}`}>
      {/* Official Government Header */}
      <Navbar 
        currentViewTitle={viewTitles[activeView] || 'Workspace'} 
        onOpenPipeline={() => handleViewChange('pipeline')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Flat Official Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={handleViewChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Content Viewport with Official Footer */}
        <main id="main-content" className="flex-1 overflow-y-auto bg-[#F4F5F7] dark:bg-[#121417] flex flex-col justify-between">
          <div className="flex-1">
            {renderMainContent()}
          </div>
          <Footer />

          {/* Official Gazette Bottom Print Authentication Strip (Only on print) */}
          <div className="official-print-footer print-only hidden">
            <span>BhuSetu National Cadastral Platform · Department of Land Resources, Ministry of Rural Development, Government of India · Page Verified</span>
          </div>
        </main>
      </div>

      {/* Official Help Assistant */}
      <BhuSetuAssistant currentPageName={viewTitles[activeView] || 'Workspace'} />

      {/* Global Notifications Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
