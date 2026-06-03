package com.example.interviewai.modules.interview.dto;

import com.example.interviewai.modules.interview.model.InterviewType;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateInterviewRequest(
        @JsonAlias("role")
        @NotBlank @Size(max = 120) String roleName,
        @NotBlank @Size(max = 80) String level,
        @NotNull InterviewType type
) {
}
