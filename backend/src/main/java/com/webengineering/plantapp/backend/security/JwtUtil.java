package com.webengineering.plantapp.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component // Kennzeichnet die Klasse als Spring-Bean
public class JwtUtil {
    private final String SECRET_KEY = "dein_geheimer_schluessel"; // Geheimer Schlüssel zum Signieren der Tokens

    // Erzeugt ein JWT mit der angegebenen E-Mail als Subject, gültig für 10 Stunden
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Liest die E-Mail (Subject) aus dem Token aus
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Überprüft, ob das Token zur E-Mail passt und noch nicht abgelaufen ist
    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    // Extrahiert alle Claims (Daten) aus dem Token
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    // Prüft, ob das Token bereits abgelaufen ist
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Alias für extractEmail, verwendet in den Controllern
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }
}