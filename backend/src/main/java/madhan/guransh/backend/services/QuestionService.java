package madhan.guransh.backend.services;

import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@Service
public class QuestionService {

    ObjectMapper objectMapper = new ObjectMapper();
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public void createParsonsQuestion(String title, List<String> codeLines) {
        Question q = new Question();
        q.setTitle(title);
        q.setType(QuestionType.PARSONS_PROBLEM);

        try {
            // CONVERT LIST -> JSON STRING
            // Input:  List ["int x=1;", "print(x)"]
            // Output: String "[\"int x=1;\", \"print(x)\"]"
            String jsonContent = objectMapper.writeValueAsString(codeLines);
            q.setContent(jsonContent);

            // Save the correct order (e.g., indexes 0, 1)
            q.setCorrectSolutions("0,1");

            questionRepository.save(q);

        } catch (Exception e) {
            e.printStackTrace(); // Handle errors (like invalid text)
        }
    }
}
