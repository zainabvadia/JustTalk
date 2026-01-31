package justtalk.demo.service; // <--- FIXED THIS

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.Map;

@Service
public class AssemblyAIService {
    
    @Value("${assemblyai.api.key}") 
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://api.assemblyai.com/v2");

    public String transcribe(MultipartFile file) throws IOException {
        try {
            // A. Upload
            String uploadUrl = webClient.post().uri("/upload")
                    .header("Authorization", apiKey)
                    .bodyValue(file.getBytes())
                    .retrieve().bodyToMono(JsonNode.class).block()
                    .get("upload_url").asText();

            // B. Transcribe
            Map<String, Object> params = Map.of("audio_url", uploadUrl, "disfluencies", true);
            
            String id = webClient.post().uri("/transcript")
                    .header("Authorization", apiKey)
                    .bodyValue(params)
                    .retrieve().bodyToMono(JsonNode.class).block()
                    .get("id").asText();

            // C. Poll
            while (true) {
                JsonNode res = webClient.get().uri("/transcript/" + id)
                        .header("Authorization", apiKey)
                        .retrieve().bodyToMono(JsonNode.class).block();
                
                String status = res.get("status").asText();
                if ("completed".equals(status)) return res.get("text").asText();
                if ("error".equals(status)) throw new RuntimeException("AssemblyAI Error");
                
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            throw new RuntimeException("AI Failed: " + e.getMessage());
        }
    }
}