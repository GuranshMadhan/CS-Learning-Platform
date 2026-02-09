package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    // Find a specific result to check if user took it
    Optional<QuizResult> findByUserIdAndQuizId(Long userId, Long quizId);

    // Find all results for a user in a specific class (Efficient loading)
    List<QuizResult> findByUserIdAndQuizClassroomId(Long userId, Long classroomId);
}