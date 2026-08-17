package com.qoap.quiz.models;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.qoap.quiz.enums.CompletionStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID studentId;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(length = 3)
    private Integer score;

    @Column(length = 5)
    private Double percentage;

    @Column(length = 3)
    private Integer correctAnswers;

    @Column(length = 3)
    private Integer unAnswered;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL)
    private Set<Answer> answers;

    private Duration timeSpent;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CompletionStatus status = CompletionStatus.IN_PROGRESS;

    @CreationTimestamp
    private LocalDateTime attemptTime;

}
