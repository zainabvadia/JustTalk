package justtalk.demo.repository; // <--- Correct Package

import justtalk.demo.model.PracticeSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionRepository extends JpaRepository<PracticeSession, Long> {
    // Custom query to find all videos for a specific user
    // List<PracticeSession> findByUserId(String userId);
}