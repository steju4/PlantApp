import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonImg,
    IonInput,
    IonItem,
    IonList,
    IonIcon
} from "@ionic/react";
import { pingSpeciesAPI } from "../../scripts/plant_species_api_test";
import { PlantDetails } from "../../constants/interfaces";
import { sample } from "../../pages/sample";
import { chevronForward } from 'ionicons/icons';
import '../css/OpenGardenSpotModal.css';
import Header from "../Header";
import PlantDetailsModal from "./PlantDetailsModal";

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
    const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
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
        setSelectedPlant(plant);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    const handleAddPlant = (plant: PlantDetails) => {
        console.log('Hinzufügen der Pflanze:', plant);
        // Hier Logik zum Hinzufügen der Pflanze einfügen, falls gewünscht
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
        return () => document.removeEventListener('click', handleOutsideClick);
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

                {dropdownVisible && (
                    <div className="dropdown" ref={dropdownRef}>
                        <IonList>
                            {plants.map((plant, index) => (
                                <IonItem
                                    key={index}
                                    button
                                    detail={true}  // Hier wird der Chevron automatisch angezeigt
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
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                )}
            </div>

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

            <PlantDetailsModal
                isOpen={showDetailsModal}
                onDismiss={handleCloseDetailsModal}
                plant={selectedPlant}
            />
        </div>
    );
};

export default OpenGardenSpotModal;
