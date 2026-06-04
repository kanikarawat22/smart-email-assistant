package com.kanika.email_generator.app;

import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;


@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // ---------------- GENERATE EMAIL ----------------
    public String generatedEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    // ---------------- IMPROVE EMAIL ----------------
    public String improveEmailReply(EmailRequest emailRequest) {

        String prompt = buildImprovePrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    // ---------------- SAFE GEMINI PARSER ----------------
    private String extractResponseContent(String response) {
        try {
            if (response == null || response.isEmpty()) {
                return "Empty response from AI";
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.size() == 0) {
                return "No valid response from AI (candidates missing)";
            }

            JsonNode firstCandidate = candidates.get(0);

            JsonNode parts = firstCandidate
                    .path("content")
                    .path("parts");

            if (!parts.isArray() || parts.size() == 0) {
                return "Invalid AI response structure (parts missing)";
            }

            JsonNode textNode = parts.get(0).path("text");

            if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
                return "AI returned empty text";
            }

            return textNode.asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing AI response: " + e.getMessage();
        }
    }

    // ---------------- PROMPT: GENERATE ----------------
    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate a professional email reply. Do NOT include subject line.\n\n");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Tone: ").append(emailRequest.getTone()).append("\n");
        }

        prompt.append("\nOriginal email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }

    // ---------------- PROMPT: IMPROVE ----------------
    private String buildImprovePrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("You are an AI email assistant.\n");
        prompt.append("Rewrite the email based on instructions.\n\n");

        prompt.append("Mode: ")
                .append(emailRequest.getMode())
                .append("\n");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Tone: ").append(emailRequest.getTone()).append("\n");
        }

        prompt.append("\nEmail:\n")
                .append(emailRequest.getEmailContent());

        prompt.append("\n\nRules:");
        prompt.append("\n- short → make it concise");
        prompt.append("\n- polite → make it respectful");
        prompt.append("\n- formal → make it professional");

        return prompt.toString();
    }
}