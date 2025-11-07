

export interface AnalysisConfidence {
  productIdentification: string;
  ocrAccuracy: string;
  dataSource: string;
}

export interface Component {
  component: string;
  value: string;
  severity: string;
  penalty?: number;
  bonus?: number;
  description: string;
}

export interface AnalysisResult {
  productName: string;
  productCategory: string;
  analysisConfidence: AnalysisConfidence;
  overallScore: number;
  verdict: string;
  summary: string;
  negatives: Component[];
  positives: Component[];
  questionable: Component[];
}