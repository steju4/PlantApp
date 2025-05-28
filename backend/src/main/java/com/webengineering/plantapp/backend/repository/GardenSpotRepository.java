package com.webengineering.plantapp.backend.repository;

import com.webengineering.plantapp.backend.model.GardenSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GardenSpotRepository extends JpaRepository<GardenSpot, Long> {
    List<GardenSpot> findByUserId(Long userId);
}