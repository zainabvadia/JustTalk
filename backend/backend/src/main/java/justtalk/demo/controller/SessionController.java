package justtalk.demo.controller; // <--- FIXED THIS

import justtalk.demo.model.PracticeSession; // <--- FIXED IMPORTS
import justtalk.demo.model.AnalysisResult;
import justtalk.demo.repository.SessionRepository;
import justtalk.demo.service.AssemblyAIService;
import justtalk.demo.service.ComparisonService;
import justtalk.demo.model.Video;
import justtalk.demo.service.VideoService;

import com.fasterxml.jackson.databind.ObjectMapper; // <--- FIXED TYPO IN YOUR IMPORT (fasterxml, not fasterxml)

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/sessions")
// @CrossOrigin(origins = "http://localhost:3000")
public class SessionController {
    private final VideoService videoService;

    private final AssemblyAIService assemblyService;
    private final ComparisonService comparisonService;
    private final SessionRepository repository;
    private final ObjectMapper mapper = new ObjectMapper();

    public SessionController(AssemblyAIService assemblyService, 
                             ComparisonService comparisonService, 
                             SessionRepository repository,
                             VideoService videoService) {
        this.assemblyService = assemblyService;
        this.comparisonService = comparisonService;
        this.repository = repository;
        this.videoService = videoService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<PracticeSession> analyzeSession(
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("script") String script
    ) {
        try {
            // 1. Get AI Transcript
            String actualTranscript = assemblyService.transcribe(videoFile);

            // 2. Compare script vs transcript
            AnalysisResult analysis = comparisonService.analyze(script, actualTranscript);

            // 3. Save Session to DB
            PracticeSession session = new PracticeSession();
            session.setOriginalScript(script);
            session.setActualTranscript(actualTranscript);
            session.setAccuracyScore(analysis.getAccuracyScore());
            session.setFeedbackJson(mapper.writeValueAsString(analysis));
            session = repository.save(session);
            
            videoService.saveFile(videoFile, session.getId());
            return ResponseEntity.ok(session);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}