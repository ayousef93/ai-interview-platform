package com.example.interviewai.modules.feedback.controller;

import com.example.interviewai.common.CurrentUser;
import com.example.interviewai.modules.feedback.dto.FeedbackResponse;
import com.example.interviewai.modules.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final CurrentUser currentUser;

    @GetMapping("/{answerId}")
    public ResponseEntity<FeedbackResponse> get(@PathVariable UUID answerId) {
        return ResponseEntity.ok(feedbackService.getOrCreate(answerId, currentUser.get()));
    }
}
