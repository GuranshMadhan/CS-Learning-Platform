package madhan.guransh.backend.services;

import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private ClassroomRepository classroomRepository;

    private PasswordEncoder passwordEncoder;

    private User user;

    private static final String ADMIN_SECRET = "TEACHER-SECRET-123";

    public void registerUser(String username, String password, String role, String portalCode) {

        // 1. SECURITY CHECK: Are they trying to be a Teacher?
        if (role.equals("TEACHER")) {
            if (portalCode == null || !portalCode.equals(ADMIN_SECRET)) {
                throw new RuntimeException("Invalid Teacher Secret! You cannot register as staff.");
            }
            // If the code matches, we allow it.
            // (Teachers don't "join" classes, so we stop here).
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);
        newUser.setXp(0);

        // 2. LOGIC: If they are a Student, handle the Class Join Code
        if (role.equals("STUDENT") && portalCode != null && !portalCode.isEmpty()) {
            Optional<Classroom> classOpt = classroomRepository.findByPortalCode(portalCode);

            if (classOpt.isPresent()) {
                Classroom classroom = classOpt.get();

                // Link the student to the classroom
                // (Ideally, you add the user to the classroom's student list)
                // We will handle this link logic when we set up the ManyToMany save
            } else {
                // Ideally, throw an error or just warn them
                System.out.println("Warning: Student entered invalid class code.");
            }
        }

        userRepository.save(newUser);
    }
}
