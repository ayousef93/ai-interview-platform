package com.example.interviewai.modules.openai.dto;

import java.util.List;

/**
 * A generated multiple-choice interview question.
 *
 * @param prompt        the question text
 * @param options       the answer choices
 * @param correctOption zero-based index into {@code options} of the correct choice
 */
public record GeneratedQuestion(String prompt, List<String> options, int correctOption) {
}
