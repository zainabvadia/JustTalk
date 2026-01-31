package justtalk.demo.model; // <--- Correct Package

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "practice_sessions")
public class PracticeSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;           // From Auth0

    @Column(columnDefinition = "TEXT")
    private String originalScript;   // What the user WANTED to say

    @Column(columnDefinition = "TEXT")
    private String actualTranscript; // What AssemblyAI heard

    private Double accuracyScore;    // e.g., 85.5

    @Column(columnDefinition = "TEXT")
    private String feedbackJson;     // Detailed diffs for the frontend

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}