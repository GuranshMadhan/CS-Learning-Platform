package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.QuizDTO; // <--- CHECK THIS IMPORT
import madhan.guransh.backend.enums.Difficulty;
import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.*;
import madhan.guransh.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final QuizResultRepository quizResultRepository;

    public QuizDTO createQuiz(Long classroomId, String title, String description, User teacher) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        if (!classroom.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not the teacher of this class!");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setClassroom(classroom);
        quiz.setCompletionBonusXp(50);

        Quiz saved = quizRepository.save(quiz);

        return mapToDTO(saved, null);
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesForClassroom(Long classroomId, User principal) {
        List<Quiz> quizzes = quizRepository.findAllByClassroomId(classroomId);

        List<QuizResult> results = (principal != null)
                ? quizResultRepository.findByUserIdAndQuizClassroomId(principal.getId(), classroomId)
                : List.of();

        return quizzes.stream().map(q -> {
            QuizDTO dto = new QuizDTO();
            dto.setId(q.getId());
            dto.setTitle(q.getTitle());
            dto.setDescription(q.getDescription());
            dto.setClassroomId(q.getClassroom().getId());
            dto.setQuestionCount(q.getQuestions().size());

            QuizResult myResult = results.stream()
                    .filter(r -> r.getQuiz().getId().equals(q.getId()))
                    .findFirst()
                    .orElse(null);

            if (myResult != null) {
                dto.setCompleted(true);
                dto.setScoreDisplay(myResult.getScore() + "/" + myResult.getTotalQuestions());
            }
            return dto;
        }).collect(Collectors.toList());
    }
    private QuizDTO mapToDTO(Quiz q, User student) {
        QuizDTO dto = new QuizDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setDescription(q.getDescription());
        dto.setQuestionCount(q.getQuestions().size());

        if (q.getClassroom() != null) {
            dto.setClassroomId(q.getClassroom().getId());
            if (student != null && student.getCompletedQuizzes().contains(q)) {
                dto.setCompleted(true);
            }
        } else {
            dto.setClassroomId(null);
            dto.setCompleted(false);
            dto.setScoreDisplay(null);
        }

        return dto;
    }

    public Question addQuestionToQuiz(Long quizId, String content, List<String> options, String answer, String typeStr) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        Question question = new Question();
        question.setContent(content);
        question.setOptions(options);
        question.setCorrectAnswer(answer);

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

    @Transactional
    public int submitQuiz(Long quizId, Map<String, String> studentAnswers, User principal) {
        User student = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (quizResultRepository.findByUserIdAndQuizId(student.getId(), quiz.getId()).isPresent()) {
            throw new RuntimeException("You have already completed this quest!");
        }

        int correctCount = 0;
        int totalQuestions = quiz.getQuestions().size();

        for (Question q : quiz.getQuestions()) {
            String key = "question_" + q.getId();
            String studentAnswer = studentAnswers.get(key);

            if (studentAnswer == null) continue;

            boolean isCorrect = false;

            if (q.getType() == QuestionType.PARSONS_PROBLEM) {
                String correctOrder = String.join("|||", q.getOptions());
                if (studentAnswer.equals(correctOrder)) isCorrect = true;
            } else {
                if (studentAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                    isCorrect = true;
                }
            }

            if (isCorrect) correctCount++;
        }

        int xpEarned = correctCount * 10;
        student.setTotalCorrectAnswers(student.getTotalCorrectAnswers() + correctCount);
        if (totalQuestions > 0 && correctCount == totalQuestions) {
            xpEarned += quiz.getCompletionBonusXp();
        }
        student.setXp(student.getXp() + xpEarned);

        if (totalQuestions > 0 && correctCount == totalQuestions) {
            xpEarned += quiz.getCompletionBonusXp();
        }

        QuizResult result = new QuizResult();
        result.setUser(student);
        result.setQuiz(quiz);
        result.setScore(correctCount);
        result.setTotalQuestions(totalQuestions);
        quizResultRepository.save(result);

        student.getCompletedQuizzes().add(quiz);
        userRepository.save(student);

        return xpEarned;
    }

    public void deleteQuiz(Long quizId) {
        if (quizRepository.existsById(quizId)) {
            quizRepository.deleteById(quizId);
        } else {
            throw new RuntimeException("Quiz not found");
        }
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getGlobalQuizzes(User principal) {
        User attachedUser = null;
        if (principal != null) {
            attachedUser = userRepository.findById(principal.getId()).orElse(null);
        }
        final User student = attachedUser;

        return quizRepository.findAll().stream()
                .filter(q -> q.getClassroom() == null)
                .map(q -> mapToDTO(q, student))
                .collect(Collectors.toList());
    }
}