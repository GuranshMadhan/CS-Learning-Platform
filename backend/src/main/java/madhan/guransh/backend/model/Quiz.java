package madhan.guransh.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    // XP bonus for completing the whole quiz
    private int completionBonusXp;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Classroom classroom;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Question> questions;
}