import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  UserPlus, 
  Database, 
  Activity, 
  FileText, 
  DownloadCloud, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Download
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    pipelineSteps, 
    runPipeline, 
    resetPipeline, 
    isPipelineRunning, 
    dataSources,
    adminUsers,
    toggleUserStatus,
    changeUserRole,
    addAdminUser,
    parcels,
    conflicts,
    topologyIssues,
    seedSampleFirestoreData,
    isSeeding,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'sources' | 'users' | 'rules'>('pipeline');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Revenue Officer');
  const [newUserDept, setNewUserDept] = useState<string>('');

  const activeTopologyCount = topologyIssues.filter(t => t.status === 'detected').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addAdminUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || 'Revenue Dept',
      status: 'Active'
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
    setShowAddUserModal(false);
  };

  const handleDownloadCSV = (datasetName: string) => {
    showToast("Export Dispatched", `Generating CSV export for ${datasetName}...`, "info");
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Official Header with Breadcrumb */}
      <div className="space-y-1.5 pb-3 border-b border-[#D5D9DE] dark:border-[#2F343A]">
        <nav className="text-xs text-[#718096] dark:text-[#7D858E] flex items-center gap-1.5" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="text-[#4A5568] dark:text-[#AEB4BB]">System Administration</span>
          <ChevronRight className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Core Engine</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              System Administration & Core Engine
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-0.5">
              Supervise 8-stage GeoAI harmonization pipelines, 10 data source streams, user permissions, and microservices health. (NIC MeghRaj Cloud)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={seedSampleFirestoreData}
              disabled={isSeeding}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Seed sample parcels, tasks, and conflicts to Cloud Firestore"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>{isSeeding ? 'Seeding Firestore...' : 'Seed Sample Data'}</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="h-10 px-3.5 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision User</span>
            </button>
            <button
              onClick={runPipeline}
              disabled={isPipelineRunning}
              className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isPipelineRunning ? 'Pipeline Running...' : 'Execute Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section: 5-column bordered summary strip */}
      <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] overflow-hidden shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D9DE] dark:divide-[#2F343A]">
          <div 
            onClick={() => setActiveTab('pipeline')}
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Active Pipeline</span>
              <Activity className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              8 Stages
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              {isPipelineRunning ? 'Executing stage...' : 'All stages ready'}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('sources')}
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Datasets Ingested</span>
              <Database className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              10 Sources
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              100% synchronized
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pipeline')}
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Spatial Discrepancies</span>
              <AlertTriangle className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {conflicts.length} Identified
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              In review / arbitration
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pipeline')}
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Topology Violations</span>
              <CheckCircle2 className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {activeTopologyCount} Detected
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              Planar rules auto-healed
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pipeline')}
            className="p-4 hover:bg-[#F4F5F7] dark:hover:bg-[#22262B] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[13px] text-[#4A5568] dark:text-[#AEB4BB]">
              <span>Harmonized Parcels</span>
              <Clock className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
            </div>
            <div className="text-[28px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] leading-tight my-1">
              {parcels.length} Records
            </div>
            <div className="text-[13px] text-[#718096] dark:text-[#7D858E]">
              82.5% quality benchmark
            </div>
          </div>
        </div>
      </div>

      {/* Flat Tabs */}
      <div className="flex items-center gap-1 border-b border-[#D5D9DE] dark:border-[#2F343A] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pipeline'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          Harmonization Pipeline (8 Stages)
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sources'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          Data Sources Health (10 Streams)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1F4E8C] dark:text-[#7FB0E8]'
              : 'border-transparent text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
          }`}
        >
          Users & Permissions Directory ({adminUsers.length})
        </button>
      </div>

      {/* Tab 1: Pipeline Execution */}
      {activeTab === 'pipeline' && (
        <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                8-Stage Geospatial Harmonization Pipeline
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                Sequential workflow for multi-source ingestion, planar topology healing, and ROR linkage
              </p>
            </div>
            <button
              onClick={resetPipeline}
              className="px-3 py-1.5 text-xs border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] rounded-[2px] cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pipeline</span>
            </button>
          </div>

          <div className="space-y-3">
            {pipelineSteps.map((step, idx) => (
              <div 
                key={step.id} 
                className="p-3 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-[2px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center font-bold text-[#1B1F23] dark:text-[#E8EAED]">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{step.name}</h3>
                    <p className="text-[11px] text-[#718096] dark:text-[#7D858E]">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <span className="text-[#4A5568] dark:text-[#AEB4BB]">{step.progress}%</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[2px] border ${
                    step.status === 'completed'
                      ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                      : step.status === 'running'
                      ? 'border-[#B78103]/40 text-[#B78103] dark:text-[#C99A3C]'
                      : 'border-[#718096]/40 text-[#718096] dark:text-[#7D858E]'
                  }`}>
                    {step.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sources Health */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataSources.map((ds) => (
            <div 
              key={ds.id} 
              className="p-4 rounded-[4px] bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#1F4E8C] dark:text-[#7FB0E8] font-semibold">{ds.id}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-[2px] border border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]">
                  Quality: {ds.qualityScore}%
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#1B1F23] dark:text-[#E8EAED]">{ds.name}</h3>
              <p className="text-[11px] text-[#718096] dark:text-[#7D858E]">{ds.crs}</p>
              <div className="pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A] flex justify-between text-[11px] text-[#718096] font-mono">
                <span>{ds.recordCount} Features</span>
                <span>{ds.fileSize}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Users and Permissions */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-xs">
          <div className="p-4 border-b border-[#D5D9DE] dark:border-[#2F343A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Active User Directory & Role Assignment
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#7D858E]">
                Assign role-based access control (RBAC) to Revenue Officers, Field Surveyors, and Staff
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadCSV('User_Directory')}
                className="px-2.5 py-1 text-xs border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] rounded-[2px] cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#E9ECF0] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] font-semibold border-b border-[#D5D9DE] dark:border-[#2F343A]">
                <tr>
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D9DE] dark:divide-[#2F343A]">
                {adminUsers.map((user, idx) => (
                  <tr 
                    key={user.id}
                    className={`transition-colors ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-[#1A1D21]'
                        : 'bg-[#F8F9FA] dark:bg-[#1E2227]'
                    } hover:bg-[#E9ECF0] dark:hover:bg-[#22262B]`}
                  >
                    <td className="py-3 px-3 font-mono font-medium text-[#1F4E8C] dark:text-[#7FB0E8]">{user.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{user.name}</td>
                    <td className="py-3 px-3 font-mono text-[#718096] dark:text-[#AEB4BB]">{user.email}</td>
                    <td className="py-3 px-3 text-[#4A5568] dark:text-[#AEB4BB]">{user.department}</td>
                    <td className="py-3 px-3">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user.id, e.target.value as UserRole)}
                        className="py-1 px-2 rounded-[2px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#22262B] text-xs text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none"
                      >
                        <option value="Revenue Officer">Revenue Officer</option>
                        <option value="Field Surveyor">Field Surveyor</option>
                        <option value="System Admin">System Admin</option>
                        <option value="Public Viewer">Public Viewer</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded-[2px] border text-[11px] font-medium ${
                        user.status === 'Active'
                          ? 'border-[#2E7D32]/40 text-[#2E7D32] dark:text-[#4FA37A]'
                          : 'border-[#C4584F]/40 text-[#C62828] dark:text-[#C4584F]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="text-xs text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline cursor-pointer"
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal (max 6px radius) */}
      {showAddUserModal && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddUserModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-6 max-w-md w-full shadow-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
              Provision Platform Personnel
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Full Name <span className="text-[#C4584F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shri / Smt"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full h-10 px-3 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#1A1D21] rounded-[4px] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Official Email <span className="text-[#C4584F]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="officer@nic.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#1A1D21] rounded-[4px] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Assigned Operating Role <span className="text-[#C4584F]">*</span>
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full h-10 px-3 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#1A1D21] rounded-[4px] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                >
                  <option value="Revenue Officer">Revenue Officer</option>
                  <option value="Field Surveyor">Field Surveyor</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Public Viewer">Public Viewer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Department / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tehsil Revenue Administration"
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full h-10 px-3 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#1A1D21] rounded-[4px] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div className="pt-3 border-t border-[#D5D9DE] dark:border-[#2F343A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 border border-[#D5D9DE] dark:border-[#2F343A] rounded-[2px] text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#1A1D21] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold rounded-[2px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 cursor-pointer"
                >
                  Confirm & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
