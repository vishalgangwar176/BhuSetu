import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Scale, 
  ExternalLink, 
  CheckCircle2, 
  Landmark,
  ChevronRight,
  Info
} from 'lucide-react';

export const SettingsAboutPage: React.FC = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
      {/* Breadcrumb & Page Header */}
      <div className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-4">
        <div className="flex items-center gap-1.5 text-[13px] text-[#5A626A] dark:text-[#AEB4BB] mb-1.5">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Statutory Administration</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1B1F23] dark:text-[#E8EAED] font-medium">Standards & Architecture</span>
        </div>
        <h1 className="text-[24px] font-semibold text-[#1B1F23] dark:text-[#E8EAED] tracking-tight">
          Statutory Framework & Technical Compliance
        </h1>
        <p className="text-[14px] text-[#5A626A] dark:text-[#AEB4BB] mt-1">
          Governance architecture, standards compliance, and institutional references for BhuSetu National Land Records Integration Platform.
        </p>
      </div>

      {/* Official Notice */}
      <div className="border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21] p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1F4E8C] dark:text-[#7FB0E8] mt-0.5 shrink-0" />
        <div className="text-[13px] text-[#5A626A] dark:text-[#AEB4BB] leading-relaxed">
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Official Notice: </span>
          BhuSetu operates under the mandate of the Digital India Land Records Modernization Programme (DILRMP), Ministry of Rural Development, Government of India. All cadastral reconciliations conform strictly to the standard operating procedures issued under state Land Revenue Codes and Survey Manuals.
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institutional Stakeholders */}
        <div className="border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21]">
          <div className="px-5 py-4 border-b border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Institutional Stakeholders</h2>
            <Landmark className="w-4 h-4 text-[#5A626A] dark:text-[#AEB4BB]" />
          </div>
          <div className="p-5 space-y-4">
            {[
              {
                org: 'Department of Land Resources (DoLR)',
                role: 'Nodal Department & Programme Authority',
                ministry: 'Ministry of Rural Development, Government of India',
                scope: 'Overall policy direction, funding allocation, and inter-state coordination under DILRMP.'
              },
              {
                org: 'Survey of India (SoI)',
                role: 'National Mapping Agency',
                ministry: 'Ministry of Science & Technology, Government of India',
                scope: 'CORS baseline infrastructure, drone-based aerial orthomosaics, and geodetic coordinate standards.'
              },
              {
                org: 'National Informatics Centre (NIC)',
                role: 'Technical & Platform Architecture',
                ministry: 'Ministry of Electronics & Information Technology',
                scope: 'Central portal hosting, database replication, and national interoperability microservices.'
              },
              {
                org: 'State Revenue & Survey Departments',
                role: 'Executing Agencies & Statutory Custodians',
                ministry: 'Respective State Governments & Union Territories',
                scope: 'Record-of-Rights (RoR) maintenance, tehsildar adjudication, and ground-truthing.'
              }
            ].map((s, idx) => (
              <div key={idx} className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[14px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{s.org}</h3>
                  <span className="text-[11px] px-2 py-0.5 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#5A626A] dark:text-[#AEB4BB]">
                    {s.role}
                  </span>
                </div>
                <div className="text-[12px] text-[#1F4E8C] dark:text-[#7FB0E8] mt-0.5">{s.ministry}</div>
                <p className="text-[13px] text-[#5A626A] dark:text-[#AEB4BB] mt-1.5 leading-relaxed">{s.scope}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Standards & Protocols */}
        <div className="border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21]">
          <div className="px-5 py-4 border-b border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Technical Standards Compliance</h2>
            <ShieldCheck className="w-4 h-4 text-[#5A626A] dark:text-[#AEB4BB]" />
          </div>
          <div className="p-5 space-y-4">
            {[
              {
                standard: 'OGC Simple Features & WFS 2.0.2',
                body: 'Open Geospatial Consortium (OGC)',
                desc: 'Strict vector topology serialization, parcel multi-polygon encoding, and spatial query interchange standard.'
              },
              {
                standard: 'EPSG:4326 (WGS 84) & EPSG:3857',
                body: 'International Association of Oil & Gas Producers',
                desc: 'Universal coordinate reference systems for cadastral boundary interchange and web tile rendering.'
              },
              {
                standard: 'ISO 19157:2013 Geographic Quality',
                body: 'International Organization for Standardization',
                desc: 'Rigorous data quality evaluation framework covering positional accuracy, topological consistency, and completeness.'
              },
              {
                standard: 'GIGW 3.0 (Government of India Guidelines for Websites)',
                body: 'Department of Administrative Reforms and Public Grievances',
                desc: 'Mandatory accessibility (WCAG 2.1 AA), responsive architecture, high-contrast usability, and bilingual support.'
              }
            ].map((t, idx) => (
              <div key={idx} className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[14px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{t.standard}</h3>
                  <span className="text-[11px] text-[#4FA37A] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Certified
                  </span>
                </div>
                <div className="text-[12px] text-[#5A626A] dark:text-[#7D858E] mt-0.5">{t.body}</div>
                <p className="text-[13px] text-[#5A626A] dark:text-[#AEB4BB] mt-1.5 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statutory References */}
      <div className="border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#1A1D21]">
        <div className="px-5 py-4 border-b border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">Applicable Acts & Guidelines</h2>
          <Scale className="w-4 h-4 text-[#5A626A] dark:text-[#AEB4BB]" />
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Registration Act, 1908 (Section 21 & 22)',
              sub: 'Description of land and maps',
              desc: 'Mandates accurate boundary descriptions and cadastral map references during property conveyances.'
            },
            {
              title: 'Indian Evidence Act, 1872 (Section 83)',
              sub: 'Presumption as to maps',
              desc: 'Evidentiary presumption of accuracy for maps made by the authority of the Central or State Government.'
            },
            {
              title: 'Survey and Boundaries Acts (State Acts)',
              sub: 'Statutory boundary demarcations',
              desc: 'Legal procedure for determination of village boundaries, dispute settlement, and final notification in State Gazette.'
            }
          ].map((act, idx) => (
            <div key={idx} className="border border-[#D5D9DE] dark:border-[#2F343A] p-4 bg-[#F4F5F7]/30 dark:bg-[#121417]/50">
              <h3 className="text-[14px] font-semibold text-[#1B1F23] dark:text-[#E8EAED]">{act.title}</h3>
              <div className="text-[12px] text-[#1F4E8C] dark:text-[#7FB0E8] mt-0.5">{act.sub}</div>
              <p className="text-[13px] text-[#5A626A] dark:text-[#AEB4BB] mt-2 leading-relaxed">{act.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5A626A] dark:text-[#AEB4BB]">
        <div>
          Platform Version: <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">BhuSetu v2.4.0-GOI</span> | Release Date: 2026-03-15
        </div>
        <div>
          Hosting: National Informatics Centre Data Centre, New Delhi
        </div>
      </div>
    </div>
  );
};
