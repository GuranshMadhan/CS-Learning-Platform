package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.ClassroomDTO;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.UserRepository; // <--- Added
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;

    public ClassroomDTO createClassroom(String name, User teacher) {
        String portalCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Classroom classroom = new Classroom();
        classroom.setName(name);
        classroom.setTeacher(teacher);
        classroom.setPortalCode(portalCode);

        Classroom saved = classroomRepository.save(classroom);
        return mapToDTO(saved);
    }

    @Transactional
    public boolean joinClassroom(String rawPortalCode, User studentPrincipal) {
        if (rawPortalCode == null) return false;

        String cleanCode = rawPortalCode.trim().toUpperCase();

        Classroom classroom = classroomRepository.findByPortalCode(cleanCode)
                .orElse(null);

        if (classroom == null) return false;

        User student = userRepository.findById(studentPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getEnrolledClassrooms().contains(classroom)) {
            student.getEnrolledClassrooms().add(classroom);
            userRepository.save(student);
            return true;
        }

        return true;
    }

    private ClassroomDTO mapToDTO(Classroom c) {
        ClassroomDTO dto = new ClassroomDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setPortalCode(c.getPortalCode());

        if (c.getTeacher() != null) {
            dto.setTeacherName(c.getTeacher().getDisplayName());
        }
        return dto;
    }
}