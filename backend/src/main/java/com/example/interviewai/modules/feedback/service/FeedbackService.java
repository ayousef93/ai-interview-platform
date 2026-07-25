package com.example.interviewai.modules.feedback.service;

import com.example.interviewai.modules.answer.model.Answer;
import com.example.interviewai.modules.answer.service.AnswerService;
import com.example.interviewai.modules.feedback.dto.FeedbackResponse;
import com.example.interviewai.modules.feedback.model.Feedback;
import com.example.interviewai.modules.feedback.repository.FeedbackRepository;
import com.example.interviewai.modules.openai.dto.OpenAiFeedbackResult;
import com.example.interviewai.modules.openai.service.OpenAiService;
import com.example.interviewai.modules.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final AnswerService answerService;
    private final FeedbackRepository feedbackRepository;
    private final OpenAiService openAiService;

    @Transactional
    public FeedbackResponse getOrCreate(UUID answerId, User user) {
        Answer answer = answerService.findOwned(answerId, user);
        Feedback feedback = feedbackRepository.findByAnswer(answer)
                .orElseGet(() -> create(answer));
        return FeedbackResponse.from(feedback);
    }

    @Transactional(readOnly = true)
    public BigDecimal averageScore(User user) {
        return feedbackRepository.averageScoreByUser(user);
    }

    private Feedback create(Answer answer) {
        if (answer.getQuestion().isMultipleChoice()) {
            return feedbackRepository.save(gradeMultipleChoice(answer));
        }
        OpenAiFeedbackResult result = openAiService.generateFeedback(
                answer.getQuestion().getPrompt(),
                answer.getAnswerText()
        );
        return feedbackRepository.save(Feedback.builder()
                .answer(answer)
                .score(result.score())
                .strengths(join(result.strengths()))
                .weaknesses(join(result.weaknesses()))
                .improvedAnswer(result.improvedAnswer())
                .recommendation(result.recommendation())
                .build());
    }

    /** Deterministic grading for multiple-choice questions: 10 for the correct option, 0 otherwise. */
    private Feedback gradeMultipleChoice(Answer answer) {
        var question = answer.getQuestion();
        List<String> options = question.optionList();
        int correctIndex = question.getCorrectOption();
        String correctOption = correctIndex >= 0 && correctIndex < options.size() ? options.get(correctIndex) : "";
        boolean correct = correctOption.equalsIgnoreCase(answer.getAnswerText().trim());

        return Feedback.builder()
                .answer(answer)
                .score(correct ? BigDecimal.TEN : BigDecimal.ZERO)
                .strengths(correct ? "Correct choice" : "")
                .weaknesses(correct ? "" : "Selected an incorrect option")
                .improvedAnswer("Correct answer: " + correctOption)
                .recommendation(correct
                        ? "Well done — you selected the correct answer."
                        : "Review this topic. The correct answer was: " + correctOption)
                .build();
    }

    private String join(List<String> values) {
        return String.join("\n", values == null ? List.of() : values);
    }
}
