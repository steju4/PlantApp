package com.webengineering.plantapp.backend.service;

import com.webengineering.plantapp.backend.model.User;
import com.webengineering.plantapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service // Kennzeichnet die Klasse als Service-Komponente
public class UserService {

    @Autowired
    private UserRepository userRepository;      // Repository für User-Entitäten

    @Autowired
    private PasswordEncoder passwordEncoder;    // PasswordEncoder für Hashing

    /**
     * Registriert einen neuen Benutzer.
     * Hashes das Passwort und speichert den User.
     */
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Prüft Login-Daten.
     * Vergleicht E-Mail und Passwort-Hash.
     */
    public Optional<User> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() &&
            passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    /**
     * Prüft, ob eine E-Mail bereits existiert.
     */
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Sucht einen Benutzer anhand der E-Mail.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}