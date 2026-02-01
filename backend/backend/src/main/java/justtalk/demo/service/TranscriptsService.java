package justtalk.demo.service;

import justtalk.demo.model.Transcript;
import justtalk.demo.repository.TranscriptsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TranscriptsService {
    @Autowired
    private TranscriptsRepository transcriptsRepository;

    public List<Transcript> getAllTranscripts() {
        return transcriptsRepository.findAll();
    }

    public Optional<Transcript> getTranscriptById(Long id) {
        return transcriptsRepository.findById(id);
    }

    public List<Transcript> getTranscriptsByVideoId(Long videoId) {
        return transcriptsRepository.findByVideoId(videoId);
    }

    public Transcript saveTranscript(Transcript transcript) {
        return transcriptsRepository.save(transcript);
    }

    public void deleteTranscript(Long id) {
        transcriptsRepository.deleteById(id);
    }
}
