package madhan.guransh.backend.controllers;

import madhan.guransh.backend.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private User user;

    @GetMapping("/current")
    public User getCurrentUser() throws Exception {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || auth.getPrincipal().equals("anonymousUser") || !auth.isAuthenticated()) {
            throw new Exception("User is not authenticated");
        } else {
            user = (User) auth.getPrincipal();
        }
        return user;
    }


}
