package madhan.guransh.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Data
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true)
    private String code;

    @ManyToOne
    private User teacher;

    @ManyToMany
    @JoinTable(
            name = "classroom_enrollments",
            joinColumns = @JoinColumn(name = "classroom_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<User> students;

    // auto generates a code on creation
    @PrePersist
    protected void generateCode() {
        if (this.code == null || this.code.isEmpty()) {
            this.code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }
    }

}
