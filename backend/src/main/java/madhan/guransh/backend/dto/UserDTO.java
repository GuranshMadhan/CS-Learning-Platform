package madhan.guransh.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;

    // Stats
    private int xp;
    private int totalCorrectAnswers;
    private int totalQuestionsAttempted;
    private int rank;
    private double accuracy;

    private List<ClassroomDTO> enrolledClassrooms;
    private List<ClassroomDTO> teachingClassrooms;
}