package justtalk.demo.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class DoConfig {

@Value("${do.spaces.key}")
    private String doSpaceKey;
    @Value("${do.spaces.secret}")
    private String doSpaceSecret;
    @Value("${do.spaces.endpoints}")
    private String doSpaceEndpoint;
    @Value("${do.spaces.region}")
    private String doSpaceRegion;
    @Bean
    public AmazonS3 getS3() {
        BasicAWSCredentials creds = new BasicAWSCredentials(doSpaceKey, doSpaceSecret);
        return AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(doSpaceEndpoint, doSpaceRegion))
            .withCredentials(new AWSStaticCredentialsProvider(creds)).build();
    }
}