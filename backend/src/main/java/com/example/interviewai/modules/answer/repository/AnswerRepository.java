package com.example.interviewai.modules.answer.repository;

import com.example.interviewai.modules.answer.model.Answer;
import com.example.interviewai.modules.question.model.Question;
import com.example.interviewai.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {
    Optional<Answer> findByIdAndUser(UUID id, User user);

    Optional<Answer> findByQuestionAndUser(Question question, User user);

    List<Answer> findByUser(User user);
}
