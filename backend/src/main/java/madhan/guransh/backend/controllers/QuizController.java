package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Question;
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

    // 3. Add a Question to a Quiz
    @PostMapping("/add-question")
    public ResponseEntity<Question> addQuestion(
            @RequestBody Map<String, Object> payload
    ) {
        Long quizId = Long.parseLong(payload.get("quizId").toString());
        String content = (String) payload.get("content");
        String op1 = (String) payload.get("option1");
        String op2 = (String) payload.get("option2");
        String op3 = (String) payload.get("option3");
        String op4 = (String) payload.get("option4");
        String answer = (String) payload.get("correctAnswer");

        return ResponseEntity.ok(
                quizService.addQuestionToQuiz(quizId, content, op1, op2, op3, op4, answer)
        );
    }

    // 4. Submit a Quiz
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<String> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<String, String> answers,
            @AuthenticationPrincipal User student
    ) {
        int xpEarned = quizService.submitQuiz(quizId, answers, student);
        return ResponseEntity.ok("Quiz Submitted! You earned " + xpEarned + " XP.");
    }
}