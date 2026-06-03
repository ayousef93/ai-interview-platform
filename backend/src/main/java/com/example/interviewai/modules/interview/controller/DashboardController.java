package com.example.interviewai.modules.interview.controller;

import com.example.interviewai.common.CurrentUser;
import com.example.interviewai.modules.feedback.service.FeedbackService;
import com.example.interviewai.modules.interview.dto.DashboardResponse;
import com.example.interviewai.modules.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InterviewService interviewService;
    private final FeedbackService feedbackService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<DashboardResponse> dashboard() {
        var user = currentUser.get();
        return ResponseEntity.ok(interviewService.dashboard(user, feedbackService.averageScore(user)));
    }
}
