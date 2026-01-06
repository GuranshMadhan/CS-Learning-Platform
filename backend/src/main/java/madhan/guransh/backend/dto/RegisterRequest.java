package madhan.guransh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String email;
    private String password;

    // Scenario A: Joining a group
    private String portalCode;

    // Scenario B: Creating a group (New field)
    private String groupName;
}