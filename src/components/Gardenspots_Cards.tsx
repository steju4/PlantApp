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



  return (
    <div style={{display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: "0 auto"}}>
      {gardenSpots.map((spot) => (
        <div
          key={spot.id}
          style={{
            flex: "0 0 calc(50% - 20px)",    // zwei Spalten
          margin: "10px",
          boxSizing: "border-box",
          border: "1px solid black",
          borderRadius: "10px",
          height: "200px"
          }}
          
          onClick={() => {
            openGardenSpotModal(spot); // Hier übergeben wir das gesamte Spot-Objekt
          }}
        >
            <div style={{justifyItems:"center", fontWeight:"bold"}}>
          {spot.name}
          <div style={{maxWidth:"200px",maxHeight:"200px", marginTop:"10px", opacity:"0.05"}}>
          <img src="https://cdn-icons-png.flaticon.com/512/13825/13825771.png" />

          </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default Gardenspots;
