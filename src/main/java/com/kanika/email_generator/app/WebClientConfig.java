package com.kanika.email_generator.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // This method creates and provides the WebClient.Builder bean
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}