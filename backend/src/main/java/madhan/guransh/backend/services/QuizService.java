package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.QuizDTO;
import madhan.guransh.backend.enums.Difficulty;
import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.Quiz;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.QuestionRepository;
import madhan.guransh.backend.repository.QuizRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final ClassroomRepository classroomRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    // --- CREATE (Returns DTO) ---
    public QuizDTO createQuiz(Long classroomId, String title, String description, User teacher) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // Security Check
        if (!classroom.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not the teacher of this class!");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setClassroom(classroom);
        quiz.setCompletionBonusXp(50);

        Quiz saved = quizRepository.save(quiz);
        return mapToDTO(saved);
    }

    // --- READ LIST (Returns List of DTOs) ---
    public List<QuizDTO> getQuizzesForClassroom(Long classroomId) {
        return quizRepository.findAllByClassroomId(classroomId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- HELPER: Map Entity to DTO ---
    private QuizDTO mapToDTO(Quiz q) {
        QuizDTO dto = new QuizDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setDescription(q.getDescription());
        dto.setClassroomId(q.getClassroom().getId());
        dto.setQuestionCount(q.getQuestions().size());
        return dto;
    }

    // --- DELETE QUIZ ---
    public void deleteQuiz(Long quizId) {
        if (quizRepository.existsById(quizId)) {
            quizRepository.deleteById(quizId);
        } else {
            throw new RuntimeException("Quiz not found");
        }
    }

    // --- UPDATED ADD QUESTION ---
    public Question addQuestionToQuiz(Long quizId, String content, List<String> options, String answer, String typeStr) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        Question question = new Question();
        question.setContent(content);
        question.setOptions(options);
        question.setCorrectAnswer(answer);

        // Handle Type (Default to MC if null)
        try {
            question.setType(QuestionType.valueOf(typeStr));
        } catch (Exception e) {
            question.setType(QuestionType.MULTIPLE_CHOICE);
        }

        question.setXpValue(10);
        question.setDifficulty(Difficulty.EASY);
        question.setQuiz(quiz);

        return questionRepository.save(question);
    }

    // --- SUBMIT
    public int submitQuiz(Long quizId, Map<String, String> studentAnswers, User student) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int correctCount = 0;
        int totalQuestions = quiz.getQuestions().size();

        for (Question q : quiz.getQuestions()) {
            String key = "question_" + q.getId();
            String studentAnswer = studentAnswers.get(key);

            if (studentAnswer == null) continue;

            boolean isCorrect = false;
            if (q.getType() == QuestionType.PARSONS_PROBLEM) {
                String correctOrder = String.join("|||", q.getOptions());
                if (studentAnswer.equals(correctOrder)) {
                    isCorrect = true;
                }
            } else {
                // For MCQ, True/False, and Cloze, simply compare with correctAnswer field
                if (studentAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                    isCorrect = true;
                }
            }

            if (isCorrect) correctCount++;
        }

        // Prevent Divide by Zero
        if (totalQuestions == 0) return 0;

        int xpEarned = correctCount * 10;
        student.setTotalCorrectAnswers(student.getTotalCorrectAnswers() + correctCount);
        student.setTotalQuestionsAttempted(student.getTotalQuestionsAttempted() + totalQuestions);

        if (correctCount == totalQuestions) {
            xpEarned += quiz.getCompletionBonusXp();
        }

        student.setXp(student.getXp() + xpEarned);
        userRepository.save(student);

        return xpEarned;
    }
}