import React, {useEffect, useRef, useState} from 'react';

import '../css/List.css';
import {
    IonButton,
    IonButtons,
    IonHeader, IonImg,
    IonInput,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {pingSpeciesAPI} from "../../scripts/plant_species_api_test";
import {PlantDetails} from "../../constants/interfaces";
//import {sample} from "../pages/sample";

interface GardenSpotProps {

    openGardenSpot: () => void;
    closeGardenSpotModal: () => void;


}


const OpenGardenSpotModal: React.FC<GardenSpotProps> = ({ openGardenSpot, closeGardenSpotModal}) => {

    const inputRef = useRef<HTMLIonInputElement>(null); // Ref für das Input-Feld
    const [searchterm, setSearchterm] = useState("");
    const [plants, setPlants] = useState<PlantDetails[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const testfun = async () => {
        const result = await pingSpeciesAPI(searchterm);
        if (result) {
            setPlants(result);
            setDropdownVisible(true); // Zeige das Dropdown, wenn Ergebnisse vorhanden
        }
    };

    const handleSelection = (plant: PlantDetails) => {
        setSearchterm(plant.common_name);
        setDropdownVisible(false); // Schließe das Dropdown
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !(inputRef.current as unknown as HTMLElement).contains(event.target as Node)
            ) {
                setDropdownVisible(false); // Schließe Dropdown bei Klick außerhalb
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
    const handleInputFocus = () => {
        if (plants.length > 0) {
            setDropdownVisible(true); // Öffne das Dropdown bei Fokussieren
        }
    };
    return (
        <div >
            <IonHeader style={{height:"calc(var(--status-bar-height) + 80px)"}}>
                <IonToolbar style={{position:"absolute", bottom:"0px"}}>
                    <IonButtons slot="start">
                        <IonButton onClick={() => closeGardenSpotModal()}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={openGardenSpot}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonTitle style={{marginTop: "20px"}}>Title</IonTitle>



            <div>
                <div style={{ display: "flex", width: "90%", marginLeft: "5%" }}>
                    <IonInput
                        ref={inputRef}
                        value={searchterm}
                        placeholder="Enter plant name"
                        onIonInput={(e) => setSearchterm(e.target.value as string)}
                        style={{
                            '--padding-start': '15px', // Abstand von der linken Seite
                            '--padding-end': '15px',   // Abstand von der rechten Seite (optional)
                            border: "0.5px solid gray",
                            borderRadius: "10px",
                            fontSize: "14px",
                        }}
                        onFocus={handleInputFocus}
                        onKeyPress={(e) => { if (e.key === 'Enter') testfun(); }}
                    />

                </div>

                {dropdownVisible && (
                    <div
                        ref={dropdownRef} // Referenz für das Dropdown
                        style={{
                            width: "90%",
                            marginLeft: "5%",
                            position: "absolute",
                            top: "calc(var(--status-bar-height) + 150px)",
                            background: "white",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            border: "0.5px solid gray",
                            zIndex: 10,
                            maxHeight: "300px",
                            overflowY: "auto",
                            marginTop:"20px"
                        }}
                    >
                        <IonList>
                            {plants.map((plant, index) => (
                                <IonItem
                                    key={index}
                                    button
                                    onClick={() => handleSelection(plant)}
                                    lines="none"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px",
                                        margin: "5px",
                                        borderBottom: index !== plants.length - 1 ? "1px solid #ccc" : "none"
                                    }}
                                >
                                    <IonImg
                                        src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg" ? plant.default_image.thumbnail : "assets/fallback_picture/monstera.png"}
                                        style={{ maxWidth: "50px", maxHeight: "50px", marginRight: "10px" }}
                                    />
                                    <div>
                                        <div>{plant.common_name}</div>
                                        <div style={{ fontStyle: "italic", color: "green" }}>{plant.scientific_name}</div>
                                    </div>
                                </IonItem>
                            ))}
                        </IonList>

                    </div>
                )}
            </div>

            <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "300px" }}>
                <IonList>
                    {sample.map((plant, index) => (
                        <IonItem key={index}>
                            <IonImg
                                src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg" ? plant.default_image.thumbnail : "assets/fallback_picture/monstera.png"}
                                style={{ maxWidth: "50px", maxHeight: "50px", marginRight: "10px" }}
                            />
                            <div>
                                <div>{plant.common_name}</div>
                                <div style={{ fontStyle: "italic", color: "green" }}>{plant.scientific_name}</div>
                            </div>
                        </IonItem>
                    ))}
                </IonList>
            </div>



        </div>


    )
}
export default OpenGardenSpotModal;