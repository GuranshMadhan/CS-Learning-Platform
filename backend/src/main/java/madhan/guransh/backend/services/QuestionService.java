package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.QuestionRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    /**
     * INFINITE MODE: Get 10 random global questions
     */
    public List<Question> getInfiniteModeQuestions() {
        // 1. Get ALL global questions
        List<Question> allQuestions = questionRepository.findAllRandomGlobalQuestions();

        // --- DEBUGGING BLOCK ---
        System.out.println("=================================");
        System.out.println("DEBUG: Database returned " + allQuestions.size() + " questions.");
        if (!allQuestions.isEmpty()) {
            System.out.println("DEBUG: First question is: " + allQuestions.get(0).getContent());
        } else {
            System.out.println("DEBUG: The list is EMPTY! Query issue.");
        }
        System.out.println("=================================");
        // -----------------------

        Collections.shuffle(allQuestions);

        return allQuestions.stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * QUIZ MODE: Get all questions for a specific quiz
     */
    public List<Question> getQuestionsForQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }


    /**
     * CORE MECHANIC: Check answer and award XP
     * Returns true if correct, false if incorrect.
     */
    public boolean submitAnswer(Long userId, Long questionId, String userAnswer) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // 1. Always increment attempt count
        user.setTotalQuestionsAttempted(user.getTotalQuestionsAttempted() + 1);

        // 2. Check correctness
        boolean isCorrect = question.getCorrectAnswer().trim().equalsIgnoreCase(userAnswer.trim());

        if (isCorrect) {
            user.setXp(user.getXp() + question.getXpValue());
            user.setTotalCorrectAnswers(user.getTotalCorrectAnswers() + 1);
        }

        userRepository.save(user); // Save attempts and XP
        return isCorrect;
    }

    /**
     * ADMIN/TEACHER: Create a new question
     */
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
}
