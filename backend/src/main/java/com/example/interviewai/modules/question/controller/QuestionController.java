package com.example.interviewai.modules.question.controller;

import com.example.interviewai.common.CurrentUser;
import com.example.interviewai.modules.question.dto.QuestionResponse;
import com.example.interviewai.modules.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interviews/{interviewId}/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> list(@PathVariable UUID interviewId) {
        return ResponseEntity.ok(questionService.listByInterview(interviewId, currentUser.get()));
    }
}
