package justtalk.demo.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF for the H2 console only
            .csrf(csrf -> csrf.ignoringRequestMatchers(PathRequest.toH2Console()))
            
            // 2. Allow access to the H2 console path
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PathRequest.toH2Console()).permitAll()
                .anyRequest().authenticated()
            )
            
            // 3. Allow frames from the same origin (Crucial for H2 console!)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            
            // 4. Standard login for the rest of your app
            .formLogin(withDefaults())
            .httpBasic(withDefaults());

        return http.build();
    }
}