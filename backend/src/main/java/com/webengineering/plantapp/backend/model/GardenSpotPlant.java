package com.webengineering.plantapp.backend.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entität für eine Pflanze in einem GardenSpot.
 */
@Entity
public class GardenSpotPlant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // Primärschlüssel

    private Long externalPlantId;         // ID aus externer Pflanzen-API
    private String commonName;            // Pflanzenname
    private String thumbnail;             // Bild-URL
    private int amount;                   // Anzahl im Spot

    @Column(length = 1024)
    private String sunlight;              // Sonneneinstrahlung
    private String watering;              // Bewässerungsbedarf
    private String careLevel;             // Pflegeaufwand

    @Column(length = 1024)
    private String pruningMonth;          // Rückschnittmonat
    private String cycle;                 // Lebenszyklus
    private String growthRate;            // Wachstumsgeschwindigkeit

    private boolean droughtTolerant;      // trockenheitstolerant?
    private boolean indoor;               // geeignet für Innenbereich?
    private boolean medicinal;            // medizinische Eigenschaften?

    @Column(columnDefinition = "TEXT")
    private String description;           // Beschreibung

    @Column(length = 1024)
    private String origin;                // Herkunft

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garden_spot_id", nullable = false)
    @JsonIgnore
    private GardenSpot gardenSpot;        // Zu welchem Spot die Pflanze gehört

    public GardenSpotPlant() { }

    // Standard-Getter und -Setter für alle Felder
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getExternalPlantId() { return externalPlantId; }
    public void setExternalPlantId(Long externalPlantId) { this.externalPlantId = externalPlantId; }
    public String getCommonName() { return commonName; }
    public void setCommonName(String commonName) { this.commonName = commonName; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    public String getSunlight() { return sunlight; }
    public void setSunlight(String sunlight) { this.sunlight = sunlight; }
    public String getWatering() { return watering; }
    public void setWatering(String watering) { this.watering = watering; }
    public String getCareLevel() { return careLevel; }
    public void setCareLevel(String careLevel) { this.careLevel = careLevel; }
    public String getPruningMonth() { return pruningMonth; }
    public void setPruningMonth(String pruningMonth) { this.pruningMonth = pruningMonth; }
    public String getCycle() { return cycle; }
    public void setCycle(String cycle) { this.cycle = cycle; }
    public String getGrowthRate() { return growthRate; }
    public void setGrowthRate(String growthRate) { this.growthRate = growthRate; }
    public boolean isDroughtTolerant() { return droughtTolerant; }
    public void setDroughtTolerant(boolean droughtTolerant) { this.droughtTolerant = droughtTolerant; }
    public boolean isIndoor() { return indoor; }
    public void setIndoor(boolean indoor) { this.indoor = indoor; }
    public boolean isMedicinal() { return medicinal; }
    public void setMedicinal(boolean medicinal) { this.medicinal = medicinal; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public GardenSpot getGardenSpot() { return gardenSpot; }
    public void setGardenSpot(GardenSpot gardenSpot) { this.gardenSpot = gardenSpot; }
}