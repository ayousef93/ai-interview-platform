package com.example.interviewai.modules.answer.dto;

import java.util.UUID;

public record SubmitAnswerResponse(
        UUID answerId,
        boolean accepted,
        String message
) {
}
