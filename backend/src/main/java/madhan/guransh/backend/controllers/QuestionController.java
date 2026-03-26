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
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
        System.out.println("✅ QuestionController Loaded Successfully!");
    }

    @GetMapping("/infinite")
    public ResponseEntity<Object> getInfiniteQuestions() {
        System.out.println("---------- CONTROLLER HIT ----------");

        List<Question> questions = questionService.getInfiniteModeQuestions();

        System.out.println("CONTROLLER: Service returned " + (questions == null ? "NULL" : questions.size() + " items"));

        if (questions == null || questions.isEmpty()) {
            return ResponseEntity.ok("DEBUG: The list is EMPTY or NULL!");
        }

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{questionId}/submit")
    public ResponseEntity<String> submitAnswer(
            @PathVariable Long questionId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User user
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
