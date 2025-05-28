import React from "react";

import "../components/css/dashboard.css";
import { UserData } from "../constants/interfaces";
import { Spot } from "../constants/interfaces";

interface Gardenspots_Props {
  gardenSpots: Spot[];
  userData?: UserData;
  closeGardenSpotsModal: () => void;
  editSpot: (ID: number) => void;
  deleteSpot: (ID: number) => void;
  openGardenSpotModal: (spot: Spot) => void;
}

const Gardenspots: React.FC<Gardenspots_Props> = ({
  gardenSpots,
  userData,
  closeGardenSpotsModal,
  editSpot,
  deleteSpot,
  openGardenSpotModal,
}) => {



  // ...existing code...
  return (
    <div style={{display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: "0 auto"}}>
      {gardenSpots.map((spot) => (
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
            padding: "10px" 
          }}
          onClick={() => {
            openGardenSpotModal(spot);
          }}
        >
            {/* Spot Name */}
            <div style={{fontWeight:"bold", textAlign: "center", marginBottom: "5px", flexShrink: 0}}>
              {spot.name}
            </div>
            {/* Bild Container */}
            <div style={{
              flexGrow: 1, 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity:"0.05",
              overflow: "hidden", 
              width: "100%" 
            }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/13825/13825771.png"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
        </div>
      ))}
    </div>
  );
};

export default Gardenspots;
