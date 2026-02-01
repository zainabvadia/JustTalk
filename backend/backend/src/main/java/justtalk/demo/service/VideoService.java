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
    private String doSpaceBucket;
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
        String key = FOLDER + file.getOriginalFilename();

        // Save video to DigitalOcean Spaces
        saveVideoToSpaces(file, key);

        Video video = new Video();
        video.setSessionId(sessionId);
        video.setTitle(videoName);
        video.setCreatedAt(LocalDateTime.now());
        video.setLink(doSpaceEndpointForData + "/" + key);
        return videoRepository.save(video);
    }

    private void saveVideoToSpaces(MultipartFile file, String key) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getInputStream().available());
        metadata.setContentType(file.getContentType());
        s3Client.putObject(new PutObjectRequest(doSpaceBucket, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }
}

