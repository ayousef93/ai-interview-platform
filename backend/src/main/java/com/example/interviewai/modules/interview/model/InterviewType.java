package com.example.interviewai.modules.interview.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum InterviewType {
    TECHNICAL,
    BEHAVIORAL,
    SYSTEM_DESIGN;

    @JsonCreator
    public static InterviewType from(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase();
        return InterviewType.valueOf(normalized);
    }
}
