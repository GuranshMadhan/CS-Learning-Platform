package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.QuizDTO; // <--- CHECK THIS IMPORT
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.services.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<QuizDTO> createQuiz(
                                               @RequestBody Map<String, Object> payload,
                                               @AuthenticationPrincipal User teacher
    ) {
        Long classroomId = Long.parseLong(payload.get("classroomId").toString());
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");

        return ResponseEntity.ok(
                quizService.createQuiz(classroomId, title, description, teacher)
        );
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<QuizDTO>> getClassroomQuizzes(
                                                              @PathVariable Long classroomId,
                                                              @AuthenticationPrincipal User student
    ) {
        return ResponseEntity.ok(quizService.getQuizzesForClassroom(classroomId, student));
    }

    @PostMapping("/add-question")
    public ResponseEntity<Question> addQuestion(@RequestBody Map<String, Object> payload) {
        Long quizId = Long.parseLong(payload.get("quizId").toString());
        String content = (String) payload.get("content");
        String answer = (String) payload.get("correctAnswer");
        String type = (String) payload.get("type");

        // Extract Options List
        List<String> options = (List<String>) payload.get("options");

        return ResponseEntity.ok(
                quizService.addQuestionToQuiz(quizId, content, options, answer, type)
        );
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<String> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<String, String> answers,
            @AuthenticationPrincipal User student
    ) {
        try {
            int xpEarned = quizService.submitQuiz(quizId, answers, student);
            return ResponseEntity.ok("Quiz Submitted! You earned " + xpEarned + " XP.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET single quiz endpoint (for Editor/Taking)
    @GetMapping("/{id}")
    public ResponseEntity<madhan.guransh.backend.model.Quiz> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    // DELETE endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok("Quiz deleted.");
    }

    @GetMapping("/global")
    public ResponseEntity<List<QuizDTO>> getGlobalQuizzes(@AuthenticationPrincipal User student) {
        return ResponseEntity.ok(quizService.getGlobalQuizzes(student));
    }
}