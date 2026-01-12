package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.AuthenticationRequest;
import madhan.guransh.backend.dto.AuthenticationResponse;
import madhan.guransh.backend.dto.RegisterRequest;
import madhan.guransh.backend.enums.Roles;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import madhan.guransh.backend.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final ClassroomRepository classroomRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Create and Save the User
        var user = User.builder()
                .username(request.getFirstname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Roles.USER) // Everyone starts as USER
                .build();

        var savedUser = userRepository.save(user);

        // 2. Logic: Join Existing Group
        if (request.getPortalCode() != null && !request.getPortalCode().isEmpty()) {
            var classroom = classroomRepository.findByPortalCode(request.getPortalCode())
                    .orElseThrow(() -> new RuntimeException("Invalid Portal Code"));

            // Add to students list
            classroom.getStudents().add(savedUser);
            classroomRepository.save(classroom);
        }

        // 3. Logic: Create New Group
        else if (request.getGroupName() != null && !request.getGroupName().isEmpty()) {
            Classroom newClassroom = new Classroom();
            newClassroom.setName(request.getGroupName());
            newClassroom.setTeacher(savedUser); // The creator is the Admin/Teacher
            classroomRepository.save(newClassroom);
        }

        // 4. Generate Token
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // 1. Authenticate the user credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. If we get here, the user is valid. Now we find them in the DB.
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(); 

        // 3. Generate a fresh token
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}