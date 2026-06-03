export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
  timeSpentSeconds: number;
}

export interface SubmitAnswerResponse {
  answerId: string;
  accepted: boolean;
  message?: string;
}
