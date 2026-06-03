package com.example.interviewai.modules.answer.controller;

import com.example.interviewai.common.CurrentUser;
import com.example.interviewai.modules.answer.dto.SubmitAnswerRequest;
import com.example.interviewai.modules.answer.dto.SubmitAnswerResponse;
import com.example.interviewai.modules.answer.service.AnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<SubmitAnswerResponse> submit(@Valid @RequestBody SubmitAnswerRequest request) {
        return ResponseEntity.ok(answerService.submit(request, currentUser.get()));
    }
}
