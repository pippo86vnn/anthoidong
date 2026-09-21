import React from 'react';
import { TabType } from '../types';
import { 
  PenSquare, 
  ListChecks, 
  ShieldCheck, 
  PieChart, 
  Building2,
  CheckCircle2,
  Moon,
  Sun,
  Palette
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalCount: number;
  completedCount: number;
  themeColor: 'blue' | 'red';
  setThemeColor: (color: 'blue' | 'red') => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalCount,
  completedCount,
  themeColor,
  setThemeColor,
  isDarkMode,
  setIsDarkMode,
  isLoading
}) => {
  const isRed = themeColor === 'red';
  const headerBg = isRed 
    ? 'bg-gradient-to-r from-red-900 via-red-800 to-rose-900' 
    : 'bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900';
    
  const badgeBg = isRed ? 'bg-red-400/20 text-red-200 border-red-300/30' : 'bg-sky-400/20 text-sky-200 border-sky-300/30';

  return (
    <header className={`${headerBg} text-white shadow-xl`}>
      {/* Top Bar Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner shrink-0 overflow-hidden border-2 border-white/30">
              <img src="https://i.postimg.cc/6TMP7LP0/515442084-3904851699659325-724518109117710540-n.jpg" alt="Logo MTTQ Xã An Thới Đông" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeBg}`}>
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM XÃ AN THỚI ĐÔNG
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight mt-0.5 uppercase leading-snug">
                DASHBOARD ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM
                <br />
                XÃ AN THỚI ĐÔNG
              </h1>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 font-light">
                Hệ thống Quản lý Góp ý, Phản ảnh, Kiến nghị cho đoàn viên, hội viên và nhân dân
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Building2 className="w-4 h-4 text-white/80" />
                <span>8 Ấp</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-100 border border-emerald-400/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Tổng số sự việc: <strong>{totalCount}/8</strong></span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isLoading ? 'bg-amber-500/20 text-amber-100 border-amber-400/20' : 'bg-emerald-500/20 text-emerald-100 border-emerald-400/20'}`}>
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                <span>{isLoading ? 'Đang kết nối...' : 'Đã kết nối'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button 
                onClick={() => setThemeColor(isRed ? 'blue' : 'red')}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title="Đổi chế độ màu (Chuẩn / Hành chính)"
              >
                <Palette className="w-4 h-4 text-white" />
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title="Bật/tắt chế độ tối"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
              </button>
              <button 
                onClick={() => setActiveTab('admin_manage')}
                className="p-2 hover:bg-amber-500/20 hover:text-amber-300 rounded-lg transition flex items-center gap-2 text-xs font-semibold bg-white/5"
                title="Đăng nhập quản trị"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Quản trị</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b shadow-sm sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-1 no-scrollbar text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? (isRed ? 'border-red-600 text-red-600 bg-red-50/60' : 'border-emerald-600 text-emerald-600 bg-emerald-50/60') + (isDarkMode ? ' !bg-slate-800' : '') + ' rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-200' + (isDarkMode ? ' hover:text-slate-200' : '')
              }`}
            >
              <PieChart className={`w-4 h-4 ${activeTab === 'dashboard' ? (isRed ? 'text-red-600' : 'text-emerald-600') : ''}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('citizen_submit')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'citizen_submit'
                  ? (isRed ? 'border-red-600 text-red-600 bg-red-50/60' : 'border-sky-600 text-sky-600 bg-sky-50/60') + (isDarkMode ? ' !bg-slate-800' : '') + ' rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-200' + (isDarkMode ? ' hover:text-slate-200' : '')
              }`}
            >
              <PenSquare className={`w-4 h-4 ${activeTab === 'citizen_submit' ? (isRed ? 'text-red-600' : 'text-sky-600') : ''}`} />
              <span>Gửi Phản Ánh</span>
            </button>

            <button
              onClick={() => setActiveTab('public_list')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'public_list'
                  ? (isRed ? 'border-red-600 text-red-600 bg-red-50/60' : 'border-sky-600 text-sky-600 bg-sky-50/60') + (isDarkMode ? ' !bg-slate-800' : '') + ' rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-200' + (isDarkMode ? ' hover:text-slate-200' : '')
              }`}
            >
              <ListChecks className={`w-4 h-4 ${activeTab === 'public_list' ? (isRed ? 'text-red-600' : 'text-sky-600') : ''}`} />
              <span>Tra Cứu</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
