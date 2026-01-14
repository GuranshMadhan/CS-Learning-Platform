package madhan.guransh.backend.services;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.repository.ClassroomRepository;
import madhan.guransh.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;

    public Classroom createClassroom(String name, User teacher) {
        // 1. Generate a random 6-character code (e.g., "A1B2C3")
        String portalCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // 2. Build the Classroom
        Classroom classroom = new Classroom();
        classroom.setName(name);
        classroom.setTeacher(teacher);
        classroom.setPortalCode(portalCode);

        return classroomRepository.save(classroom);
    }

    public boolean joinClassroom(String portalCode, User student) {
        // 1. Find the classroom
        Classroom classroom = classroomRepository.findByPortalCode(portalCode)
                .orElse(null);

        if (classroom == null) {
            return false; // Invalid Code
        }

        // 2. Add student to the list (JPA handles the Join Table automatically)
        classroom.getStudents().add(student);
        classroomRepository.save(classroom);
        return true;
    }
}