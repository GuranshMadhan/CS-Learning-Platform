package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findById(Long id);

    List<Question> findByQuizId(Long quizId);

    // List questions for infinite mode
    @Query("SELECT q FROM Question q WHERE q.classroom IS NULL")
    List<Question> findAllRandomGlobalQuestions();

}
