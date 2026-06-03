package com.example.interviewai.modules.interview.controller;

import com.example.interviewai.common.CurrentUser;
import com.example.interviewai.modules.feedback.service.FeedbackService;
import com.example.interviewai.modules.interview.dto.CreateInterviewRequest;
import com.example.interviewai.modules.interview.dto.DashboardResponse;
import com.example.interviewai.modules.interview.dto.InterviewResponse;
import com.example.interviewai.modules.interview.dto.InterviewSessionResponse;
import com.example.interviewai.modules.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final FeedbackService feedbackService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<InterviewSessionResponse> create(@Valid @RequestBody CreateInterviewRequest request) {
        return ResponseEntity.ok(interviewService.create(request, currentUser.get()));
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> list() {
        return ResponseEntity.ok(interviewService.list(currentUser.get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewSessionResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(interviewService.get(id, currentUser.get()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboardAlias() {
        var user = currentUser.get();
        return ResponseEntity.ok(interviewService.dashboard(user, feedbackService.averageScore(user)));
    }
}
