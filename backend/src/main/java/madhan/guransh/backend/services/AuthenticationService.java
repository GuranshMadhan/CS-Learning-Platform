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
        var user = User.builder()
                .username(request.getUsername()) // Save Display Name
                .email(request.getEmail())       // Save Login Email
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Roles.USER)
                .xp(0)
                .totalCorrectAnswers(0)
                .build();

        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), // Login with Email
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail()) // Look up by Email
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}