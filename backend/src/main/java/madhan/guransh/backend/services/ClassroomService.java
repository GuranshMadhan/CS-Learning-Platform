package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.ClassroomDTO;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomDTO createClassroom(String name, User teacher) {
        // 1. Generate Random Code
        String portalCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // 2. Build Classroom
        Classroom classroom = new Classroom();
        classroom.setName(name);
        classroom.setTeacher(teacher);
        classroom.setPortalCode(portalCode);

        // 3. Save
        Classroom saved = classroomRepository.save(classroom);

        // 4. Convert to DTO (Fixes "Email as Name" bug)
        return mapToDTO(saved);
    }

    public boolean joinClassroom(String portalCode, User student) {
        Classroom classroom = classroomRepository.findByPortalCode(portalCode)
                .orElse(null);

        if (classroom == null) return false;

        if (!classroom.getStudents().contains(student)) {
            classroom.getStudents().add(student);
            classroomRepository.save(classroom);
        }
        return true;
    }

    private ClassroomDTO mapToDTO(Classroom c) {
        ClassroomDTO dto = new ClassroomDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setPortalCode(c.getPortalCode());

        // Use displayname
        if (c.getTeacher() != null) {
            dto.setTeacherName(c.getTeacher().getDisplayName());
        }
        return dto;
    }
}