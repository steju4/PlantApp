import React from "react";

import "../components/css/DilemmaOverview.css";
import { UserData } from "../constants/interfaces";
interface Gardenspots_Props {
  userData: UserData;
  closeGardenSpotsModal: () => void;
  editSpot: (ID: number) => void;
  deleteSpot: (ID: number) => void;
  openGardenSpotModal: () => void;
}

const Gardenspots: React.FC<Gardenspots_Props> = ({
  userData,
  closeGardenSpotsModal,
  editSpot,
  deleteSpot,
  openGardenSpotModal,
}) => {


 

  return (
    <div style={{display:"flex", justifyContent:"center"}}>
      {userData?.garden_spots.map((spot) => (
        <div
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            margin: "10px",
            height: "200px",
            width: "200px",
          }}
          
          onClick={() => {
            openGardenSpotModal();
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
