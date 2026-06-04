package com.kanika.email_generator.app;

import lombok.Data;

@Data
public class EmailRequest 
{
    private String emailContent;
    private String tone;
    private String mode;

}
