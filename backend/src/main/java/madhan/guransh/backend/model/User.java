package madhan.guransh.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.util.List;


@Table(name = "users")
@Data
@Entity
public class User {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String email;
    private String password;
    private String role;
    private int xp = 0;

    // if the user is a teacher
    @OneToMany(mappedBy = "teacher")
    private List<Classroom> teachingClassrooms;

    // if the user is a student
    @ManyToMany(mappedBy = "students")
    private List<Classroom> enrolledClassrooms;
}
