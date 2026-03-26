package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM questions WHERE classroom_id IS NULL ORDER BY RANDOM() LIMIT 20", nativeQuery = true)
    List<Question> findAllRandomGlobalQuestions();

    // 2. Fetch questions for a specific quiz
    List<Question> findByQuizId(Long quizId);

}
