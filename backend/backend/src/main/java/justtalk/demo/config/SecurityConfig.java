package justtalk.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())         // disable CSRF for dev (required for POST multipart)
            .cors(cors -> {})                      // enable CORS using WebMvcConfigurer
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/sessions/analyze").permitAll()  // public endpoint
                .anyRequest().authenticated()                          // everything else requires auth
            );

        return http.build();
    }
}
