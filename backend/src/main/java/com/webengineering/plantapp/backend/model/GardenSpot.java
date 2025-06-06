package com.webengineering.plantapp.backend.model;

import javax.persistence.*;
import java.util.List;

/**
 * Entitätsklasse, die einen "Garden Spot" (Gartenstandort) repräsentiert.
 * Wird von JPA verwendet, um eine Datenbanktabelle abzubilden.
 */
@Entity // Markiert diese Klasse als JPA-Entität.
public class GardenSpot {

    @Id // Definiert dieses Feld als Primärschlüssel.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Konfiguriert die automatische Generierung des Primärschlüssels.
    private Long id;

    // Name des Garden Spots.
    private String name;
    // Straße des Garden Spots.
    private String street;
    // Hausnummer.
    private String streetNumber;
    // Postleitzahl.
    private String postalCode;
    // Stadt.
    private String city;
    // Optional für Weiterentwicklung: Pfad für ein Logo/Bild des Garden Spots.
    private String logo;

    // Definiert eine Many-to-One-Beziehung zu einem Benutzer.
    // Ein Garden Spot gehört zu genau einem Benutzer.
    @ManyToOne
    @JoinColumn(name = "user_id") // Definiert die Fremdschlüsselspalte in der GardenSpot-Tabelle.
    private User user;

    // Definiert eine One-to-Many-Beziehung zu GardenSpotPlant.
    // Ein Garden Spot kann viele Pflanzen haben.
    @OneToMany(mappedBy = "gardenSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    // mappedBy: Gibt an, dass die Beziehung von der 'gardenSpot'-Eigenschaft in GardenSpotPlant verwaltet wird.
    // cascade = CascadeType.ALL: Operationen (Speichern, Löschen etc.) werden auf zugehörige Pflanzen kaskadiert.
    // orphanRemoval = true: Verwaiste Pflanzen (nicht mehr mit diesem Spot verbunden) werden automatisch gelöscht.
    private List<GardenSpotPlant> plants;

    // Standard Getter- und Setter-Methoden für alle Felder.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getStreetNumber() { return streetNumber; }
    public void setStreetNumber(String streetNumber) { this.streetNumber = streetNumber; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    // Getter und Setter für die Pflanzenliste (wichtig für JPA und die Verwaltung der Beziehung).
    public List<GardenSpotPlant> getPlants() { return plants; }
    public void setPlants(List<GardenSpotPlant> plants) { this.plants = plants; }
}