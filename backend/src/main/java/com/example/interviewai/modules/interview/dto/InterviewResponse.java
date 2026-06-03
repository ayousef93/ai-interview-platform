package com.example.interviewai.modules.interview.dto;

import com.example.interviewai.modules.interview.model.Interview;
import com.example.interviewai.modules.interview.model.InterviewStatus;
import com.example.interviewai.modules.interview.model.InterviewType;

import java.time.OffsetDateTime;
import java.util.UUID;

public record InterviewResponse(
        UUID id,
        String role,
        String roleName,
        String level,
        InterviewType type,
        InterviewStatus status,
        int score,
        OffsetDateTime createdAt
) {
    public static InterviewResponse from(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getRoleName(),
                interview.getRoleName(),
                interview.getLevel(),
                interview.getType(),
                interview.getStatus(),
                0,
                interview.getCreatedAt()
        );
    }
}
