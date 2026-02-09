package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // We need to find all quizzes belonging to a specific classroom
    List<Quiz> findAllByClassroomId(Long classroomId);

}