package com.example.interviewai.modules.openai.dto;

import java.math.BigDecimal;
import java.util.List;

public record OpenAiFeedbackResult(
        BigDecimal score,
        List<String> strengths,
        List<String> weaknesses,
        String improvedAnswer,
        String recommendation
) {
}
