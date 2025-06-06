package com.webengineering.plantapp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Konfigurationsklasse für Spring Security.
 * Definiert Sicherheitsregeln und -mechanismen für die Anwendung.
 */
@Configuration
public class SecurityConfig {

    /**
     * Stellt einen PasswordEncoder bereit.
     * Dieser wird genutzt, um Passwörter sicher zu hashen (hier mit BCrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Konfiguriert die HTTP-Sicherheitsregeln.
     * Legt fest, wie Anfragen behandelt und gesichert werden.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // Aktiviert CORS (Cross-Origin Resource Sharing).
            .and()
            .csrf().disable() // Deaktiviert CSRF-Schutz.
            .authorizeRequests() // Startet die Konfiguration der Zugriffsberechtigungen.
            .anyRequest().permitAll(); // Erlaubt alle Anfragen ohne Authentifizierung (für dieses Setup).
        return http.build(); // Baut und gibt die SecurityFilterChain zurück.
    }
}