import React from 'react';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RestrictedAccessViewProps {
  requiredRole?: string;
  onBackToDashboard: () => void;
}

export const RestrictedAccessView: React.FC<RestrictedAccessViewProps> = ({
  requiredRole = 'System Administrator or Authorized Personnel',
  onBackToDashboard
}) => {
  const { userRole, setUserRole } = useApp();

  return (
    <div className="p-8 max-w-xl mx-auto my-12 text-center bg-white dark:bg-[#1A1D21] rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xs">
      <div className="w-12 h-12 rounded-[2px] bg-[#E9ECF0] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] text-[#C99A3C] flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>

      <h2 className="text-lg font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
        Access Restricted · Authorization Required
      </h2>
      <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-2 leading-relaxed max-w-md mx-auto">
        Your current session role (<strong className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{userRole}</strong>) is not authorized to access this module under departmental governance rules. Required authorization: <span className="font-semibold text-[#1F4E8C] dark:text-[#7FB0E8]">{requiredRole}</span>.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="h-10 px-4 text-xs font-semibold rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to {userRole} Dashboard</span>
        </button>

        <button
          onClick={() => setUserRole('System Admin')}
          className="h-10 px-4 text-xs font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Switch to System Admin (Demo)</span>
        </button>
      </div>
    </div>
  );
};
