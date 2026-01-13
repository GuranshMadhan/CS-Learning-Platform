package madhan.guransh.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import madhan.guransh.backend.enums.Difficulty;
import madhan.guransh.backend.enums.QuestionType;

import java.util.List;

@Entity
@Table(name = "questions")
@Data // <--- MAKE SURE THIS IS HERE
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private String correctAnswer;

    private int xpValue;

    // RELATIONSHIPS -----------------------------------

    // 1. If this is part of a specific Quiz (Classroom context)
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Quiz quiz;

    // 2. If this belongs to a specific classroom (Private)
    // If this is NULL, the question is "Global" and appears in Infinite Mode
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Classroom classroom;
}
