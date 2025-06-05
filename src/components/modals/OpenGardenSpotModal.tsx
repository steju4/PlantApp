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
import { fetchPlantDetailsById } from "../../scripts/plant_species_details";
import { PlantDetails, StoredGardenPlant } from "../../constants/interfaces";
import '../css/OpenGardenSpotModal.css';
import Header from "../Header";
import PlantDetailsModal from "./PlantDetailsModal";
import EditPlantModal from "./EditPlantModal";
import { search as searchIcon } from 'ionicons/icons';
import { trash, sunnyOutline } from 'ionicons/icons';
const city = "Munich";
const OPENWEATHER_API_KEY = "7124aa5c248a83f67f5d34bf50443ba5";

interface GardenSpotProps {
    openGardenSpot: () => void;
    closeGardenSpotModal: () => void;
    deleteSpot: (id: number) => void;
    gardenSpotName: string;
    gardenSpotId: number;
    token: string | null;
}

const OpenGardenSpotModal: React.FC<GardenSpotProps> = ({
                                                            openGardenSpot,
                                                            closeGardenSpotModal,
                                                            deleteSpot,
                                                            gardenSpotName,
                                                            gardenSpotId,
                                                            token
                                                        }) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [searchterm, setSearchterm] = useState('');
    const [plants, setPlants] = useState<PlantDetails[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editStoredPlant, setEditStoredPlant] = useState<StoredGardenPlant | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [storedPlants, setStoredPlants] = useState<StoredGardenPlant[]>([]);
    const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<{
        temp: number;
        humidity: number;
        rainProb: number;
        weatherDescription: string;
    } | null>(null);

    const [loadingWeather, setLoadingWeather] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);


    useEffect(() => {
        if (token && gardenSpotId) {
            setLoadingPlants(true);
            fetch(`http://localhost:8080/auth/api/gardenspots/${gardenSpotId}/plants`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => {
                if (!res.ok) {
                    console.error(`HTTP error! status: ${res.status}`);
                    return [];
                }
                return res.json();
            })
            .then((data: StoredGardenPlant[]) => {
                setStoredPlants(data);
            })
            .catch(err => {
                console.error("Fehler beim Laden der Pflanzen für GardenSpot:", err);
                setStoredPlants([]);
            })
            .finally(() => {
                setLoadingPlants(false);
            });
        }
    }, [token, gardenSpotId]);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoadingWeather(true);
            setWeatherError(null);

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=de`
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                const rainProb = data.rain ? (data.rain["1h"] || 0) : 0;

                setWeatherData({
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    rainProb: rainProb,
                    weatherDescription: data.weather[0]?.description || "unbekannt",
                });
            } catch (err) {
                setWeatherError(err instanceof Error ? err.message : String(err));
                setWeatherData(null);
            } finally {
                setLoadingWeather(false);
            }
        };

        fetchWeather();
    }, []);

    const handleAddPlantToGardenSpot = async (plantToAdd: PlantDetails, quantity: number) => {
        if (!token || !plantToAdd || !gardenSpotId) {
            alert("Fehler: Token, Pflanzendetails oder GardenSpot ID fehlen.");
            return;
        }

        // Prüfen, ob die Pflanze schon im Spot ist
        const existingPlant = storedPlants.find(p => p.externalPlantId === plantToAdd.id);

        if (existingPlant) {
            // Pflanze existiert schon, Menge erhöhen (PUT)
            const newAmount = (existingPlant.amount ?? 0) + quantity;

            try {
                const res = await fetch(`http://localhost:8080/auth/api/gardenspotplants/${existingPlant.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ amount: newAmount }),
                });

                if (!res.ok) {
                    const errorBody = await res.text();
                    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
                }
                const updatedPlant: StoredGardenPlant = await res.json();
                setStoredPlants(prev => prev.map(p => p.id === updatedPlant.id ? updatedPlant : p));
                setShowDetailsModal(false);
                setSearchterm('');
                setPlants([]);
            } catch (error) {
                console.error("Fehler beim Aktualisieren der Pflanze:", error);
                alert(`Fehler beim Aktualisieren der Pflanze: ${error instanceof Error ? error.message : String(error)}`);
            }

        } else {
            // Pflanze existiert nicht, neu anlegen (POST)
            const plantData = {
                externalPlantId: plantToAdd.id,
                commonName: plantToAdd.common_name,
                thumbnail: plantToAdd.default_image?.thumbnail || null,
                amount: quantity,
                sunlight: plantToAdd.sunlight?.join(', ') || null,
                watering: plantToAdd.watering || null,
                careLevel: plantToAdd.care_level || null,
                pruningMonth: plantToAdd.pruning_month?.join(', ') || null,
                cycle: plantToAdd.cycle || null,
                growthRate: plantToAdd.growth_rate || null,
                droughtTolerant: plantToAdd.drought_tolerant || false,
                indoor: plantToAdd.indoor || false,
                medicinal: plantToAdd.medicinal || false,
                description: plantToAdd.description || null,
                origin: plantToAdd.origin?.join(', ') || null,
            };

            try {
                const res = await fetch(`http://localhost:8080/auth/api/gardenspots/${gardenSpotId}/plants`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(plantData),
                });

                if (!res.ok) {
                    const errorBody = await res.text();
                    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
                }
                const newStoredPlant: StoredGardenPlant = await res.json();
                setStoredPlants(prev => [...prev, newStoredPlant]);
                setShowDetailsModal(false);
                setSearchterm('');
                setPlants([]);
            } catch (error) {
                console.error("Fehler beim Hinzufügen der Pflanze:", error);
                alert(`Fehler beim Hinzufügen der Pflanze: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    const searchPlants = async () => {
        if (!searchterm.trim()) {
            setPlants([]);
            setDropdownVisible(false);
            return;
        }
        const result = await pingSpeciesAPI(searchterm);
        if (result) {
            setPlants(result);
            setDropdownVisible(true);
        } else {
            setPlants([]);
            setDropdownVisible(false);
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
            setSelectedPlant(plant);
            setShowDetailsModal(true);
        }
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedPlant(null);
    };

    const handleStoredPlantClick = (plant: StoredGardenPlant) => {
        setEditStoredPlant(plant);
        setShowEditModal(true);
    };

    const handleConfirmPlantEdit = async (updatedAmount: number) => {
        if (!token || !editStoredPlant) {
            alert("Fehler: Token oder zu bearbeitende Pflanze fehlt.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/auth/api/gardenspotplants/${editStoredPlant.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: updatedAmount }),
            });

            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
            }
            const updatedPlantFromServer: StoredGardenPlant = await res.json();
            setStoredPlants(prev => prev.map(p => p.id === updatedPlantFromServer.id ? updatedPlantFromServer : p));
            setShowEditModal(false);
            setEditStoredPlant(null);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Pflanze:", error);
            alert(`Fehler beim Aktualisieren der Pflanze: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleDeleteStoredPlant = async () => {
        if (!token || !editStoredPlant) {
            alert("Fehler: Token oder zu löschende Pflanze fehlt.");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/auth/api/gardenspotplants/${editStoredPlant.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok && res.status !== 204) {
                const errorBody = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
            }
            setStoredPlants(prev => prev.filter(p => p.id !== editStoredPlant.id));
            setShowEditModal(false);
            setEditStoredPlant(null);
        } catch (error) {
            console.error("Fehler beim Löschen der Pflanze:", error);
            alert(`Fehler beim Löschen der Pflanze: ${error instanceof Error ? error.message : String(error)}`);
        }
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

    const getImageSrc = (url: string | null | undefined): string => {

        if (!url || url === 'https://perenual.com/storage/image/upgrade_access.jpg') {
            return 'assets/fallback_picture/monstera.png';
        }
        return url;
    };

    return (
        <div>
            <Header
                title={gardenSpotName}
                onClose={closeGardenSpotModal}
                onConfirm={openGardenSpot}
                showConfirm={false}
            />

            <div
                className="open-garden-container"
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <div className="search-wrapper">
                    <div className="search-container">
                        <IonInput
                            ref={inputRef}
                            className="search-input"
                            value={searchterm}
                            placeholder="Enter plant name to add"
                            onIonInput={(e) => setSearchterm(e.target.value as string)}
                            onFocus={handleInputFocus}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') searchPlants();
                            }}
                        />
                        <IonButton onClick={searchPlants} className="search-button">
                            <IonIcon icon={searchIcon} />
                        </IonButton>
                    </div>

                    {dropdownVisible && (
                        <div className="dropdown" ref={dropdownRef}>
                            <IonList lines="none">
                                {plants.length > 0 ? (
                                    plants.map((plant) => (
                                        <IonItem
                                            key={plant.id}
                                            button
                                            detail={true}
                                            onClick={() => handleSelection(plant)}
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
                                    ))
                                ) : (
                                    <IonItem lines="none" className="dropdown-item-no-results">
                                        <div className="no-results">No results found.</div>
                                    </IonItem>
                                )}
                            </IonList>
                        </div>
                    )}
                </div>
            </div>

            <div className="plant-grid-wrapper">
                <div className="plant-grid-title">My plants</div>

                <div className="weather-box">
                    <IonIcon icon={sunnyOutline} className="weather-icon" />
                    <div className="weather-text">
                        {loadingWeather && "Wetterdaten werden geladen..."}
                        {weatherError && `Fehler beim Laden der Wetterdaten: ${weatherError}`}
                        {weatherData && !loadingWeather && !weatherError && (
                            <>
                                {weatherData.weatherDescription.charAt(0).toUpperCase() + weatherData.weatherDescription.slice(1)},&nbsp;
                                {Math.round(weatherData.temp)}°C – Luftfeuchtigkeit: {weatherData.humidity}% – Regenmenge (letzte Stunde): {weatherData.rainProb} mm
                            </>
                        )}
                        {!weatherData && !loadingWeather && !weatherError && "Keine Wetterdaten verfügbar."}
                    </div>
                </div>

                <div className="plant-grid">
                    {!loadingPlants && storedPlants.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                width: '100%',
                                marginTop: '2rem',
                                color: '#888',
                                fontStyle: 'italic',
                            }}
                        >
                            No plants added yet.
                        </div>
                    ) : (
                        !loadingPlants &&
                        storedPlants.map((sPlant) => (
                            <div
                                className="plant-box"
                                key={sPlant.id}
                                onClick={() => handleStoredPlantClick(sPlant)}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                <IonImg src={getImageSrc(sPlant.thumbnail)} />
                                <div className="plant-name">{sPlant.commonName}</div>
                                <div className="plant-quantity-badge">x{sPlant.amount ?? 1}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* Immer direkt unter der Pflanzengrid sichtbar */}
                <div className="delete-button-wrapper" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <IonButton
                        className="delete-button"
                        onClick={() => deleteSpot(gardenSpotId)}
                    >
                        <IonIcon icon={trash} />
                        Delete Garden Spot
                    </IonButton>
                </div>
            </div>


            {selectedPlant && (
            <PlantDetailsModal
                isOpen={showDetailsModal}
                onDismiss={handleCloseDetailsModal}
                onConfirm={(quantityFromModal) => handleAddPlantToGardenSpot(selectedPlant, quantityFromModal)}
                plant={selectedPlant}
            />
            )}

            {editStoredPlant && (
                <EditPlantModal
                    isOpen={showEditModal}
                    onDismiss={() => {
                        setShowEditModal(false);
                        setEditStoredPlant(null);
                    }}
                    onConfirm={handleConfirmPlantEdit}
                    onDelete={handleDeleteStoredPlant}

                    plant={{
                        id: editStoredPlant.externalPlantId,
                        common_name: editStoredPlant.commonName,
                        default_image: { thumbnail: editStoredPlant.thumbnail || '' },
                        sunlight: editStoredPlant.sunlight?.split(',').map(s => s.trim()) || [],
                        watering: editStoredPlant.watering || '',
                        care_level: editStoredPlant.careLevel || '',
                        pruning_month: editStoredPlant.pruningMonth?.split(',').map(s => s.trim()) || [],
                        cycle: editStoredPlant.cycle || '',
                        growth_rate: editStoredPlant.growthRate || '',
                        drought_tolerant: editStoredPlant.droughtTolerant,
                        indoor: editStoredPlant.indoor,
                        medicinal: editStoredPlant.medicinal,
                        description: editStoredPlant.description || '',
                        origin: editStoredPlant.origin?.split(',').map(s => s.trim()) || [],
                        scientific_name: [], // Wird nicht im Backend gespeichert, da nur angezeigt bei Suche

                    }}
                    initialQuantity={editStoredPlant.amount}
                />
            )}
        </div>
    );
};

export default OpenGardenSpotModal;
