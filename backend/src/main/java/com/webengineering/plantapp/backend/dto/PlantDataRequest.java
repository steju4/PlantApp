package com.webengineering.plantapp.backend.dto;

/**
 * Data Transfer Object (DTO) für Anfragen vom Frontend, um Pflanzendaten zu übermitteln.
 * Wird verwendet, wenn eine neue Pflanze erstellt oder eine bestehende aktualisiert wird.
 */
public class PlantDataRequest {
    // ID der Pflanze aus einer externen API (z.B. Perenual).
    private Long externalPlantId;
    // Allgemeiner Name der Pflanze.
    private String commonName;
    // URL zu einem Vorschaubild der Pflanze.
    private String thumbnail;
    // Anzahl dieser Pflanze.
    private int amount;
    // Benötigte Sonneneinstrahlung.
    private String sunlight;
    // Bewässerungsbedarf.
    private String watering;
    // Pflegeaufwand.
    private String careLevel;
    // Monate für den Rückschnitt.
    private String pruningMonth;
    // Lebenszyklus der Pflanze.
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

    // Standard Getter- und Setter-Methoden für alle Felder.
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