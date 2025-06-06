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
import { add, remove, trash } from 'ionicons/icons';
import { PlantDetails } from '../../constants/interfaces';
import Header from "../header";
import '../css/plant-details-modal.css';

interface EditPlantModalProps {
    isOpen: boolean;                  // Modal öffnen oder schließen
    onDismiss: () => void;            // Funktion zum Schließen des Modals
    onConfirm: (newQuantity: number) => void; // Bestätigen mit neuer Menge
    onDelete: () => void;             // Pflanze löschen Funktion
    plant: PlantDetails | null;       // Pflanzen-Details (optional)
    initialQuantity?: number;         // Anfangsmenge (optional)
}

const EditPlantModal: React.FC<EditPlantModalProps> = ({
                                                           isOpen,
                                                           onDismiss,
                                                           onConfirm,
                                                           onDelete,
                                                           plant,
                                                           initialQuantity
                                                       }) => {
    const [quantity, setQuantity] = useState<number>(1);  // Zustand für Menge

    // Beim Öffnen des Modals Menge initialisieren (default 1 oder übergeben)
    useEffect(() => {
        if (isOpen) {
            setQuantity(initialQuantity ?? 1);
        }
    }, [isOpen, initialQuantity]);

    if (!plant) return null;  // Wenn keine Pflanze vorhanden, nichts rendern

    // Menge erhöhen
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    // Menge verringern, aber nicht unter 1
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <IonModal
            isOpen={isOpen}                   // Modal Sichtbarkeit steuern
            onDidDismiss={onDismiss}          // Modal schließen Event
            style={{                         // Styles für Modal Größe & Aussehen
                '--width': '100vw',
                '--height': '100vh',
                '--border-radius': '0',
                '--padding-top': '0',
                '--padding-bottom': '0',
            }}
        >
            {/* Header mit Titel, Close-Button und Confirm-Button */}
            <Header
                title={plant.common_name || "Bearbeite Pflanze"}
                onClose={onDismiss}
                onConfirm={() => onConfirm(quantity)}
                showConfirm={true}
            />

            <IonContent fullscreen className="modal-content">
                <div className="plant-details-modal-content">

                    {/* Pflanzenbild, Fallback wenn kein Bild vorhanden */}
                    <IonImg
                        src={
                            plant.default_image?.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                                ? plant.default_image?.thumbnail
                                : "assets/fallback_picture/monstera.png"
                        }
                        className="plant-detail-image"
                    />

                    {/* Pflanzenname */}
                    <div className="plant-detail-name">{plant.common_name}</div>
                    {/* Wissenschaftlicher Name */}
                    <div className="plant-detail-scientific">
                        {plant.scientific_name?.join(', ')}
                    </div>

                    {/* Akkordeon Gruppe für verschiedene Pflanzeninfos */}
                    <IonAccordionGroup expand="inset">
                        {/* Standort & Pflege, falls Daten vorhanden */}
                        {(plant.sunlight || plant.watering || plant.care_level || plant.pruning_month || plant.cycle) && (
                            <IonAccordion value="pflege">
                                <IonItem slot="header">
                                    <IonLabel>🌿 Location & Care</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {plant.sunlight?.length > 0 && (
                                        <div>🔆 <strong>Light requirements:</strong> {plant.sunlight.join(', ')}</div>
                                    )}
                                    {plant.watering && (
                                        <div>💧 <strong>Watering:</strong> {plant.watering}</div>
                                    )}
                                    {plant.care_level && (
                                        <div>⚠️ <strong>Care level:</strong> {plant.care_level}</div>
                                    )}
                                    {plant.pruning_month?.length > 0 && (
                                        <div>✂️ <strong>Cutting months:</strong> {plant.pruning_month.join(', ')}</div>
                                    )}
                                    {plant.cycle && (
                                        <div>🔁 <strong>Life cycle:</strong> {plant.cycle}</div>
                                    )}
                                </div>
                            </IonAccordion>
                        )}

                        {/* Eigenschaften der Pflanze */}
                        {(plant.growth_rate || typeof plant.drought_tolerant === "boolean" || typeof plant.indoor === "boolean" || typeof plant.medicinal === "boolean") && (
                            <IonAccordion value="eigenschaften">
                                <IonItem slot="header">
                                    <IonLabel>📐 Characteristics</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {plant.growth_rate && (
                                        <div>🌱 <strong>Growth rate:</strong> {plant.growth_rate}</div>
                                    )}
                                    <div>☀️ <strong>Drought tolerant:</strong> {plant.drought_tolerant ? 'Yes' : 'No'}</div>
                                    <div>🏠 <strong>Houseplant:</strong> {plant.indoor ? 'Yes' : 'No'}</div>
                                    <div>💊 <strong>Medically usable:</strong> {plant.medicinal ? 'Yes' : 'No'}</div>
                                </div>
                            </IonAccordion>
                        )}

                        {/* Weitere Infos wie Herkunft und Beschreibung */}
                        {(plant.origin?.length > 0 || plant.description) && (
                            <IonAccordion value="weitere">
                                <IonItem slot="header">
                                    <IonLabel>📚 Further information</IonLabel>
                                </IonItem>
                                <div className="ion-padding" slot="content">
                                    {plant.origin?.length > 0 && (
                                        <div>🌍 <strong>Origin:</strong> {plant.origin.join(', ')}</div>
                                    )}
                                    {plant.description && (
                                        <div className="plant-detail-description">
                                            <strong>📝 Description:</strong> {plant.description}
                                        </div>
                                    )}
                                </div>
                            </IonAccordion>
                        )}
                    </IonAccordionGroup>

                    {/* Bereich zur Anpassung der Menge */}
                    <div className="plant-detail-quantity">
                        {/* Button zum Verringern der Menge */}
                        <IonButton onClick={decreaseQuantity} className="quantity-button">
                            <IonIcon icon={remove} />
                        </IonButton>

                        {/* Input für direkte Eingabe der Menge */}
                        <input
                            type="number"
                            min={1}
                            value={quantity === 0 ? '' : quantity}   // Zeigt leeres Feld bei 0
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                    setQuantity(0);  // Leeres Feld möglich
                                    return;
                                }
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num >= 0) {
                                    setQuantity(num);  // Menge aktualisieren
                                }
                            }}
                            onBlur={() => {
                                if (quantity < 1) {
                                    setQuantity(1);  // Mindestmenge auf 1 setzen
                                }
                            }}
                            className="quantity-input"
                        />

                        {/* Button zum Erhöhen der Menge */}
                        <IonButton onClick={increaseQuantity} className="quantity-button">
                            <IonIcon icon={add} />
                        </IonButton>
                    </div>

                    {/* Button zum Löschen der Pflanze */}
                    <IonButton
                        expand="block"
                        onClick={onDelete}               // Löschen Funktion aufrufen
                        className="delete-button"
                    >
                        <IonIcon icon={trash} slot="start" />  {/* Papierkorb Icon */}
                        Delete plant
                    </IonButton>

                </div>
            </IonContent>
        </IonModal>
    );
};

export default EditPlantModal;
