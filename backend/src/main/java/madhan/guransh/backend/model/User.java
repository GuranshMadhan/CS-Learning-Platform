package madhan.guransh.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import madhan.guransh.backend.enums.Roles;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Builder
@Table(name = "users")
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Roles role;

    private int xp = 0;

    // if the user is a teacher
    @OneToMany(mappedBy = "teacher")
    @JsonIgnore
    private List<Classroom> teachingClassrooms;

    // if the user is a student
    @ManyToMany(mappedBy = "students")
    @JsonIgnore
    private List<Classroom> enrolledClassrooms;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(Roles.USER.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }
}
