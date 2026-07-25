package com.example.interviewai.modules.openai.service;

import com.example.interviewai.modules.interview.model.InterviewType;
import com.example.interviewai.modules.openai.dto.GeneratedQuestion;
import com.example.interviewai.modules.openai.dto.OpenAiFeedbackResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
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

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String geminiBaseUrl;

    public List<GeneratedQuestion> generateQuestions(String roleName, String level, InterviewType type) {
        String prompt = """
                You are an expert technical interviewer.
                Generate exactly 5 multiple-choice interview questions for this candidate profile.
                Role: %s
                Level: %s
                Interview type: %s
                Each question must have exactly 4 answer options, with exactly one correct option.
                Vary the position of the correct option across questions.
                Return strict JSON with this shape:
                {"questions":[{"prompt":"question text","options":["A","B","C","D"],"correctIndex":0}]}
                correctIndex is the zero-based index of the correct option.
                No markdown.
                """.formatted(roleName, level, type.name());

        try {
            String text = generateText(prompt);
            JsonNode node = objectMapper.readTree(extractJson(text));
            JsonNode questionsNode = node.isArray() ? node : node.path("questions");
            if (!questionsNode.isArray()) {
                return mockQuestions(roleName, level, type);
            }
            List<GeneratedQuestion> questions = new java.util.ArrayList<>();
            for (JsonNode item : questionsNode) {
                GeneratedQuestion parsed = parseQuestion(item);
                if (parsed != null) {
                    questions.add(parsed);
                }
            }
            return questions.isEmpty() ? mockQuestions(roleName, level, type) : questions.stream().limit(5).toList();
        } catch (Exception ex) {
            log.warn("Question generation failed, returning mock questions: {}", ex.getMessage(), ex);
            return mockQuestions(roleName, level, type);
        }
    }

    private GeneratedQuestion parseQuestion(JsonNode item) throws Exception {
        String prompt = item.path("prompt").asText("").trim();
        JsonNode optionsNode = item.path("options");
        if (prompt.isBlank() || !optionsNode.isArray() || optionsNode.size() < 2) {
            return null;
        }
        List<String> rawOptions = objectMapper.readerForListOf(String.class).readValue(optionsNode);
        List<String> options = rawOptions.stream()
                .filter(option -> option != null && !option.isBlank()).map(String::trim).toList();
        if (options.size() < 2) {
            return null;
        }
        int correctIndex = item.path("correctIndex").asInt(0);
        if (correctIndex < 0 || correctIndex >= options.size()) {
            correctIndex = 0;
        }
        return new GeneratedQuestion(prompt, options, correctIndex);
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
            log.warn("Feedback generation failed, returning mock feedback: {}", ex.getMessage(), ex);
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
        if ("gemini".equalsIgnoreCase(aiProvider)) {
            if (geminiApiKey == null || geminiApiKey.isBlank()) {
                throw new IllegalStateException("GEMINI_API_KEY is required when AI_PROVIDER=gemini");
            }
            return callGeminiApi(prompt);
        }
        return callOllamaApi(prompt);
    }

    // Google Gemini generateContent API. Enable with AI_PROVIDER=gemini and GEMINI_API_KEY.
    private String callGeminiApi(String prompt) {
        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> generationConfig = new LinkedHashMap<>();
        generationConfig.put("temperature", 0.3);
        generationConfig.put("responseMimeType", "application/json");
        generationConfig.put("maxOutputTokens", 4096);
        generationConfig.put("thinkingConfig", Map.of("thinkingLevel", "low"));

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("contents", List.of(content));
        payload.put("generationConfig", generationConfig);

        JsonNode response = webClientBuilder
                .baseUrl(geminiBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("x-goog-api-key", geminiApiKey)
                .build()
                .post()
                .uri("/models/{model}:generateContent", geminiModel)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        return extractGeminiText(response);
    }

    private String extractGeminiText(JsonNode response) {
        if (response == null) {
            return "";
        }
        for (JsonNode candidate : response.path("candidates")) {
            for (JsonNode part : candidate.path("content").path("parts")) {
                if (part.path("text").isTextual()) {
                    return part.path("text").asText();
                }
            }
        }
        return "";
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

    private List<GeneratedQuestion> mockQuestions(String roleName, String level, InterviewType type) {
        String topic = type.name().toLowerCase().replace("_", " ");
        return List.of(
                new GeneratedQuestion(
                        "For a " + level + " " + roleName + ", which practice most improves code maintainability?",
                        List.of("Writing clear, well-named, tested code", "Avoiding all code comments",
                                "Maximizing lines of code", "Skipping code reviews to move faster"), 0),
                new GeneratedQuestion(
                        "When debugging a production issue, what is the best first step?",
                        List.of("Restart every server immediately", "Reproduce and isolate the problem from logs and metrics",
                                "Blame the last person who deployed", "Roll back all changes from the past month"), 1),
                new GeneratedQuestion(
                        "How should you communicate risk and progress to stakeholders?",
                        List.of("Only report once the project is finished", "Hide risks until they become blockers",
                                "Share regular, honest updates with clear tradeoffs", "Send raw logs with no summary"), 2),
                new GeneratedQuestion(
                        "Which approach best handles a difficult technical tradeoff?",
                        List.of("Always pick the newest technology", "Always pick the cheapest option",
                                "Ignore non-functional requirements", "Weigh constraints, cost, and long-term impact"), 3),
                new GeneratedQuestion(
                        "What most improves a workflow related to " + topic + "?",
                        List.of("Automating repetitive, error-prone steps", "Adding more manual approvals everywhere",
                                "Removing all monitoring", "Documenting nothing to save time"), 0)
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
