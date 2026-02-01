package justtalk.demo.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import justtalk.demo.model.Video;
import justtalk.demo.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoService {
    private static final String FOLDER = "videos/";
    private final VideoRepository videoRepository;
    private final AmazonS3 s3Client;

    @Value("${do.spaces.bucket}")
    private String doSpaceBucket; //where are objects stored in the cloud
    @Value("${do.spaces.endpoint}")
    private String doSpaceEndpointForData;

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(Long videoId) {
        return videoRepository.findById(videoId);
    }

    public Video saveFile(MultipartFile file, Long sessionId) throws IOException {
        String videoName = FilenameUtils.removeExtension(file.getOriginalFilename());
        String baseFileName = UUID.randomUUID().toString();
        String webmFileName = baseFileName + ".webm";
        String mp4FileName = baseFileName + ".mp4";
        Path tempDir = Files.createTempDirectory("video-upload-");
        File webmFile = tempDir.resolve(webmFileName).toFile();
        File mp4File = tempDir.resolve(mp4FileName).toFile();

        // Save uploaded WebM to temp file
        try {
            file.transferTo(webmFile);

            // Convert WebM to MP4 using ffmpeg
            ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg", "-i", webmFile.getAbsolutePath(), "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", mp4File.getAbsolutePath()
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            if (exitCode != 0 || !mp4File.exists()) {
                throw new IOException("Failed to convert video to MP4. ffmpeg exit code: " + exitCode);
            }

            // Upload MP4 to DigitalOcean Spaces
            String key = FOLDER + mp4FileName;
            saveFileToSpaces(mp4File, key, "video/mp4");

            // Save video metadata
            Video video = new Video();
            video.setSessionId(sessionId);
            video.setTitle(videoName);
            video.setCreatedAt(LocalDateTime.now());
            video.setLink(doSpaceEndpointForData + "/" + key);
            return videoRepository.save(video);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Video conversion interrupted", e);
        } finally {
            // Clean up temp files
            if (webmFile.exists()) webmFile.delete();
            if (mp4File.exists()) mp4File.delete();
            tempDir.toFile().delete();
        }
    }

    //Handles upload to DigitalOcean Buckets for File
    private void saveFileToSpaces(File file, String key, String contentType) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.length());
        metadata.setContentType(contentType);
        s3Client.putObject(new PutObjectRequest(doSpaceBucket, key, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }
}

