package com.example.interviewai.modules.feedback.dto;

import com.example.interviewai.modules.feedback.model.Feedback;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record FeedbackResponse(
        UUID answerId,
        UUID sessionId,
        BigDecimal score,
        BigDecimal overallScore,
        List<String> strengths,
        List<String> weaknesses,
        String improvedAnswer,
        String recommendation,
        List<String> recommendations
) {
    public static FeedbackResponse from(Feedback feedback) {
        List<String> recommendations = splitLines(feedback.getRecommendation());
        return new FeedbackResponse(
                feedback.getAnswer().getId(),
                feedback.getAnswer().getInterview().getId(),
                feedback.getScore(),
                feedback.getScore().multiply(BigDecimal.TEN),
                splitLines(feedback.getStrengths()),
                splitLines(feedback.getWeaknesses()),
                feedback.getImprovedAnswer(),
                feedback.getRecommendation(),
                recommendations
        );
    }

    private static List<String> splitLines(String value) {
        return Arrays.stream(value.split("\\n"))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .toList();
    }
}
