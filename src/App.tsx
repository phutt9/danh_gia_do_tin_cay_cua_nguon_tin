import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SourceInputSection } from './components/SourceInputSection';
import { EvaluationResultSection } from './components/EvaluationResultSection';
import { CriteriaGuideSection } from './components/CriteriaGuideSection';
import { ReferencesSection } from './components/ReferencesSection';
import { StudentProfileSection } from './components/StudentProfileSection';
import { SourceInputForm, FullEvaluationResponse, StudentProfile } from './types';
import { SAMPLE_CASES } from './data/constants';
import { ShieldCheck, Sparkles, Scale, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const DEFAULT_PROFILE: StudentProfile = {
  fullName: 'Trần Thiên Phú',
  studentId: 'TH04840',
  groupName: 'Nhóm 02',
  internshipTopic: 'Công cụ đánh giá độ tin cậy nguồn tin trực tuyến dựa trên mô hình ngôn ngữ lớn (Gemini)',
  supervisor: 'Trần Tuấn Thanh',
  university: 'Cao đẳng FPT Polytechnic',
  notes: 'Đề tài tập trung xây dựng hệ thống thẩm định 6 tiêu chuẩn độc lập: Bằng chứng (25đ), Đối chiếu nguồn (20đ), Minh bạch tác giả (15đ), Cập nhật (10đ), Chuyên môn (10đ), và Ngôn ngữ khách quan (20đ).'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'criteria' | 'references' | 'profile'>('evaluate');
  
  // Input form state
  const [form, setForm] = useState<SourceInputForm>(() => SAMPLE_CASES[0].data);
  
  // Evaluation result state
  const [evaluation, setEvaluation] = useState<FullEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Student Profile state with localStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('factcheck_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Overwrite if previously populated with old placeholders or old university
        if (
          parsed.studentId === 'SV-TT-2026' ||
          parsed.studentId === 'SV2026-001' ||
          parsed.studentId === 'TH0484' ||
          parsed.fullName === 'Phan Thành Thuận' ||
          parsed.fullName === 'Nguyễn Văn A' ||
          parsed.university === 'Trường Đại học Công nghệ' ||
          parsed.university === 'Trường Đại học Công nghệ & Truyền thông'
        ) {
          const updated = { ...DEFAULT_PROFILE, ...parsed, university: 'Cao đẳng FPT Polytechnic', studentId: 'TH04840', fullName: 'Trần Thiên Phú', supervisor: 'Trần Tuấn Thanh', groupName: 'Nhóm 02' };
          localStorage.setItem('factcheck_student_profile', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Cannot read profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });

  const handleEvaluate = async () => {
    if (!form.content || form.content.trim().length < 20) {
      setError('Vui lòng nhập nội dung hoặc trích đoạn tối thiểu 20 ký tự.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi xảy ra trong quá trình đánh giá nguồn tin.');
      }

      setEvaluation(data);
      // Smooth scroll to top of view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Evaluation failure:', err);
      setError(err?.message || 'Không thể kết nối đến máy chủ phân tích. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      title: '',
      sourceUrl: '',
      publisherOrAuthor: '',
      publishDate: '',
      sourceType: '',
      content: '',
      additionalContext: ''
    });
    setEvaluation(null);
    setError(null);
  };

  const handleNewEvaluation = () => {
    setEvaluation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentName={profile.fullName}
      />

      {/* Hero Subtitle Banner */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white py-8 sm:py-12 border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Đề tài Thực tập: Công cụ đánh giá độ tin cậy nguồn tin
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Hệ thống Thẩm định & Đo lường Độ tin cậy Thông tin
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-200/90 leading-relaxed max-w-2xl">
                Phân tích thực tế bằng trí tuệ nhân tạo Gemini dựa trên 6 tiêu chí học thuật. Nhận diện dấu hiệu giật gân, thiếu chứng cứ và cung cấp quy trình kiểm chứng chéo độc lập.
              </p>
            </div>

            {/* Quick Stat badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-center px-2 py-1">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-indigo-300">6</span>
                <span className="text-[11px] text-indigo-200/70 font-medium">Tiêu chí chuẩn</span>
              </div>
              <div className="text-center px-2 py-1 border-x border-white/10">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-400">100đ</span>
                <span className="text-[11px] text-indigo-200/70 font-medium">Thang điểm tối đa</span>
              </div>
              <div className="text-center px-2 py-1">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-sky-300">0%</span>
                <span className="text-[11px] text-indigo-200/70 font-medium">Điểm số giả lập</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'evaluate' && (
          <div className="space-y-8">
            {evaluation ? (
              <EvaluationResultSection
                evaluation={evaluation}
                onReEvaluate={handleEvaluate}
                onNewEvaluation={handleNewEvaluation}
                studentProfile={profile}
              />
            ) : (
              <SourceInputSection
                form={form}
                setForm={setForm}
                onSubmit={handleEvaluate}
                isLoading={isLoading}
                onClear={handleClear}
                error={error}
              />
            )}
          </div>
        )}

        {activeTab === 'criteria' && <CriteriaGuideSection />}

        {activeTab === 'references' && <ReferencesSection />}

        {activeTab === 'profile' && (
          <StudentProfileSection profile={profile} setProfile={setProfile} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Đề tài thực tập:</span> “Công cụ đánh giá độ tin cậy nguồn tin”
            {profile.fullName && <span> — Sinh viên: <strong className="text-slate-800">{profile.fullName}</strong> ({profile.studentId})</span>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('criteria')}
              className="hover:text-indigo-600 transition-colors"
            >
              6 Tiêu chí
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('references')}
              className="hover:text-indigo-600 transition-colors"
            >
              Tài liệu tham khảo
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-indigo-600 transition-colors"
            >
              Hồ sơ sinh viên
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
