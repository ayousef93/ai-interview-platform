package com.example.interviewai.modules.answer.service;

import com.example.interviewai.exception.BadRequestException;
import com.example.interviewai.exception.ConflictException;
import com.example.interviewai.exception.NotFoundException;
import com.example.interviewai.modules.answer.dto.SubmitAnswerRequest;
import com.example.interviewai.modules.answer.dto.SubmitAnswerResponse;
import com.example.interviewai.modules.answer.model.Answer;
import com.example.interviewai.modules.answer.repository.AnswerRepository;
import com.example.interviewai.modules.interview.service.InterviewService;
import com.example.interviewai.modules.question.model.Question;
import com.example.interviewai.modules.question.repository.QuestionRepository;
import com.example.interviewai.modules.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final InterviewService interviewService;

    @Transactional
    public SubmitAnswerResponse submit(SubmitAnswerRequest request, User user) {
        var interview = interviewService.findOwned(request.sessionId(), user);
        Question question = questionRepository.findByIdAndInterview(request.questionId(), interview)
                .orElseThrow(() -> new NotFoundException("Question not found"));
        if (request.answer().isBlank()) {
            throw new BadRequestException("Answer cannot be empty");
        }
        if (answerRepository.findByQuestionAndUser(question, user).isPresent()) {
            throw new ConflictException("Answer already submitted for this question");
        }
        Answer answer = answerRepository.save(Answer.builder()
                .user(user)
                .interview(interview)
                .question(question)
                .answerText(request.answer().trim())
                .timeSpentSeconds(request.timeSpentSeconds())
                .build());
        return new SubmitAnswerResponse(answer.getId(), true, "Answer submitted");
    }

    @Transactional(readOnly = true)
    public Answer findOwned(UUID answerId, User user) {
        return answerRepository.findByIdAndUser(answerId, user)
                .orElseThrow(() -> new NotFoundException("Answer not found"));
    }
}
