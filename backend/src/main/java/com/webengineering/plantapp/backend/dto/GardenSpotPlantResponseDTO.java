package com.webengineering.plantapp.backend.dto;

/**
 * Data Transfer Object (DTO) für die Rückgabe von Pflanzeninformationen an das Frontend.
 * Enthält alle relevanten Felder einer Pflanze, die angezeigt werden sollen.
 */
public class GardenSpotPlantResponseDTO {
    // Eindeutige ID der Pflanze in der Datenbank.
    private Long id;
    // ID der Pflanze aus einer externen API (z.B. Perenual).
    private Long externalPlantId;
    // Allgemeiner Name der Pflanze.
    private String commonName;
    // URL zu einem Vorschaubild der Pflanze.
    private String thumbnail;
    // Anzahl dieser Pflanze im Garden Spot.
    private int amount;
    // Benötigte Sonneneinstrahlung.
    private String sunlight;
    // Bewässerungsbedarf.
    private String watering;
    // Pflegeaufwand.
    private String careLevel;
    // Monate für den Rückschnitt.
    private String pruningMonth;
    // Lebenszyklus der Pflanze (z.B. mehrjährig).
    private String cycle;
    // Wachstumsgeschwindigkeit.
    private String growthRate;
    // Gibt an, ob die Pflanze trockenheitstolerant ist.
    private boolean droughtTolerant;
    // Gibt an, ob die Pflanze für den Innenbereich geeignet ist.
    private boolean indoor;
    // Gibt an, ob die Pflanze medizinische Eigenschaften hat.
    private boolean medicinal;
    // Beschreibung der Pflanze.
    private String description;
    // Herkunft der Pflanze.
    private String origin;

    /**
     * Konstruktor zum Erstellen eines GardenSpotPlantResponseDTO-Objekts.
     * Initialisiert alle Felder des DTOs.
     */
    public GardenSpotPlantResponseDTO(
        Long id, Long externalPlantId, String commonName, String thumbnail, int amount,
        String sunlight, String watering, String careLevel, String pruningMonth, String cycle,
        String growthRate, boolean droughtTolerant, boolean indoor, boolean medicinal,
        String description, String origin
    ) {
        this.id = id;
        this.externalPlantId = externalPlantId;
        this.commonName = commonName;
        this.thumbnail = thumbnail;
        this.amount = amount;
        this.sunlight = sunlight;
        this.watering = watering;
        this.careLevel = careLevel;
        this.pruningMonth = pruningMonth;
        this.cycle = cycle;
        this.growthRate = growthRate;
        this.droughtTolerant = droughtTolerant;
        this.indoor = indoor;
        this.medicinal = medicinal;
        this.description = description;
        this.origin = origin;
    }

    // Standard Getter- und Setter-Methoden für alle Felder.
    // Ermöglichen den Zugriff und die Modifikation der Feldwerte.
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
}