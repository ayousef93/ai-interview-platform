package com.example.interviewai.modules.feedback.repository;

import com.example.interviewai.modules.answer.model.Answer;
import com.example.interviewai.modules.feedback.model.Feedback;
import com.example.interviewai.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Optional<Feedback> findByAnswer(Answer answer);

    @Query("select avg(f.score) from Feedback f where f.answer.user = :user")
    BigDecimal averageScoreByUser(User user);
}
