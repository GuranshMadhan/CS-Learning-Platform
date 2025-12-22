package madhan.guransh.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.util.List;


@Entity
@Table(name = "users")
@Data
public class User {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;
    private int xp = 0;

    // if the user is a teacher
    private List<Classroom> teachingClassrooms;

    // if the user is a student
    private List<Classroom> enrolledClassrooms;
}
