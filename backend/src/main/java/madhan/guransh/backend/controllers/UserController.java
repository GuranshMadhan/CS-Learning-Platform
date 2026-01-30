package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        // 1. Basic Info
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("xp", user.getXp());
        response.put("totalCorrectAnswers", user.getTotalCorrectAnswers());

        // 2. Enrolled Classrooms (Safe Mapping)
        List<Map<String, Object>> enrolledList = new ArrayList<>();
        if (user.getEnrolledClassrooms() != null) {
            enrolledList = user.getEnrolledClassrooms().stream().map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId());
                map.put("name", c.getName());
                return map;
            }).collect(Collectors.toList());
        }
        response.put("enrolledClassrooms", enrolledList);

        // 3. Teaching Classrooms (Safe Mapping)
        List<Map<String, Object>> teachingList = new ArrayList<>();
        if (user.getTeachingClassrooms() != null) {
            teachingList = user.getTeachingClassrooms().stream().map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId());
                map.put("name", c.getName());
                return map;
            }).collect(Collectors.toList());
        }
        response.put("teachingClassrooms", teachingList);

        return ResponseEntity.ok(response);
    }
}