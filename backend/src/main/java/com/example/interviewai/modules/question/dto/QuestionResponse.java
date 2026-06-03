package com.example.interviewai.modules.question.dto;

import com.example.interviewai.modules.question.model.Question;

import java.util.UUID;

public record QuestionResponse(
        UUID id,
        String prompt,
        String category,
        int expectedDurationSeconds,
        int position
) {
    public static QuestionResponse from(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getPrompt(),
                question.getInterview().getType().name(),
                180,
                question.getPosition()
        );
    }
}
