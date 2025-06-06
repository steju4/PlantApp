import React, { useState, useEffect } from 'react';
import {
    IonModal,
    IonImg,
    IonButton,
    IonIcon,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel
} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { PlantDetails } from '../../constants/interfaces';
import Header from "../header";
import '../css/plant-details-modal.css';

interface PlantDetailsModalProps {
    isOpen: boolean;               // Steuerung, ob das Modal sichtbar ist
    onDismiss: () => void;         // Callback zum Schließen des Modals
    onConfirm: (quantity: number) => void;  // Callback zum Bestätigen mit Menge
    plant: PlantDetails | null;    // Die Pflanze, deren Details angezeigt werden
}

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({
                                                                 isOpen,
                                                                 onDismiss,
                                                                 onConfirm,
                                                                 plant
                                                             }) => {
    const [quantity, setQuantity] = useState<number>(1);  // Zustand für die ausgewählte Menge

    // Reset der Menge auf 1, wenn das Modal geöffnet wird
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
        }
    }, [isOpen]);

    // Falls keine Pflanze übergeben wurde, nichts rendern
    if (!plant) return null;

    // Funktion zum Erhöhen der Menge
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    // Funktion zum Verringern der Menge, aber nicht unter 1
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        // Ionic Modal für die Anzeige der Pflanzendetails
        <IonModal
            isOpen={isOpen}           // Modal sichtbar je nach isOpen Prop
            onDidDismiss={onDismiss}  // Callback beim Schließen
            style={{
                '--width': '100vw',   // Volle Breite
                '--height': '100vh',  // Volle Höhe
            }}
        >
            {/* Header mit Titel (Pflanzenname), Schließen- und Bestätigungs-Button */}
            <Header
                title={plant.common_name || "Pflanzen Details"}  // Anzeigename oder Fallback
                onClose={onDismiss}                              // Schließen-Callback
                onConfirm={() => onConfirm(quantity)}            // Bestätigen-Callback mit Menge
                showConfirm={false}                              // Bestätigungs-Button nicht zeigen
            />

            {/* Hauptinhalt des Modals */}
            <IonContent fullscreen className="modal-content">
                <div className="plant-details-modal-content">

                    {/* Bild der Pflanze oder Fallback-Bild */}
                    <IonImg
                        src={
                            plant.default_image?.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                                ? plant.default_image?.thumbnail
                                : "assets/fallback_picture/monstera.png"
                        }
                        className="plant-detail-image"
                    />

                    {/* Anzeigename der Pflanze */}
                    <div className="plant-detail-name">{plant.common_name}</div>
                    {/* Wissenschaftlicher Name als Komma-getrennte Liste */}
                    <div className="plant-detail-scientific">
                        {plant.scientific_name?.join(', ')}
                    </div>

                    {/* Akkordeon-Gruppe mit verschiedenen Informationsbereichen */}
                    <IonAccordionGroup expand="inset">
                        {/* Standort & Pflege */}
                        {(plant.sunlight || plant.watering || plant.care_level || plant.pruning_month || plant.cycle) && (
                            <IonAccordion value="pflege">
                                <IonItem slot="header">
                                    <IonLabel>🌿 Location & Care</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {/* Lichtanforderungen */}
                                    {plant.sunlight?.length > 0 && (
                                        <div>🔆 <strong>Light requirements::</strong> {plant.sunlight.join(', ')}</div>
                                    )}
                                    {/* Bewässerung */}
                                    {plant.watering && (
                                        <div>💧 <strong>Watering:</strong> {plant.watering}</div>
                                    )}
                                    {/* Pflegelevel */}
                                    {plant.care_level && (
                                        <div>⚠️ <strong>Care level:</strong> {plant.care_level}</div>
                                    )}
                                    {/* Schnittmonate */}
                                    {plant.pruning_month?.length > 0 && (
                                        <div>✂️ <strong>Cutting months:</strong> {plant.pruning_month.join(', ')}</div>
                                    )}
                                    {/* Lebenszyklus */}
                                    {plant.cycle && (
                                        <div>🔁 <strong>Life cycle:</strong> {plant.cycle}</div>
                                    )}
                                </div>
                            </IonAccordion>
                        )}

                        {/* Eigenschaften */}
                        {(plant.growth_rate || typeof plant.drought_tolerant === "boolean" || typeof plant.indoor === "boolean" || typeof plant.medicinal === "boolean") && (
                            <IonAccordion value="eigenschaften">
                                <IonItem slot="header">
                                    <IonLabel>📐 Characteristics</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {/* Wachstumsgeschwindigkeit */}
                                    {plant.growth_rate && (
                                        <div>🌱 <strong>Growth rate:</strong> {plant.growth_rate}</div>
                                    )}
                                    {/* Trockenresistenz */}
                                    <div>☀️ <strong>Drought tolerant:</strong> {plant.drought_tolerant ? 'Yes' : 'No'}</div>
                                    {/* Eignet sich als Zimmerpflanze */}
                                    <div>🏠 <strong>Houseplant:</strong> {plant.indoor ? 'Yes' : 'No'}</div>
                                    {/* Medizinische Nutzung */}
                                    <div>💊 <strong>Medically usable:</strong> {plant.medicinal ? 'Yes' : 'No'}</div>
                                </div>
                            </IonAccordion>
                        )}

                        {/* Weitere Informationen */}
                        {(plant.origin?.length > 0 || plant.description) && (
                            <IonAccordion value="weitere">
                                <IonItem slot="header">
                                    <IonLabel>📚 Further information</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {/* Herkunft */}
                                    {plant.origin?.length > 0 && (
                                        <div>🌍 <strong>Origin:</strong> {plant.origin.join(', ')}</div>
                                    )}
                                    {/* Beschreibung */}
                                    {plant.description && (
                                        <div className="plant-detail-description">
                                            <strong>📝 Description:</strong> {plant.description}
                                        </div>
                                    )}
                                </div>
                            </IonAccordion>
                        )}
                    </IonAccordionGroup>

                    {/* Steuerung der Anzahl der Pflanzen */}
                    <div className="plant-detail-quantity">
                        {/* Button zum Verringern */}
                        <IonButton onClick={decreaseQuantity} className="quantity-button">
                            <IonIcon icon={remove} />
                        </IonButton>

                        {/* Eingabefeld für die Menge */}
                        <input
                            type="number"
                            min={1}
                            value={quantity === 0 ? '' : quantity}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') return setQuantity(0);        // Temporär leerer Wert erlaubt
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num >= 0) setQuantity(num); // Nur gültige Zahlen setzen
                            }}
                            onBlur={() => {
                                if (quantity < 1) setQuantity(1);              // Mindestwert 1 erzwingen
                            }}
                            className="quantity-input"
                        />

                        {/* Button zum Erhöhen */}
                        <IonButton onClick={increaseQuantity} className="quantity-button">
                            <IonIcon icon={add} />
                        </IonButton>
                    </div>

                    {/* Button zum Bestätigen der Auswahl und Pflanzen hinzufügen */}
                    <IonButton
                        expand="block"
                        className="add-to-cart-button"
                        onClick={() => onConfirm(quantity)}
                    >
                        Add plant
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default PlantDetailsModal;
