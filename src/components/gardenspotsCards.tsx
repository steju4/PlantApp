import React from "react";                                 // React-Grundlage

import "../components/css/dashboard.css";                  // Styles
import { UserData, Spot } from "../constants/interfaces";  // Schnittstellen

// Props für die Gardenspots-Komponente
interface Gardenspots_Props {
  gardenSpots: Spot[];            // Liste der Garden Spots
  userData?: UserData;            // (optional) Nutzerdaten
  closeGardenSpotsModal: () => void;
  editSpot: (ID: number) => void;
  deleteSpot: (ID: number) => void;
  openGardenSpotModal: (spot: Spot) => void;
}

const Gardenspots: React.FC<Gardenspots_Props> = ({
  gardenSpots,
  closeGardenSpotsModal,
  userData,
  editSpot,
  deleteSpot,
  openGardenSpotModal,
}) => {
  return (
    // Flex-Container für die Karten
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      {gardenSpots.map((spot) => (
        // Einzelne Spot-Karte
        <div
          key={spot.id}
          style={{
            flex: "0 0 calc(50% - 20px)",
            margin: "10px",
            boxSizing: "border-box",
            border: "1px solid black",
            borderRadius: "10px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
          }}
          onClick={() => openGardenSpotModal(spot)} // beim Klick Modal öffnen
        >
          {/* Spot-Name */}
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "5px",
              flexShrink: 0,
            }}
          >
            {spot.name}
          </div>

          {/* Platzhalter-Bild */}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: "0.05",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/13825/13825771.png"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gardenspots; 