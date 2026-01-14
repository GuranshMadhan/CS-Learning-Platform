package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Quiz;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.services.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
        System.out.println("✅ QUIZ CONTROLLER LOADED SUCCESSFULLY!");
    }

    @PostMapping("/create")
    public ResponseEntity<Quiz> createQuiz(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal User teacher
    ) {
        // 2. DEBUG PRINT (To confirm request hits the method)
        System.out.println("---------- QUIZ CREATE HIT ----------");
        System.out.println("User: " + (teacher != null ? teacher.getUsername() : "NULL"));

        Long classroomId = Long.parseLong(payload.get("classroomId").toString());
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");

        return ResponseEntity.ok(
                quizService.createQuiz(classroomId, title, description, teacher)
        );
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<Quiz>> getClassroomQuizzes(@PathVariable Long classroomId) {
        return ResponseEntity.ok(quizService.getQuizzesForClassroom(classroomId));
    }
}