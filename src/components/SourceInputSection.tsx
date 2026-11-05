import React from 'react';
import { SourceInputForm } from '../types';
import { SAMPLE_CASES } from '../data/constants';
import { Sparkles, Trash2, Globe, UserCheck, Calendar, Tag, AlertCircle, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SourceInputSectionProps {
  form: SourceInputForm;
  setForm: React.Dispatch<React.SetStateAction<SourceInputForm>>;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
  error: string | null;
}

export const SourceInputSection: React.FC<SourceInputSectionProps> = ({
  form,
  setForm,
  onSubmit,
  isLoading,
  onClear,
  error
}) => {
  const charCount = form.content.trim().length;
  const isContentValid = charCount >= 20;

  const handleSelectSample = (sample: typeof SAMPLE_CASES[0]) => {
    setForm(sample.data);
  };

  const SOURCE_TYPES = [
    'Báo chí chính thống',
    'Tạp chí nghiên cứu khoa học',
    'Mạng xã hội (Facebook, TikTok, X, Threads)',
    'Diễn đàn thảo luận / Blog cá nhân',
    'Thông cáo báo chí / Website doanh nghiệp',
    'Tin nhắn chuyển tiếp (Zalo, Messenger, Telegram)'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-8">
      {/* Header & Sample presets */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Nhập liệu nguồn tin cần thẩm định</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hệ thống sử dụng mô hình Gemini phân tích thực tế theo 6 tiêu chí độc lập, không dùng điểm giả lập.
          </p>
        </div>

        {/* Quick sample loader buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Tải nhanh mẫu thử:
          </span>
          {SAMPLE_CASES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 font-medium text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title={sample.label}
            >
              <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-rose-500' : 'bg-amber-500'}`} />
              <span className="truncate max-w-[150px] sm:max-w-none">{sample.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isContentValid && !isLoading) {
            onSubmit();
          }
        }}
        className="mt-6 space-y-5"
      >
        {/* Title & URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Tiêu đề bài viết / Tiêu đề thông tin
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="VD: Cảnh báo dịch bệnh gia tăng hoặc Tiêu đề bài báo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              Đường dẫn nguồn tin (URL)
            </label>
            <input
              type="text"
              value={form.sourceUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, sourceUrl: e.target.value }))}
              placeholder="https://example.com/bai-viet hoặc link mạng xã hội..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-all"
            />
          </div>
        </div>

        {/* Author/Publisher, Date & Source Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              Tác giả / Cơ quan xuất bản
            </label>
            <input
              type="text"
              value={form.publisherOrAuthor}
              onChange={(e) => setForm((prev) => ({ ...prev, publisherOrAuthor: e.target.value }))}
              placeholder="VD: Bác sĩ Nguyễn Văn A / Báo Tuổi Trẻ / Ẩn danh..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Ngày xuất bản / Mốc thời gian
            </label>
            <input
              type="text"
              value={form.publishDate}
              onChange={(e) => setForm((prev) => ({ ...prev, publishDate: e.target.value }))}
              placeholder="VD: 18/10/2026 hoặc 'Không rõ ngày'..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              Loại hình nguồn tin
            </label>
            <select
              value={form.sourceType}
              onChange={(e) => setForm((prev) => ({ ...prev, sourceType: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50 transition-all"
            >
              <option value="">-- Chọn loại hình --</option>
              {SOURCE_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Box (Required) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Nội dung văn bản / Trích đoạn cần thẩm định
              <span className="text-rose-500">*</span>
            </label>
            <span className={`text-xs font-mono ${isContentValid ? 'text-emerald-600' : 'text-slate-400'}`}>
              {charCount} ký tự {isContentValid ? '✓' : '(tối thiểu 20)'}
            </span>
          </div>

          <textarea
            rows={7}
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Dán toàn bộ văn bản hoặc trích đoạn bài viết vào đây. Càng có nhiều nội dung chi tiết (số liệu, tên người phát biểu, tuyên bố, lập luận), việc phân tích và chấm điểm càng chuẩn xác..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 font-normal leading-relaxed transition-all"
          />

          {!isContentValid && charCount > 0 && (
            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Vui lòng nhập tối thiểu 20 ký tự để mô hình có đủ dữ kiện đánh giá.
            </p>
          )}
        </div>

        {/* Additional context */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Ghi chú / Bối cảnh kiểm tra thêm (Tùy chọn)
          </label>
          <input
            type="text"
            value={form.additionalContext}
            onChange={(e) => setForm((prev) => ({ ...prev, additionalContext: e.target.value }))}
            placeholder="VD: Nghi ngờ tác giả dùng tài khoản ảo; thông tin gây xôn xao trên nhóm sinh viên..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-all"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Phát hiện lỗi xử lý:</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading || (!form.content && !form.title)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa trắng form</span>
          </button>

          <button
            type="submit"
            disabled={!isContentValid || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang phân tích chuyên sâu qua Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tiến hành Thẩm định & Chấm điểm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
