package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.services.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // 1. Get Infinite Mode Questions
    // GET /api/v1/questions/infinite
    @GetMapping("/infinite")
    public ResponseEntity<List<Question>> getInfiniteQuestions() {
        return ResponseEntity.ok(questionService.getInfiniteModeQuestions());
    }

    // 2. Submit an Answer
    // POST /api/v1/questions/{id}/submit
    // Body: { "answer": "Paris" }
    @PostMapping("/{questionId}/submit")
    public ResponseEntity<String> submitAnswer(
            @PathVariable Long questionId,
            @RequestBody Map<String, String> payload, // Simple JSON wrapper
            @AuthenticationPrincipal User user // <--- Gets user from Token
    ) {
        String userAnswer = payload.get("answer");

        boolean correct = questionService.submitAnswer(user.getId(), questionId, userAnswer);

        if (correct) {
            return ResponseEntity.ok("Correct! XP Awarded.");
        } else {
            return ResponseEntity.badRequest().body("Incorrect.");
        }
    }
}
