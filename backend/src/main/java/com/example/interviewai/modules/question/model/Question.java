package com.example.interviewai.modules.question.model;

import com.example.interviewai.modules.interview.model.Interview;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Transient;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Column(nullable = false)
    private int position;

    /** JSON array of answer choices for multiple-choice questions. Null for free-text questions. */
    @Column(columnDefinition = "TEXT")
    private String options;

    /** Zero-based index into {@link #options} of the correct choice. Null for free-text questions. */
    @Column(name = "correct_option")
    private Integer correctOption;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    private static final ObjectMapper OPTIONS_MAPPER = new ObjectMapper();

    /** Parsed list of choices, or an empty list for free-text questions. */
    @Transient
    public List<String> optionList() {
        if (options == null || options.isBlank()) {
            return List.of();
        }
        try {
            return OPTIONS_MAPPER.readerForListOf(String.class).readValue(options);
        } catch (Exception ex) {
            return List.of();
        }
    }

    @Transient
    public boolean isMultipleChoice() {
        return !optionList().isEmpty() && correctOption != null;
    }
}
