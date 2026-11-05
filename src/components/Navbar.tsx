import React from 'react';
import { ShieldCheck, BookOpen, User, Sparkles, Scale } from 'lucide-react';

interface NavbarProps {
  activeTab: 'evaluate' | 'criteria' | 'references' | 'profile';
  setActiveTab: (tab: 'evaluate' | 'criteria' | 'references' | 'profile') => void;
  studentName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, studentName }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('evaluate')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  FactCheck Veritas
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Đề tài Thực tập
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Hệ thống đánh giá độ tin cậy nguồn tin theo 6 tiêu chí chuẩn mực
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'evaluate'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Đánh giá nguồn tin</span>
            </button>

            <button
              onClick={() => setActiveTab('criteria')}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'criteria'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden md:inline">6 Tiêu chí & Hướng dẫn</span>
              <span className="md:hidden">Tiêu chí</span>
            </button>

            <button
              onClick={() => setActiveTab('references')}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'references'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Tài liệu tham khảo</span>
              <span className="md:hidden">Tài liệu</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">
                {studentName ? studentName.split(' ').slice(-1)[0] : 'Hồ sơ sinh viên'}
              </span>
              <span className="md:hidden">Sinh viên</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
