import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonImg, IonInput, IonItem, IonList, IonTitle, IonIcon } from "@ionic/react";
import { pingSpeciesAPI } from "../../scripts/plant_species_api_test";
import { PlantDetails } from "../../constants/interfaces";
import { sample } from "../../pages/sample";
import { chevronForward } from 'ionicons/icons';  // Chevron-Symbol für den Pfeil
import '../css/OpenGardenSpotModal.css';
import Header from "../Header";
import PlantDetailsModal from "./PlantDetailsModal"; // Importiere die neue Modal-Komponente

interface GardenSpotProps {
    openGardenSpot: () => void;
    closeGardenSpotModal: () => void;
    gardenSpotName: string;
}

const OpenGardenSpotModal: React.FC<GardenSpotProps> = ({ openGardenSpot, closeGardenSpotModal, gardenSpotName }) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    const [searchterm, setSearchterm] = useState("");
    const [plants, setPlants] = useState<PlantDetails[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null); // Zustand für die ausgewählte Pflanze
    const [showDetailsModal, setShowDetailsModal] = useState(false); // Zustand für das Details-Modal
    const dropdownRef = useRef<HTMLDivElement>(null);

    const testfun = async () => {
        const result = await pingSpeciesAPI(searchterm);
        if (result) {
            setPlants(result);
            setDropdownVisible(true);
        }
    };

    const handleSelection = (plant: PlantDetails) => {
        setSearchterm(plant.common_name);
        setDropdownVisible(false);
        setSelectedPlant(plant); // Pflanze setzen
        setShowDetailsModal(true); // Details Modal öffnen
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false); // Modal schließen
    };

    const handleAddPlant = (plant: PlantDetails) => {
        console.log('Hinzufügen der Pflanze:', plant);
        // Hier kannst du die Logik für das Hinzufügen der Pflanze implementieren
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !(inputRef.current as unknown as HTMLElement).contains(event.target as Node)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleInputFocus = () => {
        if (plants.length > 0) {
            setDropdownVisible(true);
        }
    };

    return (
        <div>
            <Header
                title={gardenSpotName}
                onClose={closeGardenSpotModal}
                onConfirm={openGardenSpot}
                showConfirm={true}
            />

            <IonTitle style={{ marginTop: "20px" }}>Titel</IonTitle>

            <div className="open-garden-container">
                <IonInput
                    ref={inputRef}
                    className="search-input"
                    value={searchterm}
                    placeholder="Pflanzennamen eingeben"
                    onIonInput={(e) => setSearchterm(e.target.value as string)}
                    onFocus={handleInputFocus}
                    onKeyPress={(e) => { if (e.key === 'Enter') testfun(); }}
                />
            </div>

            {dropdownVisible && (
                <div className="dropdown" ref={dropdownRef}>
                    <IonList>
                        {plants.map((plant, index) => (
                            <IonItem
                                key={index}
                                button
                                onClick={() => handleSelection(plant)}
                                lines="none"
                                className="dropdown-item"
                            >
                                <IonImg
                                    src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                                        ? plant.default_image.thumbnail
                                        : "assets/fallback_picture/monstera.png"}
                                    className="dropdown-item-img"
                                />
                                <div className="dropdown-item-text">
                                    <div>{plant.common_name}</div>
                                    <div className="plant-scientific">{plant.scientific_name}</div>
                                </div>
                                <IonButton
                                    fill="clear"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Verhindert das Schließen des Dropdowns, wenn der Button geklickt wird
                                        handleAddPlant(plant);
                                    }}
                                    className="add-button"
                                >
                                    <IonIcon icon={chevronForward} size="small" color="medium" />
                                </IonButton>
                            </IonItem>
                        ))}
                    </IonList>
                </div>
            )}

            <div className="plant-grid">
                {sample.map((plant, index) => (
                    <div className="plant-box" key={index}>
                        <IonImg
                            src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                                ? plant.default_image.thumbnail
                                : "assets/fallback_picture/monstera.png"}
                        />
                        <div className="plant-name">{plant.common_name}</div>
                        <div className="plant-scientific">{plant.scientific_name}</div>
                    </div>
                ))}
            </div>

            {/* Modal für Pflanzendetails */}
            <PlantDetailsModal
                isOpen={showDetailsModal}
                onDismiss={handleCloseDetailsModal}
                plant={selectedPlant}
            />
        </div>
    );
};

export default OpenGardenSpotModal;
