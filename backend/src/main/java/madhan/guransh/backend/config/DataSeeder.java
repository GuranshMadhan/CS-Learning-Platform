package madhan.guransh.backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.model.Quiz;
import madhan.guransh.backend.repository.QuestionRepository;
import madhan.guransh.backend.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Override
    public void run(String... args) throws Exception {
        if (quizRepository.count() == 0) {
            System.out.println("🌱 Seeding Global Content...");
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = TypeReference.class.getResourceAsStream("/questions.json");
            try {
                if (inputStream == null) {
                    System.out.println("⚠️ Warning: questions.json not found!");
                    return;
                }
                Quiz globalQuiz = new Quiz();
                globalQuiz.setTitle("General CS Practice");
                globalQuiz.setDescription("Fundamental Computer Science concepts.");
                globalQuiz.setClassroom(null); // Mark as Global
                globalQuiz.setCompletionBonusXp(100);
                quizRepository.save(globalQuiz);

                List<Question> questions = mapper.readValue(inputStream, new TypeReference<List<Question>>() {});

                questions.forEach(q -> {
                    q.setClassroom(null);
                    q.setQuiz(globalQuiz);
                });

                questionRepository.saveAll(questions);
                System.out.println("✅ Global Quiz & Questions Seeded Successfully!");

            } catch (Exception e) {
                System.out.println("❌ Seeding Failed: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}