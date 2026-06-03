package com.example.interviewai.modules.interview.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        String fullName,
        long totalInterviews,
        BigDecimal averageScore,
        String weakArea,
        List<String> weakAreas,
        List<String> strongAreas,
        List<InterviewResponse> recentInterviews
) {
}
