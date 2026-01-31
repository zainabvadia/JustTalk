package justtalk.demo.model; // <--- FIXED THIS

import lombok.Data;
import java.util.Map;

@Data
public class AnalysisResult {
    private Double accuracyScore;
    private String summary;
    private Map<String, Integer> nonLexicalFillers; 
    private Map<String, Integer> lexicalFillers;
}