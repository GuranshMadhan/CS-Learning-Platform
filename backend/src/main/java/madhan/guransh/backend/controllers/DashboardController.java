package madhan.guransh.backend.controllers;

import lombok.RequiredArgsConstructor;
import madhan.guransh.backend.dto.DashboardResponse;
import madhan.guransh.backend.enums.Role;
import madhan.guransh.backend.model.Classroom;
import madhan.guransh.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal User user) {

        List<DashboardResponse.ClassroomSummary> enrolled = user.getEnrolledClassrooms().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        List<DashboardResponse.ClassroomSummary> teaching = user.getTeachingClassrooms().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        var response = DashboardResponse.builder()
                .username(user.getUsername()) // or .getFirstname()
                .email(user.getEmail())
                .xp(user.getXp())
                .role(Role.USER)
                .enrolledClassrooms(enrolled)
                .teachingClassrooms(teaching)
                .build();

        return ResponseEntity.ok(response);
    }

    private DashboardResponse.ClassroomSummary mapToSummary(Classroom classroom) {
        return DashboardResponse.ClassroomSummary.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .portalCode(classroom.getPortalCode())
                .build();
    }
}
