import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonImg,
    IonInput,
    IonItem,
    IonList,
    IonIcon
} from "@ionic/react";
import { pingSpeciesAPI } from "../../scripts/plantSpeciesApiTest";
import { fetchPlantDetailsById } from "../../scripts/plantSpeciesDetails";
import { PlantDetails, StoredGardenPlant } from "../../constants/interfaces";
import '../css/open-garden-spot-modal.css';
import Header from "../header";
import PlantDetailsModal from "./plantDetailsModal";
import EditPlantModal from "./editPlantModal";
import { search as searchIcon } from 'ionicons/icons';
import {Spot} from "../../constants/interfaces";
import { trash, sunnyOutline } from 'ionicons/icons';
import {fetchWeatherData} from "../../scripts/weatherApi";

interface OpenGardenSpotModalProps {
    openGardenSpot: () => void;
    closeGardenSpotModal: () => void;
    deleteSpot: (id: number) => void;
    gardenSpot: Spot; // Kompletter Spot
    token: string | null;
}

const OpenGardenSpotModal: React.FC<OpenGardenSpotModalProps> = ({
                                                                     openGardenSpot,
                                                                     closeGardenSpotModal,
                                                                     deleteSpot,
                                                                     gardenSpot,
                                                                     token
                                                        }) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Garten-Spotspezifische Daten aus den Props extrahiert
    const gardenSpotName = gardenSpot.name; // Name des Garden Spots
    const gardenSpotId = gardenSpot.id; // ID des Garden Spots
    const gardenSpotCity = gardenSpot.city; // Stadt des Garden Spots
    // Suchbegriff, den der Nutzer eingibt, um Pflanzen zu suchen
    const [searchterm, setSearchterm] = useState('');
    // Ergebnisliste der Pflanzen, die zur Suche passen
    const [plants, setPlants] = useState<PlantDetails[]>([]);
    // Steuerung der Sichtbarkeit des Dropdowns mit Suchergebnissen
    const [dropdownVisible, setDropdownVisible] = useState(false);
    // Die aktuell ausgewählte Pflanze, für die Details angezeigt werden
    const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);
    // Steuerung der Sichtbarkeit des Modal-Fensters mit Pflanzendetails
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    // Pflanze, die aus dem gespeicherten Garten-Spot zum Bearbeiten ausgewählt wurde
    const [editStoredPlant, setEditStoredPlant] = useState<StoredGardenPlant | null>(null);
    // Steuerung der Sichtbarkeit des Modals zum Bearbeiten einer gespeicherten Pflanze
    const [showEditModal, setShowEditModal] = useState(false);
    // Liste der Pflanzen, die aktuell im Garden Spot gespeichert sind
    const [storedPlants, setStoredPlants] = useState<StoredGardenPlant[]>([]);
    // Ladezustand für das Abrufen der gespeicherten Pflanzen
    const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
    // Wetterdaten für den Garden Spot mit Stadtname, Temperatur, Luftfeuchtigkeit etc.
    const [weatherData, setWeatherData] = useState<{
        cityName: string;
        temp: number;
        humidity: number;
        rainProb: number;
        weatherDescription: string;
    } | null>(null);

    // Ladezustand beim Abrufen der Wetterdaten
    const [loadingWeather, setLoadingWeather] = useState(false);
    // Fehlermeldung, falls beim Laden der Wetterdaten ein Fehler auftritt
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
        // Wenn keine Stadt für den Garden Spot gesetzt ist, abbrechen
        if (!gardenSpotCity) return;

        // Async-Funktion, um Wetterdaten für die Stadt abzurufen
        const getWeather = async () => {
            setLoadingWeather(true); // Ladeanzeige aktivieren
            setWeatherError(null); // Vorherige Fehler zurücksetzen
            try {
                // Wetterdaten von einer API holen (fetchWeatherData)
                const data = await fetchWeatherData(gardenSpotCity);
                setWeatherData(data); // Wetterdaten im State speichern
            } catch (err) {
                // Bei Fehler Fehlernachricht setzen und Wetterdaten löschen
                setWeatherError(err instanceof Error ? err.message : String(err));
                setWeatherData(null);
            } finally {
                setLoadingWeather(false); // Ladeanzeige ausschalten, egal ob Erfolg oder Fehler
            }
        };

        // Funktion direkt aufrufen
        getWeather();
        // Effekt wird ausgeführt, wenn sich die Stadt ändert (gardenSpotCity)
    }, [gardenSpotCity]);



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
        // Funktion zum Schließen des Dropdowns, wenn außerhalb geklickt wird
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current && // Dropdown ist gerendert
                !dropdownRef.current.contains(event.target as Node) && // Klick war nicht im Dropdown
                inputRef.current && // Input-Feld ist vorhanden
                !(inputRef.current as unknown as HTMLElement).contains(event.target as Node) // Klick war nicht im Input-Feld
            ) {
                setDropdownVisible(false); // Dropdown schließen
            }
        };

        // Event Listener für Klicks im Dokument registrieren
        document.addEventListener('click', handleOutsideClick);
        // Cleanup: Listener entfernen, wenn Komponente unmountet wird
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    // Funktion zum Anzeigen des Dropdowns beim Fokussieren des Input-Felds,
    // aber nur wenn bereits Pflanzen in der Liste sind
    const handleInputFocus = () => {
        if (plants.length > 0) setDropdownVisible(true);
    };

    // Hilfsfunktion, um ein Bild-URL zurückzugeben oder ein Fallback-Bild, falls URL ungültig ist
    const getImageSrc = (url: string | null | undefined): string => {
        // Falls keine URL oder Standard-Upgrade-Zugriff-Bild, dann Fallback

        if (!url || url === 'https://perenual.com/storage/image/upgrade_access.jpg') {
            return 'assets/fallback_picture/monstera.png';
        }
        return url; // Ansonsten Originalbild zurückgeben
    };

    // State, ob Bildschirm klein ist (Höhe < 800px)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerHeight < 800);
    // State, ob das Wetterfeld aufgeklappt ist
    const [weatherExpanded, setWeatherExpanded] = useState(false);

    useEffect(() => {
        // Funktion zum Anpassen der States bei Fenstergröße ändern
        const handleResize = () => {
            setIsSmallScreen(window.innerHeight < 800); // Kleine Bildschirme erkennen
            if (window.innerHeight >= 800) {
                setWeatherExpanded(true); // Größere Bildschirme zeigen Wetter immer ausgeklappt
            } else {
                setWeatherExpanded(false); // Kleinere Bildschirme starten mit Wetter zugeklappt
            }
        };

        // Event Listener für Größenänderung hinzufügen
        window.addEventListener('resize', handleResize);
        handleResize();

        // Cleanup: Listener entfernen, wenn Komponente unmountet wird
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


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

                    {/* Dropdown mit Suchergebnissen nur anzeigen, wenn dropdownVisible = true */}
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

                {/* Wetterbox: bei kleinem Bildschirm einklappbar */}
                <div className={`weather-box ${weatherExpanded ? 'expanded' : 'collapsed'}`}>
                    {isSmallScreen && (
                        <div
                            className="weather-header"
                            onClick={() => setWeatherExpanded(prev => !prev)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <IonIcon icon={sunnyOutline} className="weather-icon" />
                            <span style={{ marginLeft: '8px' }}>
        Weather {weatherExpanded ? '▲' : '▼'}
      </span>
                        </div>
                    )}

                    {(weatherExpanded || !isSmallScreen) && (
                        <div className="weather-text">
                            {loadingWeather && "Loading weather data..."}
                            {weatherError && `Error loading weather data for city: ${gardenSpotCity}`}
                            {weatherData && !loadingWeather && !weatherError && (
                                <>
                                    Weather for <strong>{weatherData.cityName}</strong>:{" "}
                                    {weatherData.weatherDescription.charAt(0).toUpperCase() + weatherData.weatherDescription.slice(1)},&nbsp;
                                    {Math.round(weatherData.temp)}°C – Humidity: {weatherData.humidity}% – Rainfall (last hour): {weatherData.rainProb} mm
                                </>
                            )}
                            {!weatherData && !loadingWeather && !weatherError && "No weather data available."}
                        </div>
                    )}
                </div>



                {/* Pflanzengitter */}
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
                {/* Löschbutton für Garden Spot */}
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
