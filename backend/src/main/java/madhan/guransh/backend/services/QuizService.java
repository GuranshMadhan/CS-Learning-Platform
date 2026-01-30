package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final ClassroomRepository classroomRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public Quiz createQuiz(Long classroomId, String title, String description, User teacher) {
        // 1. Find the classroom
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // 2. SECURITY: Ensure the person creating the quiz is actually the teacher of this class
        if (!classroom.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not the teacher of this class!");
        }

        // 3. Create and Save the Quiz
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setClassroom(classroom);
        quiz.setCompletionBonusXp(50); // Default bonus for finishing a quiz

        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesForClassroom(Long classroomId) {
        return quizRepository.findAllByClassroomId(classroomId);
    }

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

        questionRepository.save(question);

        return questionRepository.save(question);
    }

    public int submitQuiz(Long quizId, Map<String, String> studentAnswers, User student) {
        // 1. Fetch the Quiz
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int correctCount = 0;
        int totalQuestions = quiz.getQuestions().size();

        // 2. Loop through every question in the quiz
        for (Question q : quiz.getQuestions()) {
            // We expect keys like "question_4" (where 4 is the ID)
            String key = "question_" + q.getId();
            String studentAnswer = studentAnswers.get(key);

            // Compare answers (Case insensitive just to be safe)
            if (studentAnswer != null && studentAnswer.equalsIgnoreCase(q.getCorrectAnswer())) {
                correctCount++;
            }
        }

        // 3. Calculate Score (Simple Percentage)
        // Avoid divide by zero if quiz is empty
        if (totalQuestions == 0) return 0;

        // 4. Award XP (Only if they get 100%? or just pass? Let's give XP based on correct answers)
        // Logic: You get the Quiz Bonus ONLY if you get everything right (or maybe > 50%?)

        int xpEarned = correctCount * 10; // 10 XP per correct question
        student.setTotalCorrectAnswers(student.getTotalCorrectAnswers() + correctCount);

        if (correctCount == totalQuestions) {
            xpEarned += quiz.getCompletionBonusXp(); // Add the 50 XP bonus for perfect score
        }

        // 5. Save the Student's new XP
        student.setXp(student.getXp() + xpEarned);
        userRepository.save(student);

        return xpEarned;
    }

    // TODO: Fix infinite xp exploit by tracking quiz attempts per user
}