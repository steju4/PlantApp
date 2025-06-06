import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonIcon,
  IonHeader,
  IonButtons,
  IonModal,
} from "@ionic/react";
import { add } from "ionicons/icons";
import "../components/css/dashboard.css";
import "../components/css/global.css";
import { Spot, PlantDetails, UserData } from "../constants/interfaces";
import AddGardenSpotModal from "../components/modals/addGardenSpotModal";
import OpenGardenSpotModal from "../components/modals/openGardenSpotModal";
import Gardenspots from "../components/gardenspotsCards";
import Logo from '../../public/assets/icon/logo.png';
import { useHistory } from "react-router-dom";
interface DashboardProps {
  token: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [userData, setUserData] = useState<UserData>();
  const history = useHistory();
  const [gardenSpots, setGardenSpots] = useState<Spot[]>([]);
  const [selectedGardenSpot, setSelectedGardenSpot] = useState<Spot | null>(null);


    useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/auth/api/gardenspots", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setGardenSpots(data))                         // Spots im State ablegen
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

  const addGardenSpot = useRef<HTMLIonModalElement>(null);
  const openGardenSpotModal = useRef<HTMLIonModalElement>(null);

// Öffnet das Modal für einen ausgewählten GardenSpot und setzt diesen als aktuell ausgewählt
  const showOpenGardenSpotModal = (gardenSpot: Spot) => {
  setSelectedGardenSpot(gardenSpot);  //Speichert den ausgewählten GardenSpot im State
  openGardenSpotModal.current?.present();  // Öffnet das Modal über die Referenz, falls vorhanden
    };

    // Schließt das Modal zum Hinzufügen eines GardenSpots, falls geöffnet
    const closeGardenSpotDilemma = () => {
    addGardenSpot.current?.dismiss(); // Schließt das Modal über die Referenz, falls vorhanden
  };
  // Schließt das Modal zum Anzeigen eines GardenSpots, falls geöffnet
  const closeGardenSpotModal = () => {
    openGardenSpotModal.current?.dismiss(); // Schließt das Modal über die Referenz, falls vorhanden
  };

    // Platzhalter-Funktion für das Anlegen eines neuen GardenSpots (momentan nur Konsolenausgabe)
    const newGardenSpot = () => {
    console.log("newGardenSpot");
  };

    // Platzhalter-Funktion zum Öffnen eines GardenSpots (momentan nur Konsolenausgabe)
    const openGardenSpot = () => {
    console.log("openGardenSpot");
  };

  const [newSpotName, setNewSpotName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newStreetNumber, setNewStreetNumber] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCity, setNewCity] = useState("");

  // legt neuen Spot per API an und fügt ihn dem State hinzu
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
      const newSpot = await res.json();
      setGardenSpots(prev => [...prev, newSpot]);                  // State updaten
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
  setNewSpotName("");
  setNewStreet("");
  setNewStreetNumber("");
  setNewPostalCode("");
  setNewCity("");
  closeGardenSpotDilemma();
};

// löscht Spot über API und entfernt aus State
const handleDeleteSpot = async (id: number) => {
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:8080/auth/api/gardenspots/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    setGardenSpots(prev => prev.filter(s => s.id !== id)); // Spot entfernen
    closeGardenSpotModal();
  } catch (err) {
    console.error("Error deleting spot:", err);
    alert(`Error deleting spot: ${err instanceof Error ? err.message : String(err)}`);
  }
};

  function deleteSpot(id: number): void {
    handleDeleteSpot(id);
  }

  function editSpot(ID: number): void {
    const spot = gardenSpots.find(s => s.id === ID);
    console.log("editSpot", spot);
    // Hier könnte eine Logik zum Bearbeiten des Spots implementiert werden
  }

  return (
    <IonPage>
        <IonHeader className="header-container">
            <IonToolbar>
                <IonButtons slot="start">
                    <img src={Logo} alt="Logo" className="dashboard-logo" />
                </IonButtons>

                <IonTitle className="centered-title">PlantApp</IonTitle>

                <IonButtons slot="end">
                    <IonButton fill="clear" onClick={logout} color="danger">
                        <span className="logout-text">Logout</span>
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
                openGardenSpotModal={showOpenGardenSpotModal} // direkt Funktion weitergeben//
            />


            <IonModal
          ref={openGardenSpotModal} // Referenz, um das Modal programmatisch zu steuern (öffnen/schließen)
          style={{
            '--width': '100vw',
            '--height': '100vh',
            '--border-radius': '0',
            '--max-width': '100vw',
            '--max-height': '100vh'
          }
        }
      >
                {/* Falls ein GardenSpot ausgewählt ist, wird das OpenGardenSpotModal angezeigt */}
                {selectedGardenSpot && (
                    <OpenGardenSpotModal
                        openGardenSpot={openGardenSpot} // Funktion zum Öffnen des GardenSpots (Platzhalter)
                        closeGardenSpotModal={closeGardenSpotModal} // Funktion zum Schließen des Modals
                        deleteSpot={handleDeleteSpot} // Funktion zum Löschen des GardenSpots
                        gardenSpot={selectedGardenSpot} // Daten des aktuell ausgewählten GardenSpots
                        token={token}
                    />
                )}
      </IonModal>

      <IonModal ref={addGardenSpot} className="modal-sizer">
        {/* Modal zum Hinzufügen eines neuen GardenSpots */}
        <AddGardenSpotModal
          newGardenSpot={handleCreateGardenSpot} // Funktion zum Erstellen eines neuen GardenSpots
          setGardenSpotName={setNewSpotName} // Setter für den Namen des neuen Spots
          setStreet={setNewStreet} // Setter für Straße
          setStreetNumber={setNewStreetNumber} // Setter für Hausnummer
          setPostCode={setNewPostalCode} // Setter für Postleitzahl
          setCity={setNewCity} // Setter für Stadt
          closeGardenSpotDilemma={closeGardenSpotDilemma} // Funktion zum Schließen des Modals
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
                        {/* Floating Action Button zum Öffnen des Modals zum Hinzufügen eines neuen GardenSpots */}
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
