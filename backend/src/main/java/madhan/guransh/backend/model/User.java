package madhan.guransh.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import madhan.guransh.backend.enums.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // Stores "Madhan"

    @Column(unique = true)
    private String email;    // Stores "madhan@gmail.com"

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default // Fixes the "Null Role" crash
    private Role role = Role.USER;

    @Builder.Default
    private int xp = 0;

    @Builder.Default
    private int totalCorrectAnswers = 0;

    // --- RELATIONSHIPS ---

    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Classroom> teachingClassrooms = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_enrolled_classrooms",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "enrolled_classrooms_id")
    )
    @JsonIgnore
    @Builder.Default
    private List<Classroom> enrolledClassrooms = new ArrayList<>();

    // --- CRITICAL FIX: UserDetails Logic ---

    // 1. Force the system to use EMAIL as the identifier
    @Override
    public String getUsername() {
        return email;
    }

    // 2. Helper to get the actual display name if needed
    public String getDisplayName() {
        return username;
    }

    @Builder.Default
    private int totalQuestionsAttempted = 0;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) return List.of(new SimpleGrantedAuthority("USER"));
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}