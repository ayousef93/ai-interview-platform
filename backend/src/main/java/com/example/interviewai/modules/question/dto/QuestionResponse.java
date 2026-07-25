package com.example.interviewai.modules.question.dto;

import com.example.interviewai.modules.question.model.Question;

import java.util.List;
import java.util.UUID;

public record QuestionResponse(
        UUID id,
        String prompt,
        String category,
        int expectedDurationSeconds,
        int position,
        List<String> options
) {
    // Note: the correct option index is intentionally NOT exposed to the client to prevent cheating.
    public static QuestionResponse from(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getPrompt(),
                question.getInterview().getType().name(),
                180,
                question.getPosition(),
                question.optionList()
        );
    }
}
