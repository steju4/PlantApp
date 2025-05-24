import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonIcon,
  IonHeader,
  IonButtons,
  IonModal,
} from "@ionic/react";
// import { StatusBar, Style } from "@capacitor/status-bar";
import { add } from "ionicons/icons";
import "../components/css/dashboard.css";
import "../components/css/global.css";
import { PlantDetails, UserData } from "../constants/interfaces";
import { pingSpeciesAPI } from "../scripts/plant_api_species";
import { pingAPI } from "../scripts/plant_api";
import RegisterModal from "../components/modals/register";
import LoginModal from "../components/modals/login";
import AddGardenSpotModal from "../components/modals/AddGardenSpotModal";
import OpenGardenSpotModal from "../components/modals/OpenGardenSpotModal";
import Gardenspots from "../components/Gardenspots_Cards";
import Logo from '../../public/assets/icon/logo.png';

interface DashboardProps {
  token: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    setUserData({
      id: 187,
      garden_spots: [
        {
          id: Date.now(),
          name: "Gartenhaus",
          postal_code: "187777",
          street: "Peniskopfallee",
          street_number: 21,
          city: "Friedrichshafen",
          plants: [],
          logo: "",
        },
        {
          id: Date.now(),
          name: "Gewächshaus",
          postal_code: "187777",
          street: "Peniskopfallee",
          street_number: 21,
          city: "Friedrichshafen",
          plants: [],
          logo: "",
        },
      ],
      email_adress: "penis.kopf",
      first_name: "Jürgi",
      last_name: "Schneider",
      postal_code: "187777",
      city: "Hurensohnhausen",
      password: "IchBinToll123",
    });
  });
  const [plants, setPlants] = useState<PlantDetails>({
    id: 0,
    common_name: "",
    pruning_month: [],
    scientific_name: "",
    default_image: { thumbnail: "" },
    description: "",
    growth_rate: "",
    origin: [""],
    sunlight: [],
    watering: "",
  });
  const [visibility, setVisibility] = useState("hidden");
  const [searchterm, setSearchterm] = useState("");

  const [userName, setUserName] = useState<string | null>(null);

  const [selectedGardenSpotName, setSelectedGardenSpotName] = useState<string>("");


  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.firstName) setUserName(data.firstName);
        });
    }
  }, [token]);

    

//   useEffect(() => {
//     StatusBar.setStyle({ style: Style.Dark });
//   });

//   useEffect(() => {
//     const statusBarHeight = window.navigator.userAgent.includes("Android")
//       ? 24
//       : 0;
//     document.documentElement.style.setProperty(
//       "--status-bar-height",
//       `${statusBarHeight}px`
//     );
//   });

  const testfun = async () => {
    const result = await pingAPI(await pingSpeciesAPI(searchterm));
    if (result) {
      setPlants(result);
      setVisibility("visible");
      console.log("MARKER1");
      console.log(searchterm);
      console.log("ID: " + result.id);
      console.log("Common Name: " + result.common_name);
      console.log("Scientific Name: " + result.scientific_name);
      console.log("Origin: " + result.origin);
      console.log("Sunlight: " + result.sunlight);
      console.log("Pruning Months: " + result.pruning_month);
      console.log("Growth Rate: " + result.growth_rate);
      console.log("Description: " + result.description);
      console.log("default_image: " + result.default_image.thumbnail);
    }
  };
 
  const editSpot = () => {
    console.log("editSpot")
  }
  const deleteSpot = () => {
    console.log("deleteSpot")

  }
  const addGardenSpot = useRef<HTMLIonModalElement>(null);
  const openGardenSpotModal = useRef<HTMLIonModalElement>(null);

  const showOpenGardenSpotModal = (gardenSpotName: string) => {
    setSelectedGardenSpotName(gardenSpotName);
    openGardenSpotModal.current?.present(); // aktuelle Ref nutzen
  };

  const closeGardenSpotDilemma = () => {
    addGardenSpot.current?.dismiss();
  };
  const closeGardenSpotModal = () => {
    openGardenSpotModal.current?.dismiss();
  };

  const newGardenSpot = () => {
    console.log("newGardenSpot");
  };
  const openGardenSpot = () => {
    console.log("openGardenSpot");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <img src={Logo} alt="Logo" style={{ height: 50, marginLeft: 10, marginRight: 0 }} />
          </IonButtons>
          <IonTitle style={{ paddingLeft: "5px" }}>PlantApp</IonTitle>
      </IonToolbar>
    </IonHeader>
    <div
      style={{
        maxWidth: "100%",
        background: "linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)",
        color: "white",
        padding: "20px 2.5% 15px 2.5%",
        textAlign: "center",
        marginBottom: "0px",
        margin: "0",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 700, fontSize: "2rem", letterSpacing: "1px" }}>
        Welcome{userName ? `, ${userName}` : ""}!
      </h1>
      <p style={{ fontSize: "1rem", fontWeight: 400 }}>
        We're glad you're here. Here you can see all your locations and plants at a glance.
      </p>
    </div>

    <div
      style={{
        textAlign: "center",
      }}
    >
      <h2
        style={{
          display: "inline-block",
          background: "linear-gradient(90deg, #388E3C 0%, #81C784 100%)",
          color: "white",
          padding: "10px 36px",
          borderRadius: "18px",
          fontWeight: 600,
          fontSize: "1.3rem",
          boxShadow: "0 2px 8px rgba(56,142,60,0.08)",
          letterSpacing: "0.5px",
        }}
      >
        Your Locations
      </h2>
    </div>


      <Gardenspots
  userData={userData}
  closeGardenSpotsModal={() => openGardenSpotModal.current?.dismiss()}
  editSpot={editSpot}
  deleteSpot={deleteSpot}
  openGardenSpotModal={(name: string) => {
    setSelectedGardenSpotName(name);
    openGardenSpotModal.current?.present();
  }}
/>


      <IonModal
          ref={openGardenSpotModal}
          style={{
            '--width': '100vw',
            '--height': '100vh',
            '--border-radius': '0',
            '--max-width': '100vw',
            '--max-height': '100vh'
          }}
      >
        <OpenGardenSpotModal
          openGardenSpot={openGardenSpot}
          closeGardenSpotModal={closeGardenSpotModal}
          gardenSpotName={selectedGardenSpotName}
        />
      </IonModal>

      <IonModal ref={addGardenSpot} className="modal-sizer">
        <AddGardenSpotModal
          newGardenSpot={newGardenSpot}
          closeGardenSpotDilemma={closeGardenSpotDilemma}
        />
      </IonModal>

      <IonContent></IonContent>
      
      <IonFooter style={{backgroundColor: 'white', width: '100vw', height: '60px'}}>
                <IonToolbar style={{ 
                    background: 'white', 
                    border: 'none',  
                    justifyContent: 'center', 
                    display: 'flex', 
                    alignItems: 'center', 
                    height: '100%'   
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <IonFabButton className="AddButton" onClick={() => addGardenSpot.current?.present()}>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </div>
                </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Dashboard;
