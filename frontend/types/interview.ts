export type InterviewRole =
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Full Stack Engineer"
  | "Data Scientist"
  | "Product Manager"
  | "DevOps Engineer";

export type InterviewLevel = "Junior" | "Mid-level" | "Senior" | "Staff";

export type InterviewType =
  | "Behavioral"
  | "Technical"
  | "System Design"
  | "Mixed";

export interface InterviewConfigDto {
  role: InterviewRole;
  level: InterviewLevel;
  type: InterviewType;
}

export interface InterviewQuestionDto {
  id: string;
  prompt: string;
  category: string;
  expectedDurationSeconds: number;
}

export interface InterviewSessionDto {
  id: string;
  role: string;
  level: string;
  type: string;
  questions: InterviewQuestionDto[];
  createdAt: string;
}

export interface RecentInterviewDto {
  id: string;
  role: string;
  type: string;
  score: number;
  createdAt: string;
}

export interface DashboardDto {
  fullName: string;
  totalInterviews: number;
  averageScore: number;
  weakAreas: string[];
  strongAreas: string[];
  recentInterviews: RecentInterviewDto[];
}
