package com.example.interviewai.modules.question.repository;

import com.example.interviewai.modules.interview.model.Interview;
import com.example.interviewai.modules.question.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByInterviewOrderByPositionAsc(Interview interview);

    Optional<Question> findByIdAndInterview(UUID id, Interview interview);
}
