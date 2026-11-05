import React from 'react';
import { EVALUATION_CRITERIA_INFO, VERIFICATION_GUIDE_STEPS } from '../data/constants';
import { Scale, CheckCircle2, XCircle, HelpCircle, Compass, Award, ShieldAlert } from 'lucide-react';

export const CriteriaGuideSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <Scale className="w-3.5 h-3.5" />
            Khung đánh giá học thuật
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            6 Tiêu chí Đánh giá Độ tin cậy Nguồn tin
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Hệ thống áp dụng phương pháp định lượng kết hợp định tính, tổng hòa từ các chuẩn mực kiểm chứng thông tin quốc tế (IFCN, CRAAP Test) và quy chuẩn báo chí truyền thông Việt Nam. Thang điểm chuẩn hóa tối đa 100 điểm.
          </p>
        </div>

        {/* 4 Classification Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Rất cao</span>
              <span className="text-xs font-mono font-bold text-emerald-700">85 - 100 điểm</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed mt-1">
              Nguồn tin chuẩn mực học thuật, báo chí chính thống có thẩm quyền, số liệu kiểm chứng độc lập rõ ràng.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Đáng tin cậy</span>
              <span className="text-xs font-mono font-bold text-blue-700">70 - 84 điểm</span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed mt-1">
              Thông tin tốt, minh bạch nguồn xuất bản, luận điểm có căn cứ, có thể dùng làm tài liệu tham khảo với lưu ý nhỏ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Trung bình / Cần thận trọng</span>
              <span className="text-xs font-mono font-bold text-amber-700">50 - 69 điểm</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed mt-1">
              Dữ liệu khuyết thiếu, nguồn đơn độc hoặc mang tính quan điểm cá nhân, bắt buộc kiểm chứng chéo trước khi trích dẫn.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Kém tin cậy / Nguy cơ sai lệch</span>
              <span className="text-xs font-mono font-bold text-rose-700">0 - 49 điểm</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed mt-1">
              Có dấu hiệu tin đồn giật gân, bẫy clickbait, bài xích khoa học hoặc nguồn gốc mập mờ, tuyệt đối không trích dẫn.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Criteria Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Bảng mô tả chi tiết & Dấu hiệu nhận biết</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EVALUATION_CRITERIA_INFO.map((crit, idx) => (
            <div
              key={crit.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{crit.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {crit.maxScore} điểm ({crit.percentage})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 mb-4">
                  {crit.description}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  {/* Good signs */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Dấu hiệu tích cực:
                    </span>
                    <ul className="text-xs text-emerald-900/90 space-y-1">
                      {crit.goodIndicators.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bad signs */}
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100/80">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Dấu hiệu tiêu cực / Nghi vấn:
                    </span>
                    <ul className="text-xs text-rose-900/90 space-y-1">
                      {crit.badIndicators.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-step Verification Guide */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Quy trình 5 Bước Kiểm chứng Nguồn tin cho Sinh viên
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Kết hợp phương pháp SIFT của Mike Caulfield và kỹ năng đọc ngang (Lateral Reading) của các nhà kiểm chứng chuyên nghiệp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {VERIFICATION_GUIDE_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold mb-2">
                  Bước {step.step}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
