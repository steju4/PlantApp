package com.webengineering.plantapp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Konfiguriert CORS (Cross-Origin Resource Sharing).
 * Erlaubt dem Frontend, Anfragen an das Backend zu senden, auch wenn sie von unterschiedlichen Ports/Domains kommen.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Definiert die globalen CORS-Regeln für die Anwendung.
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // Gilt für alle API-Pfade.
            .allowedOriginPatterns("*") // Erlaubt Anfragen von allen Ursprüngen (Domains).
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Erlaubt diese HTTP-Methoden.
            .allowedHeaders("*") // Erlaubt alle Anfrage-Header.
            .allowCredentials(true); // Erlaubt das Senden von Credentials (z.B. Cookies).
    }
}