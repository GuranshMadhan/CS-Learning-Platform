package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import madhan.guransh.backend.services.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    // 1. Teacher Creates a Classroom
    // POST /api/v1/classrooms/create
    // Body: { "name": "Period 1 Java" }
    @PostMapping("/create")
    public ResponseEntity<Classroom> createClassroom(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User teacher
    ) {
        Classroom newClass = classroomService.createClassroom(payload.get("name"), teacher);
        return ResponseEntity.ok(newClass);
    }

    // 2. Student Joins a Classroom
    // POST /api/v1/classrooms/join
    // Body: { "code": "A1B2C3" }
    @PostMapping("/join")
    public ResponseEntity<String> joinClassroom(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User student
    ) {
        String code = payload.get("code");
        boolean success = classroomService.joinClassroom(code, student);

        if (success) {
            return ResponseEntity.ok("Successfully joined the classroom!");
        } else {
            return ResponseEntity.badRequest().body("Invalid Portal Code.");
        }
    }
}