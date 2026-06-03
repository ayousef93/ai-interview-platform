package com.example.interviewai.modules.question.service;

import com.example.interviewai.modules.interview.service.InterviewService;
import com.example.interviewai.modules.question.dto.QuestionResponse;
import com.example.interviewai.modules.question.repository.QuestionRepository;
import com.example.interviewai.modules.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final InterviewService interviewService;
    private final QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public List<QuestionResponse> listByInterview(UUID interviewId, User user) {
        var interview = interviewService.findOwned(interviewId, user);
        return questionRepository.findByInterviewOrderByPositionAsc(interview)
                .stream()
                .map(QuestionResponse::from)
                .toList();
    }
}
