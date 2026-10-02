import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const policyContent: Record<string, string> = {
    'Website Policies': 'This portal is designed, developed and hosted by the National Land Records Modernization Programme (DoLR/NIC). The contents on this website are for information purposes only, enabling the public and authorized revenue staff to access integrated cadastral and registration records.',
    'Accessibility Statement': 'We are committed to ensuring that the BhuSetu portal is accessible to all users irrespective of device, technology or ability. It complies with World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and Government of India Guidelines for Indian Government Websites (GIGW 3.0).',
    'Terms and Conditions': 'This website is maintained for official revenue harmonization workflows under the NAKSHA programme. Materials featured on this site may not be reproduced without prior authorization from the Department of Land Resources.',
    'Privacy Policy': 'As a general rule, this portal does not automatically collect personal information. Access logs and audit trails are recorded solely for verification, integrity checking, and system security as required by statutory land administration rules.',
    'Help': 'For queries regarding cadastral record ingestion, CORS RTK rover connectivity, or deed mutation arbitrations, please contact your respective District Tehsil Collectorate or submit a ticket through the Help Desk.',
    'Contact Us': 'Department of Land Resources, Ministry of Rural Development, NBO Building, Nirman Bhawan, New Delhi - 110011. Email: support-bhusetu@gov.in | Phone: 011-23062456',
    'Sitemap': 'Portal Navigation Index:\n• Revenue Administration (Mutation Tracking, Dispute Arbitration, Deed Gazette)\n• Field GNSS Rover (CORS Base RTK, Cadastral Ground Truthing, GCP Survey)\n• System Administration (8-Stage GeoAI Harmonization, Ingestion Streams, ISO 19157)\n• Citizen Open Land Registry (Khasra/Survey Search, Public Grievance Filing)'
  };

  return (
    <>
      <footer className="w-full bg-[#E9ECF0] dark:bg-[#1A1D21] border-t border-[#D5D9DE] dark:border-[#2F343A] text-xs text-[#4A5568] dark:text-[#AEB4BB] mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-4">
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] border-b border-[#D5D9DE] dark:border-[#2F343A] pb-4">
            {Object.keys(policyContent).map((link) => (
              <button
                key={link}
                onClick={() => setModalTitle(link)}
                className="text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline font-medium cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Official Attribution & Disclaimers */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-[12px] leading-relaxed">
            <div className="space-y-1">
              <p className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                Content owned, updated and maintained by Department of Land Resources, Ministry of Rural Development, Government of India
              </p>
              <p className="text-[#718096] dark:text-[#7D858E]">
                Designed, developed and hosted by National Informatics Centre (NIC) · Compliant with GIGW 3.0 & WCAG 2.1 Level AA
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-x-4 gap-y-1 text-[#718096] dark:text-[#7D858E] text-[11px] whitespace-nowrap">
              <span>Last updated: 02 October 2026</span>
              <span className="hidden sm:inline" aria-hidden="true">|</span>
              <span>Portal Version: 2.4.0 (National Release)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy / Statement Modal */}
      {modalTitle && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalTitle(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-dialog-title"
        >
          <div 
            className="bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-6 max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#D5D9DE] dark:border-[#2F343A] pb-3 mb-4">
              <h3 id="footer-dialog-title" className="text-base font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                {modalTitle}
              </h3>
              <button
                onClick={() => setModalTitle(null)}
                className="p-1 text-[#718096] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="text-[13px] text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed whitespace-pre-line">
              {policyContent[modalTitle]}
            </div>
            <div className="mt-6 pt-3 border-t border-[#D5D9DE] dark:border-[#2F343A] flex justify-end">
              <button
                onClick={() => setModalTitle(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white rounded-[4px] hover:opacity-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
