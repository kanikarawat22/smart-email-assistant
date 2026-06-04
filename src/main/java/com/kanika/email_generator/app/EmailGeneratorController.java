package com.kanika.email_generator.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        try {
            return ResponseEntity.ok(
                emailGeneratorService.generatedEmailReply(emailRequest)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error generating email: " + e.getMessage());
        }
    }

    @PostMapping("/improve")
    public ResponseEntity<String> improveEmail(@RequestBody EmailRequest emailRequest) {
        try {
            return ResponseEntity.ok(
                emailGeneratorService.improveEmailReply(emailRequest)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error improving email: " + e.getMessage());
        }
    }
}