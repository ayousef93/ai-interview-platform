import { apiFetch } from "@/lib/api-client";
import type { SubmitAnswerRequest, SubmitAnswerResponse } from "@/types/answer";

export const answerService = {
  submitAnswer(payload: SubmitAnswerRequest) {
    return apiFetch<SubmitAnswerResponse>("/api/answers", {
      method: "POST",
      body: payload
    });
  }
};
