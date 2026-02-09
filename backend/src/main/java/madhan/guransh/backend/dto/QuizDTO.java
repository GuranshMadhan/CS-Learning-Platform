package madhan.guransh.backend.dto;

import lombok.Data;

@Data
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private Long classroomId;
    private int questionCount;
    private boolean completed;
    private String scoreDisplay;
}