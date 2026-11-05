import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User, Save, RotateCcw, Check, GraduationCap, Users, BookOpen, Building, Award, Edit3 } from 'lucide-react';

interface StudentProfileSectionProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  profile,
  setProfile
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    localStorage.setItem('factcheck_student_profile', JSON.stringify(formData));
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToDefault = () => {
    const defaultProfile: StudentProfile = {
      fullName: 'Trần Thiên Phú',
      studentId: 'TH04840',
      groupName: 'Nhóm 02',
      internshipTopic: 'Công cụ đánh giá độ tin cậy nguồn tin trực tuyến dựa trên mô hình ngôn ngữ lớn (Gemini)',
      supervisor: 'Trần Tuấn Thanh',
      university: 'Cao đẳng FPT Polytechnic',
      notes: 'Đề tài hướng tới mục tiêu cung cấp giải pháp hỗ trợ sinh viên và người làm báo kiểm tra chéo nguồn tin, phòng chống tin giả theo 6 tiêu chuẩn chuẩn hóa.'
    };
    setFormData(defaultProfile);
    setProfile(defaultProfile);
    localStorage.setItem('factcheck_student_profile', JSON.stringify(defaultProfile));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Thông tin Học viên / Sinh viên thực tập
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hồ sơ Sinh viên & Đề tài Thực tập
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bạn có thể tự do cập nhật thông tin cá nhân, mã sinh viên và nhóm thực tập bên dưới. Dữ liệu được lưu an toàn trong trình duyệt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Chỉnh sửa thông tin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Card View or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-5">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <span>Biểu mẫu Cập nhật Thông tin Sinh viên</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Họ và tên sinh viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nhập họ và tên của bạn..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Mã sinh viên (MSSV) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, studentId: e.target.value }))}
                placeholder="VD: 20261234..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nhóm thực tập / Lớp học phần <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.groupName}
                onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                placeholder="VD: Nhóm 03 - Thực tập tốt nghiệp..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Giảng viên / Người hướng dẫn
              </label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData((prev) => ({ ...prev, supervisor: e.target.value }))}
                placeholder="VD: TS. Nguyễn Văn B..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Đơn vị đào tạo / Trường Đại học
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
              placeholder="VD: Đại học Quốc gia..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Tên đề tài thực tập
            </label>
            <input
              type="text"
              value={formData.internshipTopic}
              onChange={(e) => setFormData((prev) => ({ ...prev, internshipTopic: e.target.value }))}
              placeholder="Tên đề tài thực tập chính thức..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Mục tiêu đề tài / Ghi chú học phần
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Tóm tắt mục tiêu, phạm vi nghiên cứu hoặc kết quả dự kiến..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục mẫu mặc định
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu thông tin hồ sơ
            </button>
          </div>
        </form>
      ) : (
        /* Academic Card Preview */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Đã cập nhật và lưu hồ sơ thành công vào bộ nhớ trình duyệt!
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-200">
                  {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {profile.fullName || 'Chưa đặt tên'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      MSSV: {profile.studentId || 'Chưa có MSSV'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {profile.groupName || 'Chưa phân nhóm'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Trạng thái hồ sơ</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đang thực hiện thực tập
                </span>
              </div>
            </div>

            {/* Profile Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  Đề tài thực tập:
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {profile.internshipTopic}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  Cán bộ / Giảng viên hướng dẫn:
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {profile.supervisor}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  Đơn vị đào tạo / Trường:
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {profile.university}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  Nhóm thực tập:
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {profile.groupName}
                </p>
              </div>
            </div>

            {/* Topic Scope / Notes */}
            <div className="mt-5 p-4 rounded-xl bg-indigo-50/40 border border-indigo-100/80">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Mục tiêu nghiên cứu & Ứng dụng thực tiễn:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {profile.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
