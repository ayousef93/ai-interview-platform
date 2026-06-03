package com.example.interviewai.modules.interview.dto;

import com.example.interviewai.modules.interview.model.Interview;
import com.example.interviewai.modules.question.dto.QuestionResponse;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record InterviewSessionResponse(
        UUID id,
        String role,
        String roleName,
        String level,
        String type,
        List<QuestionResponse> questions,
        OffsetDateTime createdAt
) {
    public static InterviewSessionResponse from(Interview interview, List<QuestionResponse> questions) {
        return new InterviewSessionResponse(
                interview.getId(),
                interview.getRoleName(),
                interview.getRoleName(),
                interview.getLevel(),
                interview.getType().name(),
                questions,
                interview.getCreatedAt()
        );
    }
}
