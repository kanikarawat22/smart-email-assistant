Smart Email Assistant: Full-Stack AI Email Toolkit
An integrated, full-stack solution for generating context-aware, tonally versatile email replies using the Gemini API. This project consists of a core Spring Boot backend, a dedicated web interface, and a seamless Chrome extension for direct Gmail integration.

Features
The Smart Email Assistant provides three distinct tools to enhance email communication:

1. Core Service: Spring Boot & Gemini API
Intelligent Content Generation: Leverages the Gemini API via a robust Spring Boot backend to generate high-quality, human-like email content based on user prompts and existing email threads.
Tone Control API: The service accepts a required tone parameter (e.g., formal, casual, persuasive, urgent) to guide the AI's output, ensuring the message matches the professional or personal context.
Scalable Architecture: Provides a secure, centralized API layer for all frontend components (Web Browser and Chrome Extension) to interact with the AI model, keeping the API key secure on the server side.

2. Chrome Extension (Gmail Integration)
One-Click AI Reply: Injects an easily accessible "AI Reply" button directly into the standard Gmail reply interface.
Contextual Understanding: The extension captures the content of the current email thread, sending it to the backend to generate a relevant, context-aware reply draft.
Seamless Workflow: Allows users to quickly generate and insert suggested replies without ever leaving their inbox.


4. Web Generator Interface (Standalone Application)
Tone Selector Dashboard: A dedicated web application where users can input their general email topic and explicitly select from a comprehensive list of tones (e.g., Friendly, Direct, Skeptical, Inspirational).
Real-time Generation: Provides an interactive sandbox environment for testing different tones and refining detailed prompts before the final content is generated.
Customizable Prompts: Supports detailed, specific user inputs to guide the AI generation process for complex messages.


The project utilizes a clear separation of concerns, following a standard microservice pattern. The Spring Boot application acts as the control center, ensuring secure and efficient interaction with the AI model.

Frontend Clients (Chrome Extension / Web App): Initiate the request, passing the user's query, the required tone, and the email context (if applicable) to the backend.

Spring Boot Backend (Java): Serves as a secure gateway. It receives the request, constructs the appropriate prompt payload, securely applies the GEMINI_API_KEY, and sends the request to Google's infrastructure.

Gemini API: Processes the request, generates the output text, and sends it back to the Spring Boot application.

Spring Boot Backend: Parses the AI response and forwards the clean, generated email text back to the corresponding client interface.
