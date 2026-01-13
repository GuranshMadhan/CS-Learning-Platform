package madhan.guransh.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.services.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor // Creates constructor for final fields automatically
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // <--- MISSING IN YOUR CODE

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Check if token is present
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Pass the baton if no token!
            return;
        }

        // 2. Extract Token & Email
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt); // <--- You stopped here!

        // 3. Validation Logic (This entire block was missing)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user from Database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Check if token is valid
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create Auth Token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Update Security Context (Officially Logged In)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 4. CRITICAL: Continue the filter chain!
        // Without this line, the request stops here and never hits the Controller.
        filterChain.doFilter(request, response);
    }
}