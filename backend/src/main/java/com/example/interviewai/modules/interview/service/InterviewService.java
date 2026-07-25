package com.example.interviewai.modules.interview.service;

import com.example.interviewai.exception.NotFoundException;
import com.example.interviewai.modules.interview.dto.CreateInterviewRequest;
import com.example.interviewai.modules.interview.dto.DashboardResponse;
import com.example.interviewai.modules.interview.dto.InterviewResponse;
import com.example.interviewai.modules.interview.dto.InterviewSessionResponse;
import com.example.interviewai.modules.interview.model.Interview;
import com.example.interviewai.modules.interview.model.InterviewStatus;
import com.example.interviewai.modules.interview.repository.InterviewRepository;
import com.example.interviewai.modules.openai.service.OpenAiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.interviewai.modules.question.dto.QuestionResponse;
import com.example.interviewai.modules.question.model.Question;
import com.example.interviewai.modules.question.repository.QuestionRepository;
import com.example.interviewai.modules.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public InterviewSessionResponse create(CreateInterviewRequest request, User user) {
        Interview interview = interviewRepository.save(Interview.builder()
                .user(user)
                .roleName(request.roleName())
                .level(request.level())
                .type(request.type())
                .status(InterviewStatus.STARTED)
                .build());

        AtomicInteger position = new AtomicInteger(1);
        List<Question> questions = openAiService.generateQuestions(request.roleName(), request.level(), request.type())
                .stream()
                .map(generated -> Question.builder()
                        .interview(interview)
                        .prompt(generated.prompt())
                        .options(writeOptions(generated.options()))
                        .correctOption(generated.correctOption())
                        .position(position.getAndIncrement())
                        .build())
                .toList();
        questionRepository.saveAll(questions);
        return InterviewSessionResponse.from(interview, questions.stream().map(QuestionResponse::from).toList());
    }

    private String writeOptions(List<String> options) {
        try {
            return objectMapper.writeValueAsString(options == null ? List.of() : options);
        } catch (Exception ex) {
            return "[]";
        }
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> list(User user) {
        return interviewRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(InterviewResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponse get(UUID id, User user) {
        Interview interview = findOwned(id, user);
        List<QuestionResponse> questions = questionRepository.findByInterviewOrderByPositionAsc(interview)
                .stream()
                .map(QuestionResponse::from)
                .toList();
        return InterviewSessionResponse.from(interview, questions);
    }

    @Transactional(readOnly = true)
    public Interview findOwned(UUID id, User user) {
        return interviewRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NotFoundException("Interview not found"));
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard(User user, BigDecimal averageScore) {
        List<InterviewResponse> recent = list(user).stream().limit(5).toList();
        BigDecimal score = averageScore == null ? BigDecimal.ZERO : averageScore.setScale(1, RoundingMode.HALF_UP);
        return new DashboardResponse(
                user.getFullName(),
                interviewRepository.countByUser(user),
                score,
                "System Design",
                List.of("System Design"),
                List.of("Communication", "Problem Solving"),
                recent
        );
    }
}
