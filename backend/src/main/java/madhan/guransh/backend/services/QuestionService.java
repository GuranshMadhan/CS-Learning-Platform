package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.QuestionRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    /**
     * INFINITE MODE: Get 10 random global questions
     */
    public List<Question> getInfiniteModeQuestions() {
        // We fetch 10 at a time. You can change this number.
        return questionRepository.findRandomGlobalQuestions(10);
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
        // 1. Find the question (safely)
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // 2. Normalize answers (trim spaces, ignore case) to be forgiving
        // Assumes your database stores "correctAnswer" as the raw string value
        boolean isCorrect = question.getCorrectAnswer().trim().equalsIgnoreCase(userAnswer.trim());

        // 3. If correct, Award XP
        if (isCorrect) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Add the XP value of this specific question
            user.setXp(user.getXp() + question.getXpValue());

            // Save the progress
            userRepository.save(user);
        }

        return isCorrect;
    }

    /**
     * ADMIN/TEACHER: Create a new question
     */
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
}
