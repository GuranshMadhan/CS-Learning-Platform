package madhan.guransh.backend.dto;

import lombok.Builder;
import lombok.Data;
import madhan.guransh.backend.enums.Roles;

import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private String username;
    private String email;
    private int xp;
    private Roles role; // Change to String if you are still using String for roles

    // We send the full list so the frontend can show "My Classes"
    private List<ClassroomSummary> enrolledClassrooms;
    private List<ClassroomSummary> teachingClassrooms;

    // Helper class to avoid sending too much info (like student lists)
    @Data
    @Builder
    public static class ClassroomSummary {
        private Long id;
        private String name;
        private String portalCode;
    }
}
