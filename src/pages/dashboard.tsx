import React, {useEffect, useRef, useState} from 'react';
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
    IonModal
} from "@ionic/react";
import {StatusBar, Style} from '@capacitor/status-bar';
import {add} from "ionicons/icons";
import "../components/css/DilemmaOverview.css";
import { PlantDetails} from "../constants/interfaces";
import {pingSpeciesAPI} from "../scripts/plant_api_species";
import {pingAPI} from "../scripts/plant_api";
import RegisterModal from '../components/modals/register';
import LoginModal from "../components/modals/login";
import AddGardenSpotModal from "../components/modals/AddGardenSpotModal";
import OpenGardenSpotModal from "../components/modals/OpenGardenSpotModal";

const Dashboard: React.FC = () => {

    const [plants, setPlants] = useState<PlantDetails>({
        id: 0,
        common_name: "",
        pruning_month: [],
        scientific_name: "",
        default_image: {original_url: ""},
        description: "",
        growth_rate: "",
        origin: [""],
        sunlight: [],
        watering: ""
    });
    const [visibility, setVisibility] = useState("hidden");
    const [searchterm, setSearchterm] = useState("");

    // LoginModal Zustand
    const [showLogin, setShowLogin] = useState(false);
    const handleLogin = (email: string) => {
        console.log('Benutzer eingeloggt:', email);
        const newToken = sessionStorage.getItem('token');
        setToken(newToken);
    };

    // RegisterModal Zustand
    const [showRegister, setShowRegister] = useState(false);
    const handleRegister = (name: string, email: string) => {
        console.log('Benutzer registriert:', name, email);
    };

    // Authentifizierung mit token
    const [userName, setUserName] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetch('http://localhost:8080/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.firstName) setUserName(data.firstName);
                });
        }
    }, [token]);

    useEffect(() => {
        StatusBar.setStyle({style: Style.Dark});
    });

    useEffect(() => {
        const statusBarHeight = window.navigator.userAgent.includes('Android') ? 24 : 0;
        document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`);
    });

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
            console.log("default_image: " + result.default_image.original_url);
        }
    };

    const addGardenSpot = useRef<HTMLIonModalElement>(null);
    const openGardenSpotModal = useRef<HTMLIonModalElement>(null);

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
            <IonToolbar style={{marginTop: "calc(var(--status-bar-height) + 15px)"}}>
                <IonTitle style={{marginTop: "15px"}} className={"title-Tab1"}>Plants</IonTitle>
                <div className="vertical-line"></div>
            </IonToolbar>

            <IonButton onClick={() => testfun()}>
                Klick mich
            </IonButton>

            <IonButton onClick={() => setShowLogin(true)}>
                Einloggen
            </IonButton>

            {userName && (
                <div style={{margin: '16px', fontWeight: 'bold'}}>
                    Hello, {userName}!
                </div>
            )}

            <div>
                <IonInput
                    onIonInput={(e) => setSearchterm(e.target.value as string)}>
                </IonInput>
                <div style={{visibility: visibility}}>
                    <div style={{width: 'auto', height: '20%', padding: '10px'}}>
                        <IonList lines="none">
                            <IonItem style={{border: "1px solid #ccc"}}>
                                <div>{plants.common_name}</div>
                                <div style={{position: "relative", maxWidth: '70px', maxHeight: '70px', marginRight: 'auto'}}>
                                    <IonImg src={plants.default_image.original_url} />
                                </div>
                            </IonItem>
                        </IonList>
                    </div>
                </div>
            </div>

            <div
                style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    margin: "10px",
                    height: "150px",
                    width: "150px"
                }}
                onClick={() => {
                    if (openGardenSpotModal.current) {
                        openGardenSpotModal.current.present();
                    } else {
                        console.error("Modal reference is not set!");
                    }
                }}
            >
                Garden Spot
            </div>

            <IonModal ref={openGardenSpotModal} className="modal-sizer">
                <OpenGardenSpotModal openGardenSpot={openGardenSpot} closeGardenSpotModal={closeGardenSpotModal} />
            </IonModal>

            <IonModal ref={addGardenSpot} className="modal-sizer">
                <AddGardenSpotModal newGardenSpot={newGardenSpot} closeGardenSpotDilemma={closeGardenSpotDilemma} />
            </IonModal>

            <IonContent></IonContent>

            <IonFooter style={{backgroundColor: 'white', width: '100vw', height: '90px'}}>
                <div className="open-modal-button">
                    <IonFabButton className={"AddButton"} onClick={() => addGardenSpot.current?.present()}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </div>
            </IonFooter>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
                onShowRegister={() => {
                    setShowLogin(false); // Login schließen
                    setShowRegister(true); // Register öffnen
                }}
            />

            <RegisterModal
                isOpen={showRegister}
                onClose={() => {
                    setShowRegister(false); // Schließt das Register Modal
                    setShowLogin(true); // Öffnet das Login Modal
                }}
                onRegister={handleRegister}
            />

        </IonPage>
    );
};

export default Dashboard;
