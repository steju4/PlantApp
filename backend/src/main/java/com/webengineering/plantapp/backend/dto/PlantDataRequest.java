package com.webengineering.plantapp.backend.dto;

public class PlantDataRequest {
    private Long externalPlantId;
    private String commonName;
    private String thumbnail;
    private int amount;
    private String sunlight;
    private String watering;
    private String careLevel;
    private String pruningMonth;
    private String cycle;
    private String growthRate;
    private boolean droughtTolerant;
    private boolean indoor;
    private boolean medicinal;
    private String description;
    private String origin;

    // Getter und Setter
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