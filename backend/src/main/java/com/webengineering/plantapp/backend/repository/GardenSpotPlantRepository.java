package com.webengineering.plantapp.backend.repository;

import com.webengineering.plantapp.backend.model.GardenSpotPlant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

import javax.transaction.Transactional;

// Repository für CRUD-Operationen an GardenSpotPlant
public interface GardenSpotPlantRepository extends JpaRepository<GardenSpotPlant, Long> {
    // Holt alle GardenSpotPlant-Einträge zu einem bestimmten GardenSpot
    List<GardenSpotPlant> findByGardenSpotId(Long gardenSpotId);

    // Löscht alle GardenSpotPlant-Einträge eines bestimmten GardenSpot
    @Modifying
    @Transactional
    void deleteAllByGardenSpotId(Long gardenSpotId);
}