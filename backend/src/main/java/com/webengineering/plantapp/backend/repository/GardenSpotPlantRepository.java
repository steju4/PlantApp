package com.webengineering.plantapp.backend.repository;

import com.webengineering.plantapp.backend.model.GardenSpotPlant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

import javax.transaction.Transactional;

public interface GardenSpotPlantRepository extends JpaRepository<GardenSpotPlant, Long> {
    List<GardenSpotPlant> findByGardenSpotId(Long gardenSpotId);

    @Modifying
    @Transactional
    void deleteAllByGardenSpotId(Long gardenSpotId);
}