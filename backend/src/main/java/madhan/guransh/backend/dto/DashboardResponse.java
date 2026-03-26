package madhan.guransh.backend.dto;

import lombok.Builder;
import lombok.Data;
import madhan.guransh.backend.enums.Role;

import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private String username;
    private String email;
    private int xp;
    private Role role;

    private List<ClassroomSummary> enrolledClassrooms;
    private List<ClassroomSummary> teachingClassrooms;

    @Data
    @Builder
    public static class ClassroomSummary {
        private Long id;
        private String name;
        private String portalCode;
    }
}
