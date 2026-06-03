import { apiFetch } from "@/lib/api-client";
import type { DashboardDto, InterviewConfigDto, InterviewSessionDto } from "@/types/interview";

export const interviewService = {
  getDashboard() {
    return apiFetch<DashboardDto>("/api/dashboard");
  },

  startInterview(payload: InterviewConfigDto) {
    return apiFetch<InterviewSessionDto>("/api/interviews", {
      method: "POST",
      body: {
        roleName: payload.role,
        level: payload.level,
        type: mapInterviewType(payload.type)
      }
    });
  },

  getSession(sessionId: string) {
    return apiFetch<InterviewSessionDto>(`/api/interviews/${sessionId}`);
  }
};

function mapInterviewType(type: InterviewConfigDto["type"]) {
  if (type === "System Design") return "SYSTEM_DESIGN";
  if (type === "Behavioral") return "BEHAVIORAL";
  return "TECHNICAL";
}
