package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.AuthenticationRequest;
import madhan.guransh.backend.dto.AuthenticationResponse;
import madhan.guransh.backend.dto.RegisterRequest;
import madhan.guransh.backend.enums.Roles;
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
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // TODO: Inject GroupService here later when we implement Portal Codes
    // private final GroupService groupService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .email(request.getEmail())
                .username(request.getFirstname())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Roles.USER) // Default role
                .build();

        // 2. Handle Portal Code Logic (Placeholder)
        if (request.getPortalCode() != null && !request.getPortalCode().isEmpty()) {
            // Logic: groupService.assignUserToGroup(user, request.getPortalCode());
            System.out.println("User is trying to join group: " + request.getPortalCode());
        }

        // 3. Save the user to the database
        repository.save(user);

        // 4. Generate the JWT token
        var jwtToken = jwtService.generateToken(user);

        // 5. Return the token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
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
                .orElseThrow(); // In a real app, handle this exception properly

        // 3. Generate a fresh token
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}