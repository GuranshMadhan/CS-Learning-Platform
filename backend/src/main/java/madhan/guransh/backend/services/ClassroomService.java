package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.ClassroomDTO;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;

    public ClassroomDTO createClassroom(String name, User teacher) {
        Classroom classroom = new Classroom();
        classroom.setName(name);
        classroom.setTeacher(teacher);

        Classroom saved = classroomRepository.save(classroom);
        return mapToDTO(saved);
    }

    public boolean joinClassroom(String portalCode, User student) {
        Classroom classroom = classroomRepository.findByPortalCode(portalCode)
                .orElse(null);

        if (classroom == null) return false;

        // Note: We add to the STUDENT'S list because User is the owning side of ManyToMany
        if (!student.getEnrolledClassrooms().contains(classroom)) {
            student.getEnrolledClassrooms().add(classroom);
            userRepository.save(student);
        }
        return true;
    }

    private ClassroomDTO mapToDTO(Classroom c) {
        ClassroomDTO dto = new ClassroomDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setPortalCode(c.getPortalCode());
        if (c.getTeacher() != null) {
            dto.setTeacherName(c.getTeacher().getUsername());
        }
        return dto;
    }
}