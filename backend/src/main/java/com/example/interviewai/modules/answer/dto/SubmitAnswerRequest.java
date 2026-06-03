package com.example.interviewai.modules.answer.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SubmitAnswerRequest(
        @NotNull UUID sessionId,
        @NotNull UUID questionId,
        @NotBlank String answer,
        @Min(0) int timeSpentSeconds
) {
}
