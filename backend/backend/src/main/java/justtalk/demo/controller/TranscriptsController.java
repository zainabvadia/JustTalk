package justtalk.demo.controller;

import justtalk.demo.model.Transcript;
import justtalk.demo.service.TranscriptsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptsController {
    @Autowired
    private TranscriptsService transcriptsService;

    @GetMapping
    public List<Transcript> getAllTranscripts() {
        return transcriptsService.getAllTranscripts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transcript> getTranscriptById(@PathVariable Long id) {
        return transcriptsService.getTranscriptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/video/{videoId}")
    public List<Transcript> getTranscriptsByVideoId(@PathVariable Long videoId) {
        return transcriptsService.getTranscriptsByVideoId(videoId);
    }

    @PostMapping
    public Transcript createTranscript(@RequestBody Transcript transcript) {
        return transcriptsService.saveTranscript(transcript);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTranscript(@PathVariable Long id) {
        transcriptsService.deleteTranscript(id);
        return ResponseEntity.noContent().build();
    }
}
