package madhan.guransh.backend.controllers;

import madhan.guransh.backend.enums.QuestionType;
import madhan.guransh.backend.model.Question;
import madhan.guransh.backend.repository.QuestionRepository;
import madhan.guransh.backend.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;

@Controller
public class QuizController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/quiz/{id}")
    public String startQuiz(@PathVariable Long id, Model model) {
        Question q = questionRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid question ID")
        );

        if (q.getType() == QuestionType.PARSONS_PROBLEM) {
            try {
                // CONVERT JSON STRING -> JAVA LIST
                // We tell Jackson: "Turn this string back into a List of Strings"
                List<String> lines = objectMapper.readValue(q.getContent(), List.class);

                // Shuffle for the game
                Collections.shuffle(lines);

                model.addAttribute("puzzleLines", lines);

            } catch (Exception e) {
                model.addAttribute("error", "Error loading question data");
            }
        }

        return "game-parsons";
    }
}
