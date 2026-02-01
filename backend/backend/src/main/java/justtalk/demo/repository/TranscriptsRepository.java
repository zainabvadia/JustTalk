package justtalk.demo.repository;

import justtalk.demo.model.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TranscriptsRepository extends JpaRepository<Transcript, Long> {
}
