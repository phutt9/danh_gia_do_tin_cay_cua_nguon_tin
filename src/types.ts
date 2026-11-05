export interface CriterionResult {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  assessment: string;
  strengths: string[];
  weaknesses: string[];
}

export interface EvaluationResultData {
  overallScore: number;
  verdict: 'Rất cao' | 'Đáng tin cậy' | 'Trung bình / Cần thận trọng' | 'Kém tin cậy / Nguy cơ sai lệch' | string;
  executiveSummary: string;
  criteriaAnalysis: CriterionResult[];
  redFlags: string[];
  missingDataNotes: string[];
  verificationChecklist: string[];
}

export interface FullEvaluationResponse {
  success: boolean;
  evaluatedAt: string;
  sourceMetadata: {
    title: string;
    sourceUrl: string;
    publisherOrAuthor: string;
    publishDate: string;
    sourceType: string;
  };
  result: EvaluationResultData;
}

export interface SourceInputForm {
  title: string;
  sourceUrl: string;
  publisherOrAuthor: string;
  publishDate: string;
  sourceType: string;
  content: string;
  additionalContext: string;
}

export interface StudentProfile {
  fullName: string;
  studentId: string;
  groupName: string;
  internshipTopic: string;
  supervisor: string;
  university: string;
  notes: string;
}

export interface ReferenceDocument {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  url: string;
  type: 'Học thuật' | 'Báo chí & Kiểm chứng' | 'Tiêu chuẩn quốc tế' | 'Quy chuẩn Việt Nam';
}
