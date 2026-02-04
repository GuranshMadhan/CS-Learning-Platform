package madhan.guransh.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Getter // <--- CHANGED FROM @Data
@Setter // <--- CHANGED FROM @Data
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String portalCode;

    // --- RELATIONSHIPS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    @JsonIgnore
    private User teacher;

    @ManyToMany(mappedBy = "enrolledClassrooms", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<User> students = new ArrayList<>();

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Quiz> quizzes = new ArrayList<>();

    @PrePersist
    protected void generateCode() {
        if (this.portalCode == null || this.portalCode.isEmpty()) {
            this.portalCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }
    }
}