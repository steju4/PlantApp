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
import '../css/AddGardenSpotModal.css'; // Stelle sicher, dass du das korrekte CSS importierst

interface GardenSpotProps {
    newGardenSpot: () => void;
    setGardenSpotName: (name: string) => void;
    setPostCode: (code: string) => void;
    setCity: (city: string) => void;
    setStreet: (street: string) => void;
    setStreetNumber: (number: string) => void;
    closeGardenSpotDilemma: () => void;
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
    const [gardenSpotName, setLocalGardenSpotName] = useState<string>('');
    const [street, setLocalStreet] = useState<string>('');
    const [streetNumber, setLocalStreetNumber] = useState<string>('');

    const gardenSpotNameRef = useRef<HTMLIonInputElement>(null);
    const postCodeRef = useRef<HTMLIonInputElement>(null);
    const cityRef = useRef<HTMLIonInputElement>(null);
    const streetRef = useRef<HTMLIonInputElement>(null);
    const streetNumberRef = useRef<HTMLIonInputElement>(null);

    const handleGardenSpotNameChange = (e: any) => {
        const name = e.detail.value as string;
        setLocalGardenSpotName(name);
        setGardenSpotName(name);
    };

    const handleStreetChange = (e: any) => {
        const streetValue = e.detail.value as string;
        setLocalStreet(streetValue);
        setStreet(streetValue);
    };

    const handleStreetNumberChange = (e: any) => {
        const number = e.detail.value as string;
        setLocalStreetNumber(number);
        setStreetNumber(number);
    };

    return (
        <IonModal
            isOpen={true}
            onDidDismiss={closeGardenSpotDilemma}
            style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}
        >
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={closeGardenSpotDilemma}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{gardenSpotName ? gardenSpotName : 'New Garden Spot'}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="add-garden-spot-modal">
                    <div className="input-container">
                        <IonLabel position="stacked">Garden Spot Name</IonLabel>
                        <IonInput
                            ref={gardenSpotNameRef}
                            placeholder="Enter Garden Spot Name"
                            value={gardenSpotName}
                            onIonInput={handleGardenSpotNameChange}
                        />
                    </div>

                    {/* Flexbox Layout für Straße und Hausnummer */}
                    <div className="input-container flex-row">
                        <div className="input-column">
                            <IonLabel position="stacked">Street</IonLabel>
                            <IonInput
                                ref={streetRef}
                                placeholder="Enter Street"
                                value={street}
                                onIonInput={handleStreetChange}
                            />
                        </div>

                        <div className="input-column">
                            <IonLabel position="stacked">Street Number</IonLabel>
                            <IonInput
                                ref={streetNumberRef}
                                placeholder="Enter Street Number"
                                value={streetNumber}
                                onIonInput={handleStreetNumberChange}
                            />
                        </div>
                    </div>

                    {/* Flexbox Layout für Postleitzahl und Stadt */}
                    <div className="input-container flex-row">
                        <div className="input-column">
                            <IonLabel position="stacked">Postal Code</IonLabel>
                            <IonInput
                                ref={postCodeRef}
                                placeholder="Enter Postal Code"
                                onIonInput={(e) => setPostCode(e.detail.value as string)}
                            />
                        </div>

                        <div className="input-column">
                            <IonLabel position="stacked">City</IonLabel>
                            <IonInput
                                ref={cityRef}
                                placeholder="Enter City"
                                onIonInput={(e) => setCity(e.detail.value as string)}
                            />
                        </div>
                    </div>

                    <IonButton className="confirm-button" onClick={newGardenSpot}>
                        Confirm
                    </IonButton>
                    <IonButton className="cancel-button" expand="block" fill="clear" color="medium" onClick={closeGardenSpotDilemma}>
                        Cancel
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default AddGardenSpotModal;
