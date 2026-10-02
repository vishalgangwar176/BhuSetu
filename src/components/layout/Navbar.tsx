import React, { useState } from 'react';
import { useApp, ThemeMode } from '../../context/AppContext';
import { 
  ChevronDown, 
  LogOut, 
  Check, 
  HelpCircle,
  Building2,
  FileCheck2,
  Compass,
  Settings,
  Eye,
  User,
  Bell
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentViewTitle: string;
  onOpenPipeline?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentViewTitle }) => {
  const { 
    currentUser,
    userRole, 
    setUserRole, 
    theme, 
    setTheme,
    isDarkMode,
    fontSize,
    setFontSize,
    language,
    setLanguage,
    logout,
    showToast
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const roles: { role: UserRole; title: string; dept: string; icon: any }[] = [
    {
      role: 'Revenue Officer',
      title: 'Revenue Officer',
      dept: 'Tehsil Land Revenue Administration',
      icon: FileCheck2
    },
    {
      role: 'Field Surveyor',
      title: 'Field Surveyor',
      dept: 'Survey of India / Ground Truthing',
      icon: Compass
    },
    {
      role: 'System Admin',
      title: 'System Administrator',
      dept: 'NIC GeoAI Computing Unit',
      icon: Settings
    },
    {
      role: 'Public Viewer',
      title: 'Citizen / Public Viewer',
      dept: 'Public Open Land Registry',
      icon: Eye
    }
  ];

  const handleScreenReaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      "Screen Reader Access",
      "This portal conforms to W3C WCAG 2.1 AA standards and is optimized for NVDA, JAWS, and VoiceOver.",
      "info"
    );
  };

  return (
    <header className="w-full select-none z-50 transition-colors duration-150 relative">
      {/* Skip to Main Content Link (GIGW Required, accessible first focusable element) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-1 focus:left-3 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-[#C9A24B] focus:text-black focus:font-semibold focus:text-xs focus:rounded-[2px]"
      >
        Skip to main content
      </a>

      {/* Tier 1: Thin Official Utility Strip (32px) */}
      <div className="h-8 bg-[#E9ECF0] dark:bg-[#22262B] border-b border-[#D5D9DE] dark:border-[#2F343A] text-xs px-4 sm:px-6 flex items-center justify-between text-[#4A5568] dark:text-[#AEB4BB]">
        {/* Left: Official State Branding */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
            Government of India
          </span>
          <span className="text-[#D5D9DE] dark:text-[#2F343A]" aria-hidden="true">|</span>
          <span className="hidden md:inline truncate max-w-sm">
            Ministry of Rural Development · Department of Land Resources
          </span>
        </div>

        {/* Right: Accessibility & Preferences */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Screen Reader Access */}
          <button 
            onClick={handleScreenReaderClick}
            className="hidden lg:inline hover:underline hover:text-[#1B1F23] dark:hover:text-[#E8EAED] cursor-pointer"
            title="Screen Reader Access information"
          >
            Screen Reader Access
          </button>
          <span className="hidden lg:inline text-[#D5D9DE] dark:text-[#2F343A]" aria-hidden="true">|</span>

          {/* Text Size Scaler */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#718096] dark:text-[#7D858E] hidden sm:inline mr-0.5">Text:</span>
            <button
              onClick={() => setFontSize('small')}
              className={`px-1.5 py-0.5 rounded-[2px] font-semibold text-[11px] transition-colors cursor-pointer ${
                fontSize === 'small' 
                  ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white' 
                  : 'hover:bg-[#D5D9DE] dark:hover:bg-[#2F343A] text-[#1B1F23] dark:text-[#E8EAED]'
              }`}
              title="Decrease text size (90%)"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded-[2px] font-semibold text-[11px] transition-colors cursor-pointer ${
                fontSize === 'normal' 
                  ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white' 
                  : 'hover:bg-[#D5D9DE] dark:hover:bg-[#2F343A] text-[#1B1F23] dark:text-[#E8EAED]'
              }`}
              title="Normal text size (100%)"
              aria-label="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded-[2px] font-semibold text-[11px] transition-colors cursor-pointer ${
                fontSize === 'large' 
                  ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white' 
                  : 'hover:bg-[#D5D9DE] dark:hover:bg-[#2F343A] text-[#1B1F23] dark:text-[#E8EAED]'
              }`}
              title="Increase text size (115%)"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>
          <span className="text-[#D5D9DE] dark:text-[#2F343A]" aria-hidden="true">|</span>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="hover:underline font-medium text-[#1F4E8C] dark:text-[#7FB0E8] cursor-pointer"
            title="Switch Language"
          >
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <span className="text-[#D5D9DE] dark:text-[#2F343A]" aria-hidden="true">|</span>

          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1 hover:text-[#1B1F23] dark:hover:text-[#E8EAED] cursor-pointer font-medium"
              title="Theme Selection"
              aria-expanded={showThemeMenu}
            >
              <span>{theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}</span>
              <ChevronDown className="w-3 h-3 text-[#718096] dark:text-[#7D858E]" />
            </button>

            {showThemeMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-md p-1 z-50 text-xs"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                {(['light', 'dark', 'system'] as ThemeMode[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] capitalize transition-colors text-left cursor-pointer ${
                      theme === t
                        ? 'bg-[#E9ECF0] dark:bg-[#1A1D21] font-semibold text-[#1B1F23] dark:text-[#E8EAED]'
                        : 'text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#1A1D21]'
                    }`}
                  >
                    <span>{t === 'system' ? 'System Auto' : t}</span>
                    {theme === t && <Check className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#3F7CC4]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tricolour-style muted accent strip */}
      <div className="h-[3px] w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#D97706]/80 dark:bg-[#C99A3C]/70" />
        <div className="flex-1 bg-[#FFFFFF] dark:bg-[#AEB4BB]/40" />
        <div className="flex-1 bg-[#2E7D32]/80 dark:bg-[#4FA37A]/70" />
      </div>

      {/* Tier 2: Main Official Header (64px) */}
      <div className="h-16 px-4 sm:px-6 bg-white dark:bg-[#1A1D21] border-b border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-between">
        {/* Left: Neutral Emblem Placeholder & Platform Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Neutral official emblem placeholder (no drawing of the national emblem) */}
          <div 
            className="w-10 h-10 rounded-[4px] bg-[#E9ECF0] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center text-[#1F4E8C] dark:text-[#7FB0E8] shrink-0"
            title="National Land Records Node"
          >
            <Building2 className="w-5 h-5 text-[#1F4E8C] dark:text-[#7FB0E8]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#1B1F23] dark:text-[#E8EAED] leading-none">
                BhuSetu
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#4A5568] dark:text-[#AEB4BB] rounded-[2px] font-normal">
                NAKSHA
              </span>
            </div>
            <p className="text-[12px] text-[#718096] dark:text-[#7D858E] leading-tight truncate mt-0.5">
              National Land Records Integration Platform · DoLR
            </p>
          </div>
        </div>

        {/* Right: User Menu & Clean Role Switcher Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Notifications button */}
          <button
            onClick={() => showToast("Department Notifications", "3 statutory notices pending review.", "info")}
            className="w-9 h-9 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] flex items-center justify-center text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED] relative transition-colors cursor-pointer"
            aria-label="View notifications"
            title="Statutory Notifications (3)"
          >
            <Bell className="w-4 h-4 text-[#718096] dark:text-[#AEB4BB]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-[2px] bg-[#C4584F] text-white text-[10px] font-bold flex items-center justify-center leading-none">
              3
            </span>
          </button>

          {/* Clean User & Role Trigger Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-left hover:border-[#1F4E8C] dark:hover:border-[#3F7CC4] transition-colors cursor-pointer"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="w-7 h-7 rounded-[2px] bg-[#E9ECF0] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center text-[#4A5568] dark:text-[#AEB4BB]">
                <User className="w-4 h-4 text-[#718096] dark:text-[#AEB4BB]" />
              </div>
              <div className="hidden sm:block text-left pr-1">
                <span className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED] block leading-tight">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Official Staff'}
                </span>
                <span className="text-[11px] text-[#4A5568] dark:text-[#AEB4BB] block leading-tight font-medium">
                  {userRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#718096] dark:text-[#7D858E]" />
            </button>

            {/* Dropdown Menu (Strictly opens BELOW trigger, right-aligned, z-50, solid raised surface) */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-72 rounded-[4px] bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] shadow-xl p-3 z-50 text-xs animate-in fade-in duration-100">
                {/* Header Summary inside menu */}
                <div className="pb-2.5 mb-2 border-b border-[#D5D9DE] dark:border-[#2F343A]">
                  <p className="text-[11px] text-[#718096] dark:text-[#7D858E] font-medium">Active Account</p>
                  <p className="font-semibold text-sm text-[#1B1F23] dark:text-[#E8EAED] truncate">
                    {currentUser?.email || 'officer@nic.in'}
                  </p>
                  <p className="text-[11px] text-[#4FA37A] font-medium mt-0.5">
                    ● Department Verified Identity
                  </p>
                </div>

                {/* Role Switcher Section */}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-[#718096] dark:text-[#7D858E] px-1 mb-1">
                    Select Operating Persona
                  </p>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = userRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          setUserRole(r.role);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-[2px] text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#E9ECF0] dark:bg-[#1A1D21] border-l-2 border-[#1F4E8C] dark:border-[#3F7CC4] text-[#1B1F23] dark:text-[#E8EAED] font-semibold'
                            : 'text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#1A1D21]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#718096] dark:text-[#7D858E]" />
                          <div>
                            <span className="block leading-tight">{r.title}</span>
                            <span className="text-[10px] text-[#718096] dark:text-[#7D858E] block leading-tight">{r.dept}</span>
                          </div>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#1F4E8C] dark:text-[#3F7CC4]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Sign Out Button */}
                <div className="mt-3 pt-2 border-t border-[#D5D9DE] dark:border-[#2F343A]">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#C62828] dark:text-[#C4584F] hover:bg-[#F4F5F7] dark:hover:bg-[#1A1D21] rounded-[2px] transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
