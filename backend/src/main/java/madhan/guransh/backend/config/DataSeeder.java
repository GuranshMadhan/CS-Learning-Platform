package madhan.guransh.backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if the database is empty
        if (questionRepository.count() == 0) {
            System.out.println("🌱 Seeding Global Questions...");

            ObjectMapper mapper = new ObjectMapper();
            // Make sure questions.json is in src/main/resources/
            InputStream inputStream = TypeReference.class.getResourceAsStream("/questions.json");

            try {
                if (inputStream == null) {
                    System.out.println("⚠️ Warning: questions.json not found!");
                    return;
                }

                List<Question> questions = mapper.readValue(inputStream, new TypeReference<List<Question>>() {});

                // Ensure they are marked as 'Global' (null classroom/quiz)
                questions.forEach(q -> {
                    q.setClassroom(null);
                    q.setQuiz(null);
                });

                questionRepository.saveAll(questions);
                System.out.println("✅ Questions Seeded Successfully!");
            } catch (Exception e) {
                System.out.println("❌ Seeding Failed: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}