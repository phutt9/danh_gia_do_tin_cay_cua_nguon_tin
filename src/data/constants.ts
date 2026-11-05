import { ReferenceDocument, SourceInputForm } from '../types';

export const EVALUATION_CRITERIA_INFO = [
  {
    id: 'evidence',
    name: 'Bằng chứng & Trích dẫn',
    maxScore: 25,
    percentage: '25%',
    description: 'Đánh giá sự hiện diện của dữ liệu sơ cấp, số liệu thống kê cụ thể, tài liệu tham khảo có thể truy nguyên, trích dẫn trực tiếp từ nhân chứng hoặc báo cáo gốc.',
    goodIndicators: [
      'Có đường dẫn liên kết đến nghiên cứu, quyết định hoặc tài liệu gốc',
      'Số liệu định lượng rõ ràng kèm phương pháp đo lường/thống kê',
      'Trích dẫn nguyên văn với ngữ cảnh đầy đủ, không cắt xén'
    ],
    badIndicators: [
      'Chỉ dùng cụm từ mơ hồ: "theo các nhà khoa học", "nhiều nguồn tin cho hay"',
      'Số liệu phóng đại không có nguồn đối chiếu',
      'Không có bất kỳ tài liệu hay bằng chứng gốc nào đi kèm'
    ]
  },
  {
    id: 'corroboration',
    name: 'Đối chiếu nguồn độc lập',
    maxScore: 20,
    percentage: '20%',
    description: 'Mức độ thông tin có thể kiểm chứng chéo và được xác nhận bởi ít nhất hai nguồn độc lập khác nhau (cơ quan thông tấn, tổ chức chuyên môn, cơ quan chức năng).',
    goodIndicators: [
      'Nhiều cơ quan báo chí hoặc tổ chức độc lập cùng đưa tin nhất quán',
      'Có phản hồi đa chiều từ các bên liên quan',
      'Được ghi nhận trên các cổng kiểm chứng thông tin chính thống'
    ],
    badIndicators: [
      'Tin độc quyền đơn độc, không một tổ chức nào khác xác nhận dù là sự kiện lớn',
      'Các trang web tự dẫn chéo lẫn nhau trong cùng một hệ thống ẩn danh',
      'Bị các tổ chức fact-checking bác bỏ'
    ]
  },
  {
    id: 'transparency',
    name: 'Minh bạch tác giả & Đơn vị xuất bản',
    maxScore: 15,
    percentage: '15%',
    description: 'Sự rõ ràng về nhân thân tác giả, chức danh khoa học, cơ quan chủ quản, giấy phép hoạt động báo chí, tôn chỉ mục đích và kênh liên hệ phản hồi.',
    goodIndicators: [
      'Rõ tên tác giả, tiểu sử nghề nghiệp và địa chỉ liên lạc',
      'Trang web có mục "Về chúng tôi", giấy phép xuất bản, cơ quan chủ quản hợp pháp',
      'Có chính sách đính chính sai sót công khai (Correction Policy)'
    ],
    badIndicators: [
      'Tác giả ẩn danh, dùng bút danh vô danh hoặc ảnh đại diện do AI tạo ra',
      'Tên miền nhái lại các cơ quan báo chí lớn (typosquatting)',
      'Không có địa chỉ trụ sở, không có số điện thoại hay người chịu trách nhiệm'
    ]
  },
  {
    id: 'recency',
    name: 'Cập nhật & Bối cảnh thời gian',
    maxScore: 10,
    percentage: '10%',
    description: 'Tính xác thực của mốc thời gian xuất bản, sự cập nhật của dữ liệu và việc thông tin có bị tách rời khỏi bối cảnh lịch sử/thời điểm ban đầu hay không.',
    goodIndicators: [
      'Ngày, giờ xuất bản và thời điểm cập nhật mới nhất được ghi chú cụ thể',
      'Bối cảnh sự kiện ăn khớp với mốc thời gian lịch sử',
      'Chủ động cập nhật khi có diễn biến mới'
    ],
    badIndicators: [
      'Không ghi ngày tháng xuất bản hoặc cố tình ẩn mốc thời gian',
      'Sử dụng video/hình ảnh từ nhiều năm trước để gán ghép cho sự kiện đang diễn ra',
      'Dữ liệu khoa học đã bị nghiên cứu mới phủ nhận nhưng vẫn đăng tải như chân lý'
    ]
  },
  {
    id: 'expertise',
    name: 'Chuyên môn phù hợp & Thẩm quyền lĩnh vực',
    maxScore: 10,
    percentage: '10%',
    description: 'Thẩm quyền và năng lực chuyên môn của người viết hoặc chuyên gia được phỏng vấn đối với chủ đề chuyên sâu (y khoa, pháp luật, tài chính, công nghệ).',
    goodIndicators: [
      'Người phát ngôn có học vị, chứng chỉ hành nghề hoặc công tác tại viện chuyên ngành',
      'Trích ý kiến từ hội đồng khoa học, cơ quan quản lý chuyên môn có thẩm quyền',
      'Tác giả có kinh nghiệm theo dõi mảng tin chuyên trách'
    ],
    badIndicators: [
      'Người không có chuyên môn y tế lại kê đơn thuốc hoặc tư vấn điều trị',
      'Gán ghép chức danh tự phong: "chuyên gia hàng đầu", "bậc thầy tâm linh"',
      'Chuyên gia phát biểu trái thẩm quyền hoặc lĩnh vực hoàn toàn xa lạ'
    ]
  },
  {
    id: 'objectivity',
    name: 'Ngôn ngữ khách quan / Tránh giật gân, quá mức',
    maxScore: 20,
    percentage: '20%',
    description: 'Văn phong trung lập, sự tách biệt giữa dữ kiện (facts) và ý kiến cá nhân (opinions), không dùng giật gân, bẫy clickbait hoặc ngôn từ kích động thù hận/sợ hãi.',
    goodIndicators: [
      'Giọng điệu điềm đạm, dùng từ ngữ chuẩn mực, phân biệt rõ ý kiến và sự thật',
      'Tiêu đề phản ánh đúng nội dung chính của bài viết',
      'Thừa nhận các giới hạn của vấn đề thay vì tuyệt đối hóa'
    ],
    badIndicators: [
      'Tiêu đề dùng từ cảm thán cực đoan: "KINH HOÀNG", "CHẤN ĐỘNG", "KHẨN CẤP"',
      'Dùng lời lẽ công kích cá nhân, phân biệt đối xử hoặc thao túng cảm xúc sợ hãi',
      'Khẳng định chắc nịch 100% trong khi vấn đề còn nhiều tranh luận'
    ]
  }
];

export const REAL_REFERENCES: ReferenceDocument[] = [
  {
    id: 'craap-test',
    title: 'The CRAAP Test for Source Evaluation',
    organization: 'Meriam Library, California State University, Chico',
    year: '2004 (Cập nhật liên tục)',
    description: 'Bộ công cụ học thuật kinh điển đánh giá tài liệu theo 5 trụ cột: Currency (Tính cập nhật), Relevance (Sự liên quan), Authority (Thẩm quyền), Accuracy (Độ chính xác) và Purpose (Mục đích).',
    url: 'https://www.csuchico.edu/style-guide/visual/craap-test.shtml',
    type: 'Học thuật'
  },
  {
    id: 'ifcn-poynter',
    title: 'IFCN Code of Principles (Bộ Quy tắc Kiểm chứng Thông tin Quốc tế)',
    organization: 'The Poynter Institute / International Fact-Checking Network',
    year: '2016',
    description: 'Bộ tiêu chuẩn cam kết quốc tế về phi đảng phái, tính công bằng, minh bạch nguồn tin, minh bạch tài chính và chính sách đính chính công khai trong kiểm chứng thông tin.',
    url: 'https://www.poynter.org/ifcn/',
    type: 'Tiêu chuẩn quốc tế'
  },
  {
    id: 'vafc-vietnam',
    title: 'Cổng thông tin tiếp nhận phản ánh và công bố tin giả (VAFC)',
    organization: 'Cục Phát thanh, truyền hình và thông tin điện tử - Bộ Thông tin và Truyền thông',
    year: '2021',
    description: 'Trang thông tin quốc gia chính thức tiếp nhận phản ánh, xác minh và công bố các thông tin sai sự thật, tin giả tại Việt Nam.',
    url: 'https://tingia.gov.vn/',
    type: 'Quy chuẩn Việt Nam'
  },
  {
    id: 'mic-handbook',
    title: 'Cẩm nang phòng chống tin giả, tin sai sự thật trên không gian mạng',
    organization: 'Bộ Thông tin và Truyền thông Việt Nam',
    year: '2022',
    description: 'Tài liệu hướng dẫn nhận diện tin giả, kỹ năng kiểm tra chéo nguồn tin và quy định pháp luật liên quan đến xử lý thông tin sai lệch trên không gian mạng.',
    url: 'https://mic.gov.vn/',
    type: 'Quy chuẩn Việt Nam'
  },
  {
    id: 'google-factcheck',
    title: 'Google Fact Check Tools & Explorer',
    organization: 'Google News Initiative & ClaimReview Community',
    year: '2018',
    description: 'Công cụ tra cứu các tuyên bố, phát ngôn đã được các tổ chức kiểm chứng độc lập trên toàn thế giới thẩm định theo chuẩn ClaimReview schema.',
    url: 'https://toolbox.google.com/factcheck/explorer',
    type: 'Báo chí & Kiểm chứng'
  },
  {
    id: 'sift-method',
    title: 'The SIFT Method (Four Moves for Evaluating Online Information)',
    organization: 'Mike Caulfield, Digital Literacy Expert - Washington State University Vancouver',
    year: '2019',
    description: 'Phương pháp 4 bước thực hành kiểm chứng thông tin trực tuyến nhanh: Stop (Dừng lại), Investigate the source (Điều tra nguồn), Find better coverage (Tìm nguồn tốt hơn), Trace claims to the original context (Lần theo ngữ cảnh gốc).',
    url: 'https://hapgood.us/2019/06/19/sift-the-four-moves/',
    type: 'Học thuật'
  }
];

export const SAMPLE_CASES: { label: string; tag: string; data: SourceInputForm }[] = [
  {
    label: 'Bài báo Y tế chính thống (Có số liệu & trích dẫn chuyên môn)',
    tag: 'Mẫu tin cậy cao',
    data: {
      title: 'Bộ Y tế cảnh báo dịch sốt xuất huyết gia tăng tại các tỉnh phía Nam',
      sourceUrl: 'https://suckhoedoisong.vn/canh-bao-sot-xuat-huyet-mua-mua',
      publisherOrAuthor: 'Bác sĩ Nguyễn Văn Hải - Cục Y tế Dự phòng (Báo Sức khỏe & Đời sống)',
      publishDate: '15/10/2026',
      sourceType: 'Báo chí chính thống / Cơ quan ngôn luận Bộ Y tế',
      content: `Theo thông báo từ Cục Y tế Dự phòng (Bộ Y tế) ngày 15/10/2026, cả nước ghi nhận 28.500 ca mắc sốt xuất huyết trong 9 tháng đầu năm, trong đó khu vực miền Nam chiếm 62% tổng số ca. 

TS.BS Nguyễn Văn A, Phó Viện trưởng Viện Pasteur TP.HCM cho biết: "Thời tiết mưa ẩm kéo dài tạo điều kiện cho lăng quăng phát triển mạnh. Người dân cần chủ động diệt muỗi, đậy kín các dụng cụ chứa nước và đến ngay cơ sở y tế khi có dấu hiệu sốt cao liên tục trên 2 ngày."

Báo cáo dịch tễ học số 142/BC-DP của Bộ Y tế khuyến nghị người dân tuyệt đối không tự ý mua kháng sinh hoặc thuốc hạ sốt nhóm aspirin để điều trị do nguy cơ xuất huyết tiêu hóa. Người bệnh có thể liên hệ đường dây nóng của các bệnh viện nhiệt đới để được tư vấn phân tuyến kịp thời.`,
      additionalContext: 'Bài viết có đầy đủ số liệu thống kê từ báo cáo dịch tễ chính thức của Bộ Y tế và trích dẫn chuyên gia Viện Pasteur.'
    }
  },
  {
    label: 'Tin đồn giật gân trên Mạng xã hội (Bẫy clickbait, thuốc gia truyền)',
    tag: 'Mẫu cảnh báo sai lệch',
    data: {
      title: 'KINH HOÀNG: Khám phá bí mật loại lá cây vườn nhà tiêu diệt 100% tế bào ung thư sau 7 ngày!',
      sourceUrl: 'https://facebook.com/groups/suckhoevang-dongy-chualanh/posts/9918237',
      publisherOrAuthor: 'Trang "Thần Dược Tự Nhiên & Năng Lượng Vũ Trụ" (Ẩn danh)',
      publishDate: 'Vừa xong',
      sourceType: 'Mạng xã hội / Hội nhóm kín',
      content: `CHẤN ĐỘNG CẢ THẾ GIỚI MÀ CÁC BÁC SĨ TÂY Y ĐANG CỐ TÌNH GIẤU KÍN!

Bà con ơi chia sẻ gấp kẻo bài bị xóa! Ai đang bị ung thư giai đoạn cuối, tiểu đường, suy thận chỉ cần hái nắm lá cây này đun sôi uống mỗi sáng là khỏi dứt điểm 100% sau 7 ngày, không cần xạ trị tốn kém hàng trăm triệu.

Một giáo sư giấu tên tại Mỹ vừa tiết lộ công trình thế kỷ này. Rất nhiều người đã áp dụng và sống thọ hơn 100 tuổi. Hãy nhắn tin ngay vào số Zalo 090xxxxxxx để được gửi tặng cẩm nang miễn phí và thuốc gia truyền đời thứ 5! Đừng để các bệnh viện trục lợi từ sự đau đớn của gia đình bạn!`,
      additionalContext: 'Bài đăng sử dụng các từ ngữ kích động cảm xúc sợ hãi, bài xích y học chính thống, không có tên nhà khoa học cụ thể và kêu gọi liên hệ Zalo mua thuốc.'
    }
  },
  {
    label: 'Tin tức thời sự thiếu kiểm chứng chéo (Nguồn tin nội bộ mập mờ)',
    tag: 'Mẫu cần thận trọng',
    data: {
      title: 'Rò rỉ thông tin về việc một tập đoàn công nghệ lớn sắp phá sản',
      sourceUrl: 'https://diendan-taichinh-kinhte.xyz/threads/ro-ri-thong-tin-noi-bo',
      publisherOrAuthor: 'Thành viên ẩn danh "Investor_Pro"',
      publishDate: '12/10/2026',
      sourceType: 'Diễn đàn thảo luận / Blog cá nhân',
      content: `Hôm qua mình vừa ngồi cà phê với một anh bạn làm ở ban tài chính của Tập đoàn X. Anh ấy tiết lộ rằng tình hình dòng tiền của công ty đang cực kỳ bi đát và ban lãnh đạo đang chuẩn bị nộp đơn xin phá sản vào tuần tới.

Các khoản nợ trái phiếu đáo hạn quý 4 không có khả năng thanh toán. Anh em nào đang nắm giữ cổ phiếu mã này thì cân nhắc bán tháo ngay kẻo mất trắng. Hiện các tờ báo lớn chưa dám đăng vì vướng quan hệ truyền thông, nhưng nguồn tin này là chuẩn 100% từ người trong cuộc.`,
      additionalContext: 'Thông tin có ảnh hưởng lớn tới tài chính và uy tín doanh nghiệp nhưng chỉ dựa trên lời kể của một cá nhân ẩn danh trên diễn đàn, không có chứng từ tài chính hay phản hồi của doanh nghiệp.'
    }
  }
];

export const VERIFICATION_GUIDE_STEPS = [
  {
    step: 1,
    title: 'Dừng lại & Đánh giá cảm xúc ban đầu (Stop)',
    desc: 'Nếu thông tin làm bạn cảm thấy quá tức giận, quá sợ hãi hoặc quá phấn khích, hãy chậm lại. Các chiến dịch tin giả thường cố tình thao túng cảm xúc cực đoan để thúc đẩy hành vi chia sẻ vội vã.'
  },
  {
    step: 2,
    title: 'Điều tra danh tính nguồn xuất bản (Investigate the Source)',
    desc: 'Kiểm tra trang web: Có mục "Giới thiệu" (About Us) rõ ràng không? Tên miền có giả mạo cơ quan uy tín không (.vn, .edu.vn, .gov.vn so với các đuôi lạ .xyz, .top, .buzz)? Tác giả có hồ sơ khoa học/nghề nghiệp thật không?'
  },
  {
    step: 3,
    title: 'Đọc ngang & Đối chiếu độc lập (Lateral Reading)',
    desc: 'Không chỉ đọc nội dung trên chính trang đó. Hãy mở tab mới và tìm kiếm từ khóa sự kiện kèm theo tên các cơ quan báo chí chính thống hoặc tổ chức chuyên môn xem họ có đưa tin hay không.'
  },
  {
    step: 4,
    title: 'Lần theo nguồn gốc dữ liệu (Trace Claims to Context)',
    desc: 'Nếu bài viết trích dẫn "theo nghiên cứu khoa học" hoặc "theo Bộ Y tế", hãy truy tìm văn bản gốc, mã số DOI của nghiên cứu hoặc thông cáo báo chí chính thức để xem có bị cắt xén câu chữ hay không.'
  },
  {
    step: 5,
    title: 'Tra cứu công cụ kiểm chứng chuyên dụng (Fact-Check Tools)',
    desc: 'Sử dụng Google Fact Check Explorer, cổng Tingia.gov.vn hoặc tìm kiếm tên tác giả trên Google Scholar để xác minh tính chuẩn xác trước khi trích dẫn vào đề tài nghiên cứu.'
  }
];
