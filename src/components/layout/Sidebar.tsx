import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  GitMerge, 
  Map, 
  ShieldCheck, 
  History, 
  Scale, 
  Gauge, 
  Share2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavViewKey = 
  | 'dashboard'
  | 'sources'
  | 'pipeline'
  | 'map'
  | 'topology'
  | 'changes'
  | 'conflicts'
  | 'confidence'
  | 'output'
  | 'analytics'
  | 'settings'
  | 'mutations'
  | 'surveyor_tasks'
  | 'admin_users';

interface SidebarProps {
  activeView: NavViewKey;
  setActiveView: (view: NavViewKey) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed
}) => {
  const { conflicts, topologyIssues, userRole } = useApp();

  const unresolvedConflictsCount = conflicts.filter(c => c.status === 'unresolved').length;
  const activeTopologyCount = topologyIssues.filter(t => t.status === 'detected').length;

  // Custom navigation items per role
  const getNavItems = () => {
    if (userRole === 'Revenue Officer') {
      return [
        { key: 'dashboard' as NavViewKey, label: 'Revenue overview', icon: LayoutDashboard },
        { 
          key: 'conflicts' as NavViewKey, 
          label: 'Dispute arbitration', 
          icon: Scale, 
          count: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined
        },
        { key: 'map' as NavViewKey, label: 'Cadastral map workspace', icon: Map },
        { key: 'changes' as NavViewKey, label: 'Bi-temporal change audit', icon: History },
        { key: 'confidence' as NavViewKey, label: 'Accuracy & quality gating', icon: Gauge },
        { key: 'output' as NavViewKey, label: 'Gazette & statutory reports', icon: Share2 },
        { key: 'analytics' as NavViewKey, label: 'Turnaround benchmarks', icon: BarChart3 }
      ];
    }

    if (userRole === 'Field Surveyor') {
      return [
        { key: 'dashboard' as NavViewKey, label: 'Field requisitions & rover', icon: Compass },
        { key: 'map' as NavViewKey, label: 'Cadastral map workspace', icon: Map },
        { 
          key: 'topology' as NavViewKey, 
          label: 'Boundary geometry & planar rules', 
          icon: ShieldCheck,
          count: activeTopologyCount > 0 ? activeTopologyCount : undefined
        },
        { key: 'confidence' as NavViewKey, label: 'CORS RTK quality check', icon: Gauge },
        { key: 'output' as NavViewKey, label: 'Field sync & exports', icon: Share2 }
      ];
    }

    // Default System Admin: Full Suite
    return [
      { key: 'dashboard' as NavViewKey, label: 'System overview & engine', icon: LayoutDashboard },
      { key: 'sources' as NavViewKey, label: 'Data ingestion streams (10)', icon: UploadCloud },
      { key: 'pipeline' as NavViewKey, label: 'Harmonization pipeline', icon: GitMerge },
      { key: 'map' as NavViewKey, label: 'Cadastral map workspace', icon: Map },
      { 
        key: 'topology' as NavViewKey, 
        label: 'Topology & planar rules', 
        icon: ShieldCheck, 
        count: activeTopologyCount > 0 ? activeTopologyCount : undefined
      },
      { key: 'changes' as NavViewKey, label: 'Bi-temporal change detection', icon: History },
      { 
        key: 'conflicts' as NavViewKey, 
        label: 'Dispute arbitration center', 
        icon: Scale, 
        count: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined
      },
      { key: 'confidence' as NavViewKey, label: 'ISO 19157 quality scoring', icon: Gauge },
      { key: 'output' as NavViewKey, label: 'Interoperability & gazette sync', icon: Share2 },
      { key: 'analytics' as NavViewKey, label: 'Performance benchmarks', icon: BarChart3 },
      { key: 'settings' as NavViewKey, label: 'Architecture & documentation', icon: Settings }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside 
      className={`relative flex flex-col bg-white dark:bg-[#1A1D21] border-r border-[#D5D9DE] dark:border-[#2F343A] transition-all duration-150 z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-[240px]'
      }`}
      aria-label="Sidebar navigation"
    >
      {/* Sidebar Top: Collapse Toggle & Section Label */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B]">
        {!isCollapsed && (
          <span className="text-[12px] font-semibold text-[#4A5568] dark:text-[#AEB4BB]">
            Navigation menu
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] rounded-[2px] transition-colors cursor-pointer ml-auto"
          aria-label={isCollapsed ? "Expand navigation sidebar" : "Collapse navigation sidebar"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items list */}
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center h-11 px-3 text-left transition-colors cursor-pointer text-[14px] leading-tight ${
                isActive
                  ? 'border-l-[3px] border-[#1F4E8C] dark:border-[#3F7CC4] bg-[#EDF2F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] font-semibold'
                  : 'text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] border-l-[3px] border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Icon className="w-[18px] h-[18px] text-[#718096] dark:text-[#AEB4BB] shrink-0" aria-hidden="true" />
                {!isCollapsed && (
                  <span className="truncate flex-1">
                    {item.label}
                  </span>
                )}
              </div>

              {!isCollapsed && item.count !== undefined && item.count > 0 && (
                <span 
                  className="px-1.5 py-0.5 text-[11px] font-bold rounded-[2px] bg-[#C4584F] text-white shrink-0 ml-1.5"
                  title={`${item.count} items require action`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[11px] text-[#718096] dark:text-[#7D858E] leading-normal">
          <div className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
            Department of Land Resources
          </div>
          <div>MeghRaj Cloud Node · India</div>
        </div>
      )}
    </aside>
  );
};
