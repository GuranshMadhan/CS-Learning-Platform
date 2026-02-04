package madhan.guransh.backend.dto;

import lombok.Data;

@Data
public class ClassroomDTO {
    private Long id;
    private String name;
    private String portalCode;
    private String teacherName;
}