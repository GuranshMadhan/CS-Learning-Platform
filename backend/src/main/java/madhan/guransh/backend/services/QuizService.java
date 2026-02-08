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

    // --- ADD QUESTION (Keep returning Question or make a QuestionDTO later) ---
    public Question addQuestionToQuiz(Long quizId, String content, String op1, String op2, String op3, String op4, String answer) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        Question question = new Question();
        question.setContent(content);
        question.setOption1(op1);
        question.setOption2(op2);
        question.setOption3(op3);
        question.setOption4(op4);
        question.setCorrectAnswer(answer);
        question.setXpValue(10);
        question.setType(QuestionType.MULTIPLE_CHOICE);
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
            if (studentAnswer != null && studentAnswer.equalsIgnoreCase(q.getCorrectAnswer())) {
                correctCount++;
            }
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