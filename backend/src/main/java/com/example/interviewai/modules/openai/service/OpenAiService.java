package com.example.interviewai.modules.openai.service;

import com.example.interviewai.modules.interview.model.InterviewType;
import com.example.interviewai.modules.openai.dto.OpenAiFeedbackResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.model:gpt-4.1-mini}")
    private String model;

    @Value("${openai.base-url:https://api.openai.com/v1}")
    private String baseUrl;

    @Value("${app.ai.provider:ollama}")
    private String aiProvider;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:qwen3:8b}")
    private String ollamaModel;

    public List<String> generateQuestions(String roleName, String level, InterviewType type) {
        String prompt = """
                You are an expert technical interviewer.
                Generate exactly 5 concise interview questions for this candidate profile.
                Role: %s
                Level: %s
                Interview type: %s
                Return strict JSON with this shape:
                {"questions":["question 1","question 2","question 3","question 4","question 5"]}
                No markdown.
                """.formatted(roleName, level, type.name());

        try {
            String text = generateText(prompt);
            JsonNode node = objectMapper.readTree(extractJson(text));
            JsonNode questionsNode = node.isArray() ? node : node.path("questions");
            if (!questionsNode.isArray()) {
                return mockQuestions(roleName, level, type);
            }
            List<String> questions = objectMapper.readerForListOf(String.class).readValue(questionsNode);
            return questions.stream().filter(question -> !question.isBlank()).limit(5).toList();
        } catch (Exception ex) {
            return mockQuestions(roleName, level, type);
        }
    }

    public OpenAiFeedbackResult generateFeedback(String question, String answer) {
        String prompt = """
                Evaluate this interview answer.
                Return strict JSON with keys:
                score: number from 0 to 10,
                strengths: array of strings,
                weaknesses: array of strings,
                improvedAnswer: string,
                recommendation: string.

                Question:
                %s

                Candidate answer:
                %s
                """.formatted(question, answer);

        try {
            JsonNode node = objectMapper.readTree(extractJson(generateText(prompt)));
            return new OpenAiFeedbackResult(
                    node.path("score").decimalValue(),
                    objectMapper.readerForListOf(String.class).readValue(node.path("strengths")),
                    objectMapper.readerForListOf(String.class).readValue(node.path("weaknesses")),
                    node.path("improvedAnswer").asText(),
                    node.path("recommendation").asText()
            );
        } catch (Exception ex) {
            return mockFeedback();
        }
    }

    private String generateText(String prompt) {
        if ("openai".equalsIgnoreCase(aiProvider)) {
            if (apiKey == null || apiKey.isBlank()) {
                throw new IllegalStateException("OPENAI_API_KEY is required when AI_PROVIDER=openai");
            }
            return callResponsesApi(prompt);
        }
        return callOllamaApi(prompt);
    }

    private String callOllamaApi(String prompt) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", ollamaModel);
        payload.put("prompt", prompt);
        payload.put("stream", false);
        payload.put("format", "json");

        JsonNode response = webClientBuilder
                .baseUrl(ollamaBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .uri("/api/generate")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return response == null ? "" : response.path("response").asText("");
    }

    // OpenAI Responses API path. Enable with AI_PROVIDER=openai and OPENAI_API_KEY.
    private String callResponsesApi(String prompt) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("input", prompt);
        payload.put("temperature", 0.3);

        JsonNode response = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .uri("/responses")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return extractOutputText(response);
    }

    private String extractOutputText(JsonNode response) {
        JsonNode outputText = response == null ? null : response.path("output_text");
        if (outputText != null && outputText.isTextual()) {
            return outputText.asText();
        }
        JsonNode output = response == null ? null : response.path("output");
        if (output != null && output.isArray()) {
            for (JsonNode item : output) {
                for (JsonNode content : item.path("content")) {
                    if ("output_text".equals(content.path("type").asText()) && content.path("text").isTextual()) {
                        return content.path("text").asText();
                    }
                }
            }
        }
        return "";
    }

    private String extractJson(String text) {
        String cleaned = text == null ? "" : text.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```(?:json)?", "").replaceFirst("```$", "").trim();
        }
        int objectStart = cleaned.indexOf('{');
        int arrayStart = cleaned.indexOf('[');
        if (arrayStart >= 0 && (objectStart < 0 || arrayStart < objectStart)) {
            int end = cleaned.lastIndexOf(']');
            return end >= arrayStart ? cleaned.substring(arrayStart, end + 1) : cleaned;
        }
        if (objectStart >= 0) {
            int end = cleaned.lastIndexOf('}');
            return end >= objectStart ? cleaned.substring(objectStart, end + 1) : cleaned;
        }
        return cleaned;
    }

    private List<String> mockQuestions(String roleName, String level, InterviewType type) {
        return List.of(
                "Tell me about a recent project where you had to make a difficult technical tradeoff.",
                "How would you approach debugging a production issue in a " + roleName + " role?",
                "Explain a core concept a " + level + " " + roleName + " should understand deeply.",
                "Describe how you would communicate risk and progress to stakeholders.",
                "Walk through how you would improve a system or workflow related to " + type.name().toLowerCase().replace("_", " ") + "."
        );
    }

    private OpenAiFeedbackResult mockFeedback() {
        return new OpenAiFeedbackResult(
                BigDecimal.valueOf(7.5),
                List.of("Clear structure", "Relevant examples", "Good ownership signal"),
                List.of("Add more measurable impact", "Discuss tradeoffs more explicitly"),
                "A stronger answer would briefly set context, explain the action taken, describe tradeoffs, and close with measurable impact.",
                "Use a concise STAR structure and add one concrete metric or outcome."
        );
    }
}
