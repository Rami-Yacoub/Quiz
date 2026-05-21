package com.Exam.Backend.Controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin("*")
public class ChatbotController {

    private final String GEMINI_API_KEY = "";
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + GEMINI_API_KEY;



    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestions(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");
        
        String systemInstruction = "You are a quiz question generator. Based on the user's prompt, generate an array of quiz questions. " +
            "You MUST respond ONLY with a valid JSON array of objects. Do NOT include markdown formatting like ```json or ```. " +
            "Each object must have the exact following string fields: 'content' (the question), 'option1', 'option2', 'option3', 'option4', and 'answer' (the exact text of the correct option).";

        String fullPrompt = systemInstruction + "\\n\\nUser Prompt: " + userPrompt.replace("\"", "\\\"");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{" +
                "\"contents\": [{" +
                "\"parts\":[{\"text\": \"" + fullPrompt + "\"}]" +
                "}]" +
                "}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(GEMINI_API_URL, HttpMethod.POST, entity, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            String textResponse = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean up markdown if Gemini accidentally included it
            textResponse = textResponse.replace("```json", "").replace("```", "").trim();
            
            return ResponseEntity.ok(textResponse);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Gemini API Failed. Sending fallback mock questions.");
            
            // Fallback response if API key is invalid, rate limited, or network fails.
            String fallback = "[" +
                "{\"content\": \"(Fallback due to API Error) What is the chemical symbol for Water?\", \"option1\": \"H2O\", \"option2\": \"CO2\", \"option3\": \"O2\", \"option4\": \"HO\", \"answer\": \"H2O\"}," +
                "{\"content\": \"(Fallback) What is 5 + 7?\", \"option1\": \"10\", \"option2\": \"11\", \"option3\": \"12\", \"option4\": \"13\", \"answer\": \"12\"}" +
                "]";
            return ResponseEntity.ok(fallback);
        }
    }
}
