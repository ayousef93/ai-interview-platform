export interface FeedbackDto {
  sessionId: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  recommendations: string[];
}
