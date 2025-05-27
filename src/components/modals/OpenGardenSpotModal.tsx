import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonImg,
    IonInput,
    IonItem,
    IonList
} from "@ionic/react";
import { pingSpeciesAPI } from "../../scripts/plant_species_api_test";
import { fetchPlantDetailsById } from "../../scripts/plant_species_details";
import { PlantDetails } from "../../constants/interfaces";
import { sample as initialSample } from "../../pages/sample";
import '../css/OpenGardenSpotModal.css';
import Header from "../Header";
import PlantDetailsModal from "./PlantDetailsModal";
import EditPlantModal from "./EditPlantModal";

interface GardenSpotProps {
    openGardenSpot: () => void;
    closeGardenSpotModal: () => void;
    gardenSpotName: string;
}

const OpenGardenSpotModal: React.FC<GardenSpotProps> = ({
                                                            openGardenSpot,
                                                            closeGardenSpotModal,
                                                            gardenSpotName
                                                        }) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [searchterm, setSearchterm] = useState('');
    const [plants, setPlants] = useState<PlantDetails[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editPlant, setEditPlant] = useState<PlantDetails | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [sample, setSample] = useState<PlantDetails[]>(initialSample);

    const searchPlants = async () => {
        const result = await pingSpeciesAPI(searchterm);
        if (result) {
            setPlants(result);
            setDropdownVisible(true);
        }
    };

    const handleSelection = async (plant: PlantDetails) => {
        setSearchterm(plant.common_name);
        setDropdownVisible(false);

        const fullDetails = await fetchPlantDetailsById(plant.id);
        if (fullDetails) {
            setSelectedPlant(fullDetails);
            setShowDetailsModal(true);
        } else {
            alert("Fehler beim Laden der Pflanzendetails.");
        }
    };

    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const handleAddPlant = (plant: PlantDetails) => {
        const newPlant = { ...plant, quantity: 1 };
        setSample(prev => [...prev, newPlant]);
        setShowDetailsModal(false);
    };

    const handlePlantBoxClick = (plant: PlantDetails) => {
        setEditPlant(plant);
        setShowEditModal(true);
    };

    const handleConfirmEdit = (quantity: number) => {
        if (!editPlant) return;
        const updated = sample.map(p =>
            p === editPlant ? { ...p, quantity } : p
        );
        setSample(updated);
        setShowEditModal(false);
    };

    const handleDeletePlant = () => {
        if (!editPlant) return;
        const updated = sample.filter(p => p !== editPlant);
        setSample(updated);
        setShowEditModal(false);
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
        if (plants.length > 0) setDropdownVisible(true);
    };

    const getImageSrc = (url: string) =>
        url !== 'https://perenual.com/storage/image/upgrade_access.jpg'
            ? url
            : 'assets/fallback_picture/monstera.png';

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
                    placeholder="Enter plant name"
                    onIonInput={(e) => setSearchterm(e.target.value as string)}
                    onFocus={handleInputFocus}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') searchPlants();
                    }}
                />

                {dropdownVisible && (
                    <div className="dropdown" ref={dropdownRef}>
                        <IonList>
                            {plants.map((plant, index) => (
                                <IonItem
                                    key={index}
                                    button
                                    detail={true}
                                    onClick={() => handleSelection(plant)}
                                    lines="none"
                                    className="dropdown-item"
                                >
                                    <IonImg
                                        src={getImageSrc(plant.default_image?.thumbnail)}
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
                    <div
                        className="plant-box"
                        key={index}
                        onClick={() => handlePlantBoxClick(plant)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <IonImg src={getImageSrc(plant.default_image?.thumbnail)} />
                        <div className="plant-name">{plant.common_name}</div>
                        <div className="plant-scientific">{plant.scientific_name}</div>
                        <div className="plant-quantity-badge">x{plant.quantity ?? 1}</div>
                    </div>
                ))}
            </div>

            <PlantDetailsModal
                isOpen={showDetailsModal}
                onDismiss={handleCloseDetailsModal}
                onConfirm={() => handleAddPlant(selectedPlant!)}
                plant={selectedPlant}
            />

            <EditPlantModal
                isOpen={showEditModal}
                onDismiss={() => setShowEditModal(false)}
                onConfirm={handleConfirmEdit}
                onDelete={handleDeletePlant}
                plant={editPlant}
            />
        </div>
    );
};

export default OpenGardenSpotModal;
