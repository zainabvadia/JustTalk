package justtalk.demo.service; // <--- FIXED THIS

import justtalk.demo.model.AnalysisResult; // <--- FIXED THIS
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComparisonService {

    private static final List<String> NON_LEXICAL = Arrays.asList("um", "uh", "mm", "hm", "er", "ah");
    private static final List<String> LEXICAL = Arrays.asList("like", "basically", "literally", "actually", "seriously", "honestly", "you know");

    public AnalysisResult analyze(String original, String actual) {
        AnalysisResult result = new AnalysisResult();

        // 1. Calculate Accuracy
        String cleanOrig = original.toLowerCase().replaceAll("[^a-z0-9 ]", "");
        String cleanAct = actual.toLowerCase().replaceAll("[^a-z0-9 ]", "");
        
        LevenshteinDistance dist = new LevenshteinDistance();
        int edits = dist.apply(cleanOrig, cleanAct);
        int maxLength = Math.max(cleanOrig.length(), cleanAct.length());
        
        double score = maxLength == 0 ? 0 : 100.0 - ((double) edits / maxLength * 100.0);
        result.setAccuracyScore(Math.max(0, score));

        // 2. Count Fillers
        Map<String, Integer> nonLex = new HashMap<>();
        Map<String, Integer> lex = new HashMap<>();

        for (String word : cleanAct.split("\\s+")) {
            if (NON_LEXICAL.contains(word)) 
                nonLex.put(word, nonLex.getOrDefault(word, 0) + 1);
            else if (LEXICAL.contains(word)) 
                lex.put(word, lex.getOrDefault(word, 0) + 1);
        }

        result.setNonLexicalFillers(nonLex);
        result.setLexicalFillers(lex);

        // 3. Summary
        int totalFillers = nonLex.size() + lex.size();
        if (score > 85 && totalFillers < 3) result.setSummary("Excellent! Very clean delivery.");
        else if (lex.size() > 5) result.setSummary("You use crutch words like 'actually' or 'like' too often.");
        else if (nonLex.size() > 5) result.setSummary("You seem nervous (lots of 'um's). Pause instead of filling silence.");
        else result.setSummary("Good effort. Practice reading slightly slower.");

        return result;
    }
}