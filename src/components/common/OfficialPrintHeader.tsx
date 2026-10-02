import React from 'react';
import { useApp } from '../../context/AppContext';

interface OfficialPrintHeaderProps {
  reportTitle?: string;
  subTitle?: string;
  departmentName?: string;
  gazetteRef?: string;
}

export const OfficialPrintHeader: React.FC<OfficialPrintHeaderProps> = ({
  reportTitle = 'Cadastral & Revenue Harmonization Report',
  subTitle = 'National Land Records Modernization Programme (NAKSHA / DILRMP)',
  departmentName = 'Department of Land Resources · Ministry of Rural Development',
  gazetteRef
}) => {
  const { userRole, activeWard } = useApp();
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="print-only hidden mb-6 pb-4 border-b-2 border-black text-black">
      {/* Top Official National Header */}
      <div className="text-center space-y-1">
        <div className="text-[12pt] font-serif font-bold uppercase tracking-wider">
          Government of India
        </div>
        <div className="text-[10pt] font-serif font-semibold">
          {departmentName}
        </div>
        <div className="text-[9pt] italic">
          BhuSetu National Geospatial & Cadastral Integration Platform
        </div>
      </div>

      <div className="my-2 border-t border-double border-black pt-2 text-center">
        <h1 className="text-[13pt] font-bold uppercase tracking-normal">
          {reportTitle}
        </h1>
        <p className="text-[9pt] font-medium text-gray-700">
          {subTitle}
        </p>
      </div>

      {/* Meta Strip */}
      <div className="mt-3 pt-2 border-t border-dashed border-gray-400 grid grid-cols-4 text-[8.5pt]">
        <div>
          <span className="font-bold">Jurisdiction: </span>
          <span>{activeWard || 'Ward 142 (Urban Tehsil)'}</span>
        </div>
        <div>
          <span className="font-bold">Certified Role: </span>
          <span>{userRole}</span>
        </div>
        <div>
          <span className="font-bold">Date & Time: </span>
          <span>{currentDate}, {currentTime}</span>
        </div>
        <div className="text-right">
          <span className="font-bold">Ref No: </span>
          <span className="font-mono">{gazetteRef || `BHU-REV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`}</span>
        </div>
      </div>
    </div>
  );
};
