package com.example.interviewai.modules.interview.repository;

import com.example.interviewai.modules.interview.model.Interview;
import com.example.interviewai.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    List<Interview> findByUserOrderByCreatedAtDesc(User user);

    Optional<Interview> findByIdAndUser(UUID id, User user);

    long countByUser(User user);
}
