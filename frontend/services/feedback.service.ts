import { apiFetch } from "@/lib/api-client";
import type { FeedbackDto } from "@/types/feedback";

export const feedbackService = {
  getFeedback(answerId: string) {
    return apiFetch<FeedbackDto>(`/api/feedback/${answerId}`);
  }
};
