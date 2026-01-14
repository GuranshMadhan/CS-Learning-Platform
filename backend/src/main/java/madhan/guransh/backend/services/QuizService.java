package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.Quiz;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final ClassroomRepository classroomRepository;

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
}