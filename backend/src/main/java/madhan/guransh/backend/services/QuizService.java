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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final ClassroomRepository classroomRepository;
    private final QuestionRepository questionRepository;

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
}