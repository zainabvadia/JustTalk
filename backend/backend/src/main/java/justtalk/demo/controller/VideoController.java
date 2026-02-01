package justtalk.demo.controller;


import justtalk.demo.model.Video;
import justtalk.demo.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/upload")
public class VideoController {
    private final VideoService videoService;

    @PutMapping(value = "/new", consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<Video> uploadFile(@RequestParam("file") final MultipartFile file) throws IOException {
        Video response = videoService.saveFile(file, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{videoId}")
    public ResponseEntity<String> deleteFile(@PathVariable final Long videoId) {
        videoService.deleteVideo(videoId);
        return ResponseEntity.ok("Deleted video with id: " + videoId);
    }
}
