import React, { useState } from 'react';
import { FullEvaluationResponse, StudentProfile } from '../types';
import { generateEvaluationPdf } from '../utils/exportPdf';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Copy,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Check,
  Info,
  Clock,
  Sparkles,
  Award,
  FileDown,
  Loader2,
  FileText
} from 'lucide-react';

interface EvaluationResultSectionProps {
  evaluation: FullEvaluationResponse;
  onReEvaluate: () => void;
  onNewEvaluation: () => void;
  studentProfile?: StudentProfile;
}

export const EvaluationResultSection: React.FC<EvaluationResultSectionProps> = ({
  evaluation,
  onReEvaluate,
  onNewEvaluation,
  studentProfile
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [expandedCriteria, setExpandedCriteria] = useState<Record<string, boolean>>({
    evidence: true,
    corroboration: true,
    transparency: true,
    recency: true,
    expertise: true,
    objectivity: true
  });

  const { result, sourceMetadata, evaluatedAt } = evaluation;
  const score = result.overallScore;

  // Determine badge and color scheme
  let badgeConfig = {
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    barBg: 'bg-emerald-500',
    icon: CheckCircle2,
    advice: 'Nguồn tin đạt tiêu chuẩn cao về minh bạch và căn cứ khoa học/thực tế.'
  };

  if (score < 50) {
    badgeConfig = {
      color: 'rose',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      barBg: 'bg-rose-500',
      icon: XCircle,
      advice: 'Cảnh báo rủi ro cao: Nguồn tin có dấu hiệu giật gân, thiếu chứng cứ hoặc không rõ nguồn gốc.'
    };
  } else if (score < 70) {
    badgeConfig = {
      color: 'amber',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      barBg: 'bg-amber-500',
      icon: AlertTriangle,
      advice: 'Cần thận trọng: Dữ liệu chưa đầy đủ hoặc có yếu tố phiến diện, bắt buộc phải kiểm chứng chéo.'
    };
  } else if (score < 85) {
    badgeConfig = {
      color: 'blue',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      barBg: 'bg-blue-500',
      icon: CheckCircle2,
      advice: 'Đáng tin cậy: Nguồn tin tốt, đủ điều kiện tham khảo, nên chú ý một vài chi tiết nhỏ.'
    };
  }

  const toggleCriterion = (id: string) => {
    setExpandedCriteria((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyReport = () => {
    const reportText = `=====================================================
BÁO CÁO ĐÁNH GIÁ ĐỘ TIN CẬY NGUỒN TIN (FACTCHECK VERITAS)
Thời gian thẩm định: ${new Date(evaluatedAt).toLocaleString('vi-VN')}
=====================================================

THÔNG TIN NGUỒN TIN:
- Tiêu đề: ${sourceMetadata.title}
- Nguồn/URL: ${sourceMetadata.sourceUrl}
- Tác giả/Nhà xuất bản: ${sourceMetadata.publisherOrAuthor}
- Ngày xuất bản: ${sourceMetadata.publishDate}
- Thể loại: ${sourceMetadata.sourceType}

KẾT QUẢ TỔNG QUAN:
- Tổng điểm tin cậy: ${score} / 100
- Xếp loại: ${result.verdict}
- Đánh giá tổng quan: ${result.executiveSummary}

KẾT QUẢ CHI TIẾT 6 TIÊU CHÍ:
${result.criteriaAnalysis
  .map(
    (c, i) =>
      `[${i + 1}] ${c.name}: ${c.score}/${c.maxScore} điểm\n   Nhận xét: ${c.assessment}\n   + Điểm mạnh: ${c.strengths.join('; ') || 'Không ghi nhận'}\n   - Hạn chế: ${c.weaknesses.join('; ') || 'Không ghi nhận'}`
  )
  .join('\n\n')}

CẢNH BÁO ĐỎ (RED FLAGS):
${result.redFlags && result.redFlags.length > 0 ? result.redFlags.map((rf) => `- ${rf}`).join('\n') : '- Không phát hiện cảnh báo nguy hiểm trực tiếp'}

DỮ LIỆU KHUYẾT THIẾU CẦN LƯU Ý:
${result.missingDataNotes && result.missingDataNotes.length > 0 ? result.missingDataNotes.map((m) => `- ${m}`).join('\n') : '- Dữ liệu tương đối đầy đủ theo phạm vi cung cấp'}

KHUYẾN NGHỊ KIỂM CHỨNG ĐỘC LẬP:
${result.verificationChecklist.map((step, i) => `${i + 1}. ${step}`).join('\n')}

=====================================================
Công cụ nghiên cứu phục vụ đề tài thực tập sinh viên
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      const currentProfile: StudentProfile = studentProfile || {
        fullName: 'Trần Thiên Phú',
        studentId: 'TH04840',
        groupName: 'Nhóm 02',
        internshipTopic: 'Công cụ đánh giá độ tin cậy nguồn tin trực tuyến dựa trên mô hình ngôn ngữ lớn (Gemini)',
        supervisor: 'Trần Tuấn Thanh',
        university: 'Cao đẳng FPT Polytechnic',
        notes: ''
      };
      await generateEvaluationPdf(evaluation, currentProfile);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err: any) {
      console.error('Lỗi khi xuất PDF:', err);
      setPdfError(err?.message || 'Không thể tạo tệp PDF. Vui lòng thử lại.');
      setTimeout(() => setPdfError(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            Đã hoàn thành thẩm định thời gian thực bằng mô hình Gemini
          </span>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            ({new Date(evaluatedAt).toLocaleTimeString('vi-VN')})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Export Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
              pdfSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600'
            }`}
            title="Xuất kết quả đánh giá thành tệp PDF chính thức để lưu trữ hồ sơ"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tạo PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã lưu PDF!</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất tệp PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyReport}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép text</span>
              </>
            )}
          </button>

          <button
            onClick={onReEvaluate}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đánh giá lại</span>
          </button>

          <button
            onClick={onNewEvaluation}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Thẩm định nguồn khác</span>
          </button>
        </div>
      </div>

      {/* PDF Export Feedback Alert */}
      {pdfSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Tệp PDF báo cáo thẩm định đã được tải xuống máy thành công (kèm họ tên sinh viên <strong>{studentProfile?.fullName || 'Trần Thiên Phú'}</strong>, MSSV <strong>{studentProfile?.studentId || 'TH04840'}</strong>).
            </span>
          </div>
        </div>
      )}

      {pdfError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Lỗi khi tạo tệp PDF: {pdfError}</span>
        </div>
      )}

      {/* Hero Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Score & Verdict */}
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
                <div className="text-center">
                  <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {score}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    / 100 điểm
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${badgeConfig.badgeBg}`}>
                    <BadgeIcon className="w-4 h-4" />
                    {result.verdict}
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    6 Tiêu chí chuẩn
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {sourceMetadata.title || 'Nguồn tin được thẩm định'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Tác giả: <strong>{sourceMetadata.publisherOrAuthor}</strong></span>
                  <span>•</span>
                  <span>Thời gian: <strong>{sourceMetadata.publishDate}</strong></span>
                  <span>•</span>
                  <span>Loại hình: <strong>{sourceMetadata.sourceType}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Score Meter */}
            <div className="md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-100 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Thang độ tin cậy</span>
                <span className="font-mono text-slate-900 font-bold">{score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${badgeConfig.barBg}`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                {badgeConfig.advice}
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Đánh giá tổng quan từ mô hình AI (Executive Summary)
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm leading-relaxed">
              {result.executiveSummary}
            </div>
          </div>

          {/* Red Flags Alert if present */}
          {result.redFlags && result.redFlags.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Cảnh báo đỏ (Red Flags) được phát hiện:</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-rose-700">
                {result.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Data Warning Box (Mandatory Requirement 5) */}
          {result.missingDataNotes && result.missingDataNotes.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-amber-800">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Dữ liệu khuyết thiếu & Giới hạn thông tin đầu vào:</span>
              </div>
              <p className="text-xs text-amber-800/90 mb-2">
                Hệ thống chỉ đánh giá dựa trên dữ liệu văn bản được cung cấp và không tự ý bịa đặt nguồn gốc chưa được xác thực:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-amber-800">
                {result.missingDataNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 6 Criteria Detailed Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Phân tích chi tiết theo 6 tiêu chí độc lập (Tổng 100 điểm)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mỗi tiêu chí được chấm điểm và giải trình cụ thể dựa trên chứng cứ thực tế trong văn bản.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-mono font-semibold text-slate-400">
              Điểm đạt được: <strong className="text-indigo-600 text-sm">{score}/100</strong>
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {result.criteriaAnalysis.map((criterion, index) => {
            const isExpanded = expandedCriteria[criterion.id] ?? true;
            const percentage = Math.round((criterion.score / criterion.maxScore) * 100);

            let critColor = 'emerald';
            if (percentage < 50) critColor = 'rose';
            else if (percentage < 70) critColor = 'amber';
            else if (percentage < 85) critColor = 'blue';

            return (
              <div
                key={criterion.id || index}
                className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleCriterion(criterion.id)}
                  className="p-4 bg-slate-50/70 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {criterion.name}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Trọng số: {criterion.maxScore} điểm ({criterion.maxScore}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-slate-900">
                        {criterion.score} / {criterion.maxScore}
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            critColor === 'rose'
                              ? 'bg-rose-500'
                              : critColor === 'amber'
                              ? 'bg-amber-500'
                              : critColor === 'blue'
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-3.5">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Nhận xét đánh giá chuyên môn:
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {criterion.assessment}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Strengths */}
                      <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Điểm mạnh ghi nhận:
                        </span>
                        {criterion.strengths && criterion.strengths.length > 0 ? (
                          <ul className="text-xs text-emerald-900 space-y-1">
                            {criterion.strengths.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-500">•</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Không có điểm mạnh nổi bật</p>
                        )}
                      </div>

                      {/* Weaknesses */}
                      <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Hạn chế / Điểm nghi vấn:
                        </span>
                        {criterion.weaknesses && criterion.weaknesses.length > 0 ? (
                          <ul className="text-xs text-rose-900 space-y-1">
                            {criterion.weaknesses.map((w, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-rose-500">•</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Không phát hiện hạn chế đáng kể</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Verification Checklist (Fact-checking recommendations) */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Khuyến nghị quy trình kiểm chứng thực địa</h3>
            <p className="text-xs text-indigo-200">
              Các bước hành động cụ thể để sinh viên và người nghiên cứu tự đối chiếu độc lập
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {result.verificationChecklist.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-lg bg-indigo-600/80 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
