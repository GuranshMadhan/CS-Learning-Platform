package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findById(Long id);

}
