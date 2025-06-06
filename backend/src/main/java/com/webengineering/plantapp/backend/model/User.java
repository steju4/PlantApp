package com.webengineering.plantapp.backend.model;

import javax.persistence.*;

@Entity
// Entität für einen Anwendungsbenutzer
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;            // Primärschlüssel: eindeutige Benutzer-ID

    @Column(unique = true, nullable = false)
    private String email;       // Login-E-Mail (einzigartig, Pflichtfeld)

    private String password;    // Gehashtes Passwort
    private String firstName;   // Vorname
    private String lastName;    // Nachname
    private String cityName;    // Stadt
    private String zipCode;     // Postleitzahl

    // Getter/Setter für alle Felder
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}