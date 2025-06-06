import React, { useState, useRef } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';
import '../css/add-garden-spot-modal.css';
import Header from "../header";

interface GardenSpotProps {
    newGardenSpot: () => void;          // Funktion zum Erstellen eines neuen Gartenplatzes
    setGardenSpotName: (name: string) => void; // Setter für Gartenplatz Name
    setPostCode: (code: string) => void;        // Setter für Postleitzahl
    setCity: (city: string) => void;            // Setter für Stadt
    setStreet: (street: string) => void;        // Setter für Straße
    setStreetNumber: (number: string) => void;  // Setter für Hausnummer
    closeGardenSpotDilemma: () => void;         // Funktion zum Schließen des Modals
}

const AddGardenSpotModal: React.FC<GardenSpotProps> = ({
                                                           newGardenSpot,
                                                           setGardenSpotName,
                                                           setPostCode,
                                                           setCity,
                                                           setStreet,
                                                           setStreetNumber,
                                                           closeGardenSpotDilemma
                                                       }) => {
    const [gardenSpotName, setLocalGardenSpotName] = useState<string>('');       // Lokaler Zustand Gartenplatzname
    const [street, setLocalStreet] = useState<string>('');                       // Lokaler Zustand Straße
    const [streetNumber, setLocalStreetNumber] = useState<string>('');           // Lokaler Zustand Hausnummer

    // Refs für die IonInput-Felder, falls benötigt (z.B. Fokus)
    const gardenSpotNameRef = useRef<HTMLIonInputElement>(null);
    const postCodeRef = useRef<HTMLIonInputElement>(null);
    const cityRef = useRef<HTMLIonInputElement>(null);
    const streetRef = useRef<HTMLIonInputElement>(null);
    const streetNumberRef = useRef<HTMLIonInputElement>(null);

    // Handler für Änderung des Gartenplatznamens, aktualisiert lokalen und externen Zustand
    const handleGardenSpotNameChange = (e: any) => {
        const name = e.detail.value as string;
        setLocalGardenSpotName(name);
        setGardenSpotName(name);
    };

    // Handler für Änderung der Straße, lokal + extern
    const handleStreetChange = (e: any) => {
        const streetValue = e.detail.value as string;
        setLocalStreet(streetValue);
        setStreet(streetValue);
    };

    // Handler für Änderung der Hausnummer, lokal + extern
    const handleStreetNumberChange = (e: any) => {
        const number = e.detail.value as string;
        setLocalStreetNumber(number);
        setStreetNumber(number);
    };

    return (
        <IonModal
            isOpen={true}                             // Modal ist immer geöffnet (kann angepasst werden)
            onDidDismiss={closeGardenSpotDilemma}    // Event beim Schließen des Modals
            style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }} // Volle Bildschirmgröße, keine Rundungen
        >
            {/* Verwenden der eigenen Header-Komponente mit Titel und Schließen-Funktion */}
            <Header title={gardenSpotName ? gardenSpotName : 'New Garden Spot'} onClose={closeGardenSpotDilemma} />

            <IonContent className="ion-padding">
                <div className="add-garden-spot-modal">
                    <div className="input-container">
                        <IonLabel position="stacked">Garden Spot Name</IonLabel>
                        <IonInput
                            ref={gardenSpotNameRef}
                            placeholder="Enter Garden Spot Name"
                            value={gardenSpotName}           // Wert des Input-Feldes
                            onIonInput={handleGardenSpotNameChange} // On-Input Handler
                        />
                    </div>

                    {/* Flexbox Layout für Straße und Hausnummer nebeneinander */}
                    <div className="input-container flex-row">
                        <div className="input-column">
                            <IonLabel position="stacked">Street</IonLabel>
                            <IonInput
                                ref={streetRef}
                                placeholder="Enter Street"
                                value={street}
                                onIonInput={handleStreetChange}  // On-Input Handler Straße
                            />
                        </div>

                        <div className="input-column">
                            <IonLabel position="stacked">Street Number</IonLabel>
                            <IonInput
                                ref={streetNumberRef}
                                placeholder="Enter Street Number"
                                value={streetNumber}
                                onIonInput={handleStreetNumberChange} // On-Input Handler Hausnummer
                            />
                        </div>
                    </div>

                    {/* Flexbox Layout für Postleitzahl und Stadt nebeneinander */}
                    <div className="input-container flex-row">
                        <div className="input-column">
                            <IonLabel position="stacked">Postal Code</IonLabel>
                            <IonInput
                                ref={postCodeRef}
                                placeholder="Enter Postal Code"
                                onIonInput={(e) => setPostCode(e.detail.value as string)} // Direkt Setter aufrufen
                            />
                        </div>

                        <div className="input-column">
                            <IonLabel position="stacked">City</IonLabel>
                            <IonInput
                                ref={cityRef}
                                placeholder="Enter City"
                                onIonInput={(e) => setCity(e.detail.value as string)}    // Direkt Setter aufrufen
                            />
                        </div>
                    </div>

                    {/* Bestätigungsbutton zum Speichern */}
                    <IonButton className="confirm-button" onClick={newGardenSpot}>
                        Confirm
                    </IonButton>
                    {/* Abbrechen Button zum Schließen ohne Speichern */}
                    <IonButton className="cancel-button" expand="block" fill="clear" color="medium" onClick={closeGardenSpotDilemma}>
                        Cancel
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default AddGardenSpotModal;
