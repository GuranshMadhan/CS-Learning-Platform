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
    private String portalCode;

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
        if (this.portalCode == null || this.portalCode.isEmpty()) {
            this.portalCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }
    }

}
