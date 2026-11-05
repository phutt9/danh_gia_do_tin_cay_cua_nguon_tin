import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FullEvaluationResponse, StudentProfile } from '../types';

export async function generateEvaluationPdf(
  evaluation: FullEvaluationResponse,
  profile: StudentProfile,
  elementToCapture?: HTMLElement | null
): Promise<void> {
  // If an element is provided, we capture that element.
  // Otherwise, we create a dedicated off-screen high-res printable report element.
  let targetElement = elementToCapture;
  let tempWrapper: HTMLElement | null = null;

  if (!targetElement) {
    tempWrapper = document.createElement('div');
    tempWrapper.style.position = 'fixed';
    tempWrapper.style.left = '-9999px';
    tempWrapper.style.top = '0';
    tempWrapper.style.width = '800px';
    tempWrapper.style.backgroundColor = '#ffffff';
    tempWrapper.style.zIndex = '-1000';
    tempWrapper.innerHTML = generateReportHtml(evaluation, profile);
    document.body.appendChild(tempWrapper);
    targetElement = tempWrapper.firstElementChild as HTMLElement;
  }

  try {
    const canvas = await html2canvas(targetElement, {
      scale: 2, // High resolution for crisp text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if the content is longer than 1 A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeStudentId = (profile.studentId || 'TH04840').replace(/[^a-zA-Z0-9_-]/g, '');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `Bao_cao_tham_dinh_${safeStudentId}_${timestamp}.pdf`;

    pdf.save(filename);
  } finally {
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
    }
  }
}

function generateReportHtml(evaluation: FullEvaluationResponse, profile: StudentProfile): string {
  const { result, sourceMetadata, evaluatedAt } = evaluation;
  const score = result.overallScore;

  let verdictColor = '#059669'; // emerald
  let verdictBg = '#ecfdf5';
  if (score < 50) {
    verdictColor = '#e11d48'; // rose
    verdictBg = '#fff1f2';
  } else if (score < 70) {
    verdictColor = '#d97706'; // amber
    verdictBg = '#fffbeb';
  } else if (score < 85) {
    verdictColor = '#2563eb'; // blue
    verdictBg = '#eff6ff';
  }

  const criteriaHtml = result.criteriaAnalysis
    .map((crit, idx) => {
      const percentage = Math.round((crit.score / crit.maxScore) * 100);
      let critColor = '#059669';
      if (percentage < 50) critColor = '#e11d48';
      else if (percentage < 70) critColor = '#d97706';

      const strengthsList =
        crit.strengths && crit.strengths.length > 0
          ? crit.strengths.map((s) => `<li style="margin-bottom: 2px;">• ${s}</li>`).join('')
          : '<li style="color: #64748b; font-style: italic;">Không ghi nhận điểm mạnh nổi bật</li>';

      const weaknessesList =
        crit.weaknesses && crit.weaknesses.length > 0
          ? crit.weaknesses.map((w) => `<li style="margin-bottom: 2px;">• ${w}</li>`).join('')
          : '<li style="color: #64748b; font-style: italic;">Không phát hiện hạn chế đáng kể</li>';

      return `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #fafafa; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
            <div style="font-weight: 700; font-size: 13px; color: #0f172a;">
              <span style="display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; background: #4f46e5; color: #fff; border-radius: 50%; font-size: 11px; margin-right: 6px;">${idx + 1}</span>
              ${crit.name}
            </div>
            <div style="font-weight: 800; font-size: 14px; color: ${critColor}; font-family: monospace;">
              ${crit.score} / ${crit.maxScore} điểm
            </div>
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.5; margin-bottom: 8px;">
            <strong>Nhận xét:</strong> ${crit.assessment}
          </div>
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 6px 8px; font-size: 11px; color: #166534;">
              <div style="font-weight: 700; margin-bottom: 4px;">Điểm mạnh ghi nhận:</div>
              <ul style="margin: 0; padding-left: 0; list-style: none;">${strengthsList}</ul>
            </div>
            <div style="flex: 1; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 6px 8px; font-size: 11px; color: #9f1239;">
              <div style="font-weight: 700; margin-bottom: 4px;">Hạn chế / Nghi vấn:</div>
              <ul style="margin: 0; padding-left: 0; list-style: none;">${weaknessesList}</ul>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const redFlagsHtml =
    result.redFlags && result.redFlags.length > 0
      ? `
      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; color: #881337; font-size: 12px;">
        <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          ⚠️ CẢNH BÁO ĐỎ ĐƯỢC PHÁT HIỆN:
        </div>
        <ul style="margin: 0; padding-left: 14px;">
          ${result.redFlags.map((rf) => `<li style="margin-bottom: 3px;">${rf}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  const missingDataHtml =
    result.missingDataNotes && result.missingDataNotes.length > 0
      ? `
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; color: #78350f; font-size: 12px;">
        <div style="font-weight: 800; margin-bottom: 4px;">
          ℹ️ DỮ LIỆU KHUYẾT THIẾU CẦN LƯU Ý:
        </div>
        <ul style="margin: 0; padding-left: 14px;">
          ${result.missingDataNotes.map((m) => `<li style="margin-bottom: 3px;">${m}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  const verificationHtml = result.verificationChecklist
    .map(
      (step, i) => `
      <div style="margin-bottom: 6px; font-size: 11.5px; color: #1e293b; line-height: 1.4;">
        <span style="display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; background: #e0e7ff; color: #3730a3; border-radius: 4px; font-weight: bold; margin-right: 6px; font-size: 10px;">${i + 1}</span>
        ${step}
      </div>
    `
    )
    .join('');

  return `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 28px 32px; color: #0f172a; background: #ffffff; width: 800px; box-sizing: border-box;">
      <!-- Formal Academic Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <div style="font-size: 13px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px;">
            ${profile.university || 'Cao đẳng FPT Polytechnic'}
          </div>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">
            ĐỀ TÀI THỰC TẬP TỐT NGHIỆP: CÔNG CỤ ĐÁNH GIÁ ĐỘ TIN CẬY NGUỒN TIN
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #64748b;">Thời gian thẩm định:</div>
          <div style="font-size: 11.5px; font-weight: 700; color: #0f172a; font-family: monospace;">
            ${new Date(evaluatedAt).toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      <!-- Document Title -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; text-transform: uppercase;">
          BÁO CÁO KẾT QUẢ THẨM ĐỊNH ĐỘ TIN CẬY NGUỒN TIN
        </h1>
        <div style="font-size: 12px; color: #4f46e5; font-weight: 600;">
          Hệ thống FactCheck Veritas (Mô hình Ngôn ngữ Lớn Gemini)
        </div>
      </div>

      <!-- Student & Subject Information Grid -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11.5px;">
        <div><strong>Họ và tên sinh viên:</strong> ${profile.fullName || 'Trần Thiên Phú'}</div>
        <div><strong>Mã sinh viên:</strong> <span style="font-family: monospace; font-weight: 700;">${profile.studentId || 'TH04840'}</span></div>
        <div><strong>Người hướng dẫn:</strong> ${profile.supervisor || 'Trần Tuấn Thanh'}</div>
        <div><strong>Nhóm thực tập:</strong> ${profile.groupName || 'Nhóm 02'}</div>
      </div>

      <!-- Source Metadata Box -->
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; font-size: 11.5px; line-height: 1.5;">
        <div style="font-weight: 800; font-size: 12.5px; color: #1e293b; margin-bottom: 6px; text-transform: uppercase;">
          Thông tin nguồn tin thẩm định
        </div>
        <div><strong>Tiêu đề:</strong> ${sourceMetadata.title || 'Không có tiêu đề'}</div>
        <div><strong>Đường dẫn (URL):</strong> <span style="color: #4338ca; word-break: break-all;">${sourceMetadata.sourceUrl || 'N/A'}</span></div>
        <div><strong>Tác giả / Nhà xuất bản:</strong> ${sourceMetadata.publisherOrAuthor || 'Không rõ'} &nbsp;|&nbsp; <strong>Ngày xuất bản:</strong> ${sourceMetadata.publishDate || 'Không rõ'}</div>
        <div><strong>Thể loại nguồn:</strong> ${sourceMetadata.sourceType || 'N/A'}</div>
      </div>

      <!-- Summary Score Banner -->
      <div style="background: ${verdictBg}; border: 2px solid ${verdictColor}; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="background: #ffffff; border: 2px solid ${verdictColor}; border-radius: 10px; width: 70px; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 26px; font-weight: 900; font-family: monospace; color: #0f172a; line-height: 1;">${score}</span>
            <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">/ 100 điểm</span>
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Xếp loại tin cậy:</div>
            <div style="font-size: 17px; font-weight: 800; color: ${verdictColor};">${result.verdict}</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569; max-width: 320px;">
          Đánh giá chuẩn hóa 6 tiêu chí độc lập theo phương pháp Fact-Checking học thuật quốc tế.
        </div>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 18px;">
        <div style="font-weight: 800; font-size: 12px; color: #334155; margin-bottom: 4px; text-transform: uppercase;">
          Đánh giá tổng quan (Executive Summary):
        </div>
        <div style="font-size: 12px; color: #1e293b; background: #f8fafc; border-left: 3px solid #4f46e5; padding: 8px 12px; line-height: 1.5;">
          ${result.executiveSummary}
        </div>
      </div>

      ${redFlagsHtml}
      ${missingDataHtml}

      <!-- Detailed 6 Criteria -->
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
          Chi tiết 6 Tiêu chuẩn Đánh giá (Thang 100 điểm)
        </div>
        ${criteriaHtml}
      </div>

      <!-- Verification Recommendations -->
      <div style="background: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; page-break-inside: avoid;">
        <div style="font-weight: 800; font-size: 12px; color: #1e293b; margin-bottom: 8px; text-transform: uppercase;">
          Khuyến nghị quy trình kiểm chứng thực địa dành cho sinh viên:
        </div>
        ${verificationHtml}
      </div>

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; margin-top: 32px; page-break-inside: avoid; font-size: 12px;">
        <div style="text-align: center; width: 220px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 45px;">NGƯỜI LẬP BÁO CÁO</div>
          <div style="font-weight: 700; color: #0f172a; text-decoration: underline;">${profile.fullName || 'Trần Thiên Phú'}</div>
          <div style="font-size: 11px; color: #64748b;">MSSV: ${profile.studentId || 'TH04840'}</div>
        </div>

        <div style="text-align: center; width: 220px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 45px;">GIẢNG VIÊN / NGƯỜI HƯỚNG DẪN</div>
          <div style="font-weight: 700; color: #0f172a; text-decoration: underline;">${profile.supervisor || 'Trần Tuấn Thanh'}</div>
          <div style="font-size: 11px; color: #64748b;">${profile.groupName || 'Nhóm 02'}</div>
        </div>
      </div>
    </div>
  `;
}
