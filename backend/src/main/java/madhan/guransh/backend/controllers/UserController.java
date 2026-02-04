package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.ClassroomDTO;
import madhan.guransh.backend.dto.UserDTO;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // GET /api/v1/user/me
    @GetMapping("/me")
    @Transactional(readOnly = true) // <--- CRITICAL FIX: Keeps DB connection open
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User principal) {
        // 1. Reload User from DB to ensure it's "Attached" (prevents LazyInitException)
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Convert to Safe DTO
        return ResponseEntity.ok(mapToDTO(user));
    }

    // GET /api/v1/user/leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        // For leaderboard, we can return the simple list or map to DTOs too
        // Keeping it simple for now, but ensure UserRepository exists
        return ResponseEntity.ok(userRepository.findTop10ByOrderByXpDesc());
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        // Stats
        dto.setXp(user.getXp());
        dto.setTotalCorrectAnswers(user.getTotalCorrectAnswers());
        dto.setTotalQuestionsAttempted(user.getTotalQuestionsAttempted());

        // 1. Calculate Rank
        int rank = userRepository.calculateRank(user.getXp());
        dto.setRank(rank);

        // 2. Calculate Accuracy (Avoid divide by zero)
        if (user.getTotalQuestionsAttempted() > 0) {
            double acc = (double) user.getTotalCorrectAnswers() / user.getTotalQuestionsAttempted() * 100;
            dto.setAccuracy(Math.round(acc * 10.0) / 10.0); // Round to 1 decimal
        } else {
            dto.setAccuracy(0.0);
        }

        // ... existing classroom mapping code ...
        return dto;
    }
}