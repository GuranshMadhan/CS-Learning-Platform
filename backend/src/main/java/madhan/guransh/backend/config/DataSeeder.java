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
        // 1. Check if we already have data
        if (questionRepository.count() == 0) {
            System.out.println("🌱 Seeding Database...");


            ObjectMapper mapper = new ObjectMapper();

            // 3. GET THE FILE
            InputStream inputStream = TypeReference.class.getResourceAsStream("/questions.json");

            // Safety check
            if (inputStream == null) {
                System.out.println("❌ ERROR: Could not find questions.json in resources folder!");
                return;
            }

            // 4. Convert the JSON text inside the file into Java Objects
            List<Question> questions = mapper.readValue(inputStream, new TypeReference<List<Question>>(){});

            // 5. Save to Database
            questionRepository.saveAll(questions);

            System.out.println("✅ Seeding Complete: Added " + questions.size() + " questions.");
        } else {
            System.out.println("⚡ Database already has data. Skipping seed.");
        }
    }
}