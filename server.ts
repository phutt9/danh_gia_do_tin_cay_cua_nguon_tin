import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString()
  });
});

// Evaluation criteria metadata (for backend verification)
const CRITERIA_DEFINITIONS = [
  { id: 'evidence', name: 'Bằng chứng & Trích dẫn', maxScore: 25 },
  { id: 'corroboration', name: 'Đối chiếu nguồn độc lập', maxScore: 20 },
  { id: 'transparency', name: 'Minh bạch tác giả & Đơn vị xuất bản', maxScore: 15 },
  { id: 'recency', name: 'Cập nhật & Bối cảnh thời gian', maxScore: 10 },
  { id: 'expertise', name: 'Chuyên môn phù hợp & Thẩm quyền lĩnh vực', maxScore: 10 },
  { id: 'objectivity', name: 'Ngôn ngữ khách quan / Tránh giật gân', maxScore: 20 }
];

app.post('/api/evaluate-source', async (req, res) => {
  try {
    const {
      title,
      sourceUrl,
      publisherOrAuthor,
      content,
      publishDate,
      sourceType,
      additionalContext
    } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 20) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp nội dung hoặc trích đoạn nguồn tin tối thiểu 20 ký tự để phân tích.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng thêm khóa API trong Secrets để kích hoạt phân tích thực tế.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Bạn là chuyên gia thẩm định độ tin cậy thông tin và kiểm chứng tin tức (Fact-checking & Source Evaluation) cho sinh viên đại học và nhà nghiên cứu.
Hãy phân tích và chấm điểm độ tin cậy của tài liệu/nguồn tin sau đây một cách trung thực, khách quan và khoa học dựa trên đúng 6 tiêu chí chuẩn.

THÔNG TIN ĐẦU VÀO TỪ NGƯỜI DÙNG:
- Tiêu đề: ${title ? title : '(Chưa cung cấp tiêu đề)'}
- Nguồn / Đường dẫn (URL): ${sourceUrl ? sourceUrl : '(Chưa cung cấp URL)'}
- Tác giả / Đơn vị xuất bản được ghi nhận: ${publisherOrAuthor ? publisherOrAuthor : '(Không rõ/Chưa cung cấp)'}
- Thời gian công bố / Ngày xuất bản: ${publishDate ? publishDate : '(Không rõ ngày tháng)'}
- Loại hình nguồn tin: ${sourceType ? sourceType : 'Không xác định'}
- Bối cảnh / Ghi chú thêm: ${additionalContext ? additionalContext : '(Không có)'}

NỘI DUNG VĂN BẢN ĐƯỢC CUNG CẤP:
"""
${content.slice(0, 12000)}
"""

QUY TẮC ĐÁNH GIÁ NGHIÊM NGẶT (TUÂN THỦ 100%):
1. KHÔNG ĐƯỢC GIẢ LẬP ĐIỂM SỐ. Mỗi điểm số phải dựa trên dẫn chứng thực tế trong văn bản được cung cấp.
2. KHÔNG ĐƯỢC BỊA ĐẶT NGUỒN, bịa trích dẫn, hoặc tự nhận rằng bạn đã kiểm chứng được URL bên ngoài thời gian thực nếu không có bằng chứng nội hàm. Nếu URL/tác giả cần kiểm tra chéo, hãy nêu rõ đây là giả định cần sinh viên tự truy vấn lại.
3. NẾU THIẾU DỮ LIỆU (ví dụ không có tên tác giả, không có ngày công bố, không dẫn link nguồn gốc, bài quá ngắn): BẮT BUỘC phải thông báo rõ trong phần "missingDataNotes" và hạ điểm các tiêu chí tương ứng một cách hợp lý.
4. THANG ĐIỂM 6 TIÊU CHÍ (TỔNG TỐI ĐA 100 ĐIỂM):
   - Tiêu chí 1: "Bằng chứng & Trích dẫn" (Tối đa 25 điểm). Đánh giá: có số liệu cụ thể, tên tổ chức khoa học, trích dẫn trực tiếp, liên kết tài liệu gốc không?
   - Tiêu chí 2: "Đối chiếu nguồn độc lập" (Tối đa 20 điểm). Đánh giá: luận điểm có thể đối chiếu với các nguồn uy tín độc lập hay là khẳng định đơn độc một chiều, tin đồn nội bộ?
   - Tiêu chí 3: "Minh bạch tác giả & Đơn vị xuất bản" (Tối đa 15 điểm). Đánh giá: rõ danh tính, cơ quan báo chí/tổ chức xuất bản hay tài khoản ẩn danh, trang web mạo danh?
   - Tiêu chí 4: "Cập nhật & Bối cảnh thời gian" (Tối đa 10 điểm). Đánh giá: có mốc thời gian rõ ràng, sự kiện còn giá trị thời sự hay bị cắt ghép từ sự kiện cũ?
   - Tiêu chí 5: "Chuyên môn phù hợp & Thẩm quyền lĩnh vực" (Tối đa 10 điểm). Đánh giá: người phát ngôn/tác giả có thẩm quyền, học hàm học vị hay kinh nghiệm phù hợp với chủ đề không?
   - Tiêu chí 6: "Ngôn ngữ khách quan / Tránh giật gân, quá mức" (Tối đa 20 điểm). Đánh giá: giọng văn trung tính, khoa học hay dùng từ ngữ giật gân (chấn động, ngỡ ngàng, thần dược...), clickbait, kích động định kiến?

5. XẾP LOẠI DỰA TRÊN TỔNG ĐIỂM:
   - 85 - 100: "Rất cao" (Nguồn tin chuẩn mực, minh bạch và có căn cứ vững chắc)
   - 70 - 84: "Đáng tin cậy" (Nguồn tin tốt, đủ điều kiện tham khảo, nên chú ý vài điểm nhỏ)
   - 50 - 69: "Trung bình / Cần thận trọng" (Thông tin thiếu chứng cứ đầy đủ hoặc phiến diện, bắt buộc kiểm chứng chéo trước khi trích dẫn)
   - 0 - 49: "Kém tin cậy / Nguy cơ sai lệch" (Có dấu hiệu tin giả, giật gân, thiếu căn cứ hoặc nguồn mờ ám)

Trả về kết quả bằng tiếng Việt theo định dạng JSON chuẩn.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.INTEGER,
              description: 'Tổng điểm từ 0 đến 100, bằng tổng điểm của 6 tiêu chí'
            },
            verdict: {
              type: Type.STRING,
              description: 'Xếp loại: "Rất cao", "Đáng tin cậy", "Trung bình / Cần thận trọng", hoặc "Kém tin cậy / Nguy cơ sai lệch"'
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'Đánh giá tổng quan súc tích từ 2-4 câu về độ tin cậy của bài viết'
            },
            criteriaAnalysis: {
              type: Type.ARRAY,
              description: 'Danh sách đánh giá đúng 6 tiêu chí',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Mã tiêu chí: evidence, corroboration, transparency, recency, expertise, objectivity' },
                  name: { type: Type.STRING, description: 'Tên tiêu chí tiếng Việt' },
                  score: { type: Type.INTEGER, description: 'Điểm đạt được' },
                  maxScore: { type: Type.INTEGER, description: 'Điểm tối đa của tiêu chí' },
                  assessment: { type: Type.STRING, description: 'Nhận xét chi tiết dựa trên nội dung thực tế' },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Các điểm mạnh ghi nhận được'
                  },
                  weaknesses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Các hạn chế, thiếu sót hoặc dấu hiệu nghi vấn'
                  }
                },
                required: ['id', 'name', 'score', 'maxScore', 'assessment', 'strengths', 'weaknesses']
              }
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cảnh báo đỏ đặc biệt nghiêm trọng nếu có (giật gân, giấu nguồn, thông tin y tế sai lệch...)'
            },
            missingDataNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các dữ liệu quan trọng bị khuyết thiếu trong nguồn tin mà người đọc cần lưu ý'
            },
            verificationChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các bước cụ thể khuyến nghị sinh viên/người đọc nên thực hiện để kiểm chứng độc lập'
            }
          },
          required: [
            'overallScore',
            'verdict',
            'executiveSummary',
            'criteriaAnalysis',
            'redFlags',
            'missingDataNotes',
            'verificationChecklist'
          ]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Mô hình Gemini không phản hồi nội dung văn bản.');
    }

    const evaluationResult = JSON.parse(textOutput);

    // Ensure criteria alignment and calculate exact sum
    let calculatedTotal = 0;
    if (Array.isArray(evaluationResult.criteriaAnalysis)) {
      for (const item of evaluationResult.criteriaAnalysis) {
        calculatedTotal += Number(item.score) || 0;
      }
      evaluationResult.overallScore = Math.min(100, Math.max(0, calculatedTotal));
    }

    res.json({
      success: true,
      evaluatedAt: new Date().toISOString(),
      sourceMetadata: {
        title: title || 'Không có tiêu đề',
        sourceUrl: sourceUrl || 'N/A',
        publisherOrAuthor: publisherOrAuthor || 'Không rõ',
        publishDate: publishDate || 'Không rõ',
        sourceType: sourceType || 'N/A'
      },
      result: evaluationResult
    });
  } catch (err: any) {
    console.error('Error in /api/evaluate-source:', err);
    res.status(500).json({
      error: 'Quá trình phân tích gặp sự cố: ' + (err?.message || 'Lỗi không xác định từ máy chủ.')
    });
  }
});

// Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupServer();
