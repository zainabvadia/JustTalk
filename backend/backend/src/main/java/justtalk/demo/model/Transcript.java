package justtalk.demo.model; 

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transcripts")
public class Transcript {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcriptText;

    @Column(nullable = true)
    private Double confidenceScore;   // evaluated confidence score  
}