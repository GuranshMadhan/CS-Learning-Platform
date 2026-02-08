package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.QuizDTO;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.Quiz;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.QuizRepository;
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
    private final QuizRepository quizRepository;

    // 1. Create Quiz (Now returns DTO)
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

    // 2. Get Quizzes (Now returns List<DTO>)
    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<QuizDTO>> getClassroomQuizzes(@PathVariable Long classroomId) {
        return ResponseEntity.ok(quizService.getQuizzesForClassroom(classroomId));
    }

    // 3. Add Question
    @PostMapping("/add-question")
    public ResponseEntity<Question> addQuestion(@RequestBody Map<String, Object> payload) {
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

    // 4. Submit Quiz
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<String> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<String, String> answers,
            @AuthenticationPrincipal User student
    ) {
        int xpEarned = quizService.submitQuiz(quizId, answers, student);
        return ResponseEntity.ok("Quiz Submitted! You earned " + xpEarned + " XP.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}