import React, { useState } from 'react';
import { REAL_REFERENCES } from '../data/constants';
import { BookOpen, ExternalLink, ShieldCheck, Filter, Search, Award } from 'lucide-react';

export const ReferencesSection: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const types = ['all', 'Học thuật', 'Báo chí & Kiểm chứng', 'Tiêu chuẩn quốc tế', 'Quy chuẩn Việt Nam'];

  const filteredDocs = REAL_REFERENCES.filter((doc) => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Cơ sở Lý luận & Pháp lý
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tài liệu Tham khảo Chính thống & Đường dẫn Xác thực
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Toàn bộ các tài liệu dưới đây là các công trình nghiên cứu, chuẩn mực kiểm chứng và cổng thông tin chính thức có đường dẫn truy cập thực tế (không sử dụng URL giả định).
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu, cơ quan, từ khóa..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    doc.type === 'Học thuật'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : doc.type === 'Tiêu chuẩn quốc tế'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : doc.type === 'Quy chuẩn Việt Nam'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {doc.type}
                </span>
                <span className="text-xs font-mono text-slate-400">{doc.year}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1 mb-1.5 leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs font-medium text-indigo-700 mb-3">
                Cơ quan: {doc.organization}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {doc.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px] sm:max-w-[260px]">
                {doc.url}
              </span>

              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors shrink-0"
              >
                <span>Truy cập nguồn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
