package com.webengineering.plantapp.backend.repository;

import com.webengineering.plantapp.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository für CRUD-Operationen an User
public interface UserRepository extends JpaRepository<User, Long> {
    // Sucht einen Benutzer über seine E-Mail-Adresse
    Optional<User> findByEmail(String email);
}