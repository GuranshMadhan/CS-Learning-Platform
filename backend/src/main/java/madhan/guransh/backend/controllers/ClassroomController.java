package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.ClassroomDTO;
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

    @PostMapping("/create")
    public ResponseEntity<ClassroomDTO> createClassroom(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User teacher
    ) {
        ClassroomDTO newClass = classroomService.createClassroom(payload.get("name"), teacher);
        return ResponseEntity.ok(newClass);
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinClassroom(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User student
    ) {
        String code = payload.get("code");
        boolean success = classroomService.joinClassroom(code, student);

        if (success) {
            return ResponseEntity.ok("Successfully joined the portal!");
        } else {
            return ResponseEntity.badRequest().body("Invalid Portal Code.");
        }
    }
}