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

    private String join(List<String> values) {
        return String.join("\n", values == null ? List.of() : values);
    }
}
