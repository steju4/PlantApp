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
import { Spot, StoredGardenPlant, PlantDetails, UserData } from "../constants/interfaces";
import { pingSpeciesAPI } from "../scripts/plant_api_species";
import { pingAPI } from "../scripts/plant_api";
import AddGardenSpotModal from "../components/modals/AddGardenSpotModal";
import OpenGardenSpotModal from "../components/modals/OpenGardenSpotModal";
import Gardenspots from "../components/Gardenspots_Cards";
import Logo from '../../public/assets/icon/logo.png';
import { useHistory } from "react-router-dom";
interface DashboardProps {
  token: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [userData, setUserData] = useState<UserData>();
  const history = useHistory();
  const [gardenSpots, setGardenSpots] = useState<Spot[]>([]);
  const [selectedGardenSpotId, setSelectedGardenSpotId] = useState<number | null>(null);


  useEffect(() => {
  if (token) {
    fetch("http://localhost:8080/auth/api/gardenspots", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setGardenSpots(data))
      .catch((err) => console.error("Fehler beim Laden der Gardenspots:", err));
  }
}, [token]);

  const [plants, setPlants] = useState<PlantDetails>({
    id: 0,
    common_name: "",
    pruning_month: [],
    scientific_name: [""],
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

  const logout = () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  }

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

 
  const editSpot = () => {
    console.log("editSpot")
  }
  const deleteSpot = () => {
    console.log("deleteSpot")

  }
  const addGardenSpot = useRef<HTMLIonModalElement>(null);
  const openGardenSpotModal = useRef<HTMLIonModalElement>(null);

  const showOpenGardenSpotModal = (gardenSpot: Spot) => { 
    setSelectedGardenSpotName(gardenSpot.name);
    setSelectedGardenSpotId(gardenSpot.id);
    openGardenSpotModal.current?.present();
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

  const [newSpotName, setNewSpotName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newStreetNumber, setNewStreetNumber] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCity, setNewCity] = useState("");
  const addGardenSpotToDB = async (spot: Spot) => {
  if (!token) return;
  const res = await fetch("http://localhost:8080/auth/api/gardenspots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    // Nach dem Hinzufügen neu laden:
    const newSpot = await res.json();
    setGardenSpots(prev => [...prev, newSpot]);
  } else {
    alert("Fehler beim Anlegen des GardenSpots");
  }
};

  const handleCreateGardenSpot = () => {
  const spot: Spot = {
    id: 0, 
    name: newSpotName,
    street: newStreet,
    streetNumber: newStreetNumber,
    postalCode: newPostalCode,
    city: newCity,
    plants: [],
    logo: ""
  };
  addGardenSpotToDB(spot);
  // Felder zurücksetzen und Modal schließen
  setNewSpotName("");
  setNewStreet("");
  setNewStreetNumber("");
  setNewPostalCode("");
  setNewCity("");
  closeGardenSpotDilemma();
};

const handleDeleteSpot = async (id: number) => {
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:8080/auth/api/gardenspots/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    setGardenSpots(prev => prev.filter(s => s.id !== id));
    closeGardenSpotModal();
  } catch (err) {
    console.error("Error deleting spot:", err);
    alert(`Error deleting spot: ${err instanceof Error ? err.message : String(err)}`);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <img src={Logo} alt="Logo" style={{ height: 50, marginLeft: 10, marginRight: 0 }} />
          </IonButtons>
          <IonTitle style={{ paddingLeft: "5px" }}>PlantApp</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout} color="danger" style={{ marginRight: "10px" }}>
              Logout
            </IonButton>
          </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent style={{ paddingBottom: '60px' }}>
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
        gardenSpots={gardenSpots}
        userData={userData}
        closeGardenSpotsModal={() => openGardenSpotModal.current?.dismiss()}
        editSpot={editSpot}
        deleteSpot={deleteSpot}
        openGardenSpotModal={(spot: Spot) => { 
            showOpenGardenSpotModal(spot);
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
          }
        }
      >
        {selectedGardenSpotId && selectedGardenSpotName && ( // Sicherstellen, dass beide Werte vorhanden sind
            <OpenGardenSpotModal
            openGardenSpot={openGardenSpot} // Diese Funktion muss ggf. überarbeitet werden
            closeGardenSpotModal={closeGardenSpotModal}
            deleteSpot={handleDeleteSpot} // Funktion zum Löschen des Spots
            gardenSpotName={selectedGardenSpotName}
            gardenSpotId={selectedGardenSpotId} // ID übergeben
            token={token} // Token übergeben
            />
        )}
      </IonModal>

      <IonModal ref={addGardenSpot} className="modal-sizer">
        <AddGardenSpotModal
          newGardenSpot={handleCreateGardenSpot}
          setGardenSpotName={setNewSpotName}
          setStreet={setNewStreet}
          setStreetNumber={setNewStreetNumber}
          setPostCode={setNewPostalCode}
          setCity={setNewCity}
          closeGardenSpotDilemma={closeGardenSpotDilemma}
        />
      </IonModal>
      </IonContent>
      <IonFooter slot="fixed" style={{backgroundColor: 'white', width: '100vw', height: '60px'}}>
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
