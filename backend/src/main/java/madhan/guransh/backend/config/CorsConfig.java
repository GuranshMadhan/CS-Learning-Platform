package madhan.guransh.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow ALL endpoints
                        .allowedOrigins("http://localhost:5173") // Allow ONLY frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow these actions
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}