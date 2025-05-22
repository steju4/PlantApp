// PlantDetailsModal.tsx
import React from 'react';
import { IonModal, IonButton, IonImg } from '@ionic/react';
import { PlantDetails } from '../../constants/interfaces';
import '../css/PlantDetailsModal.css'; // Importiere die CSS-Datei für das Modal

interface PlantDetailsModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    plant: PlantDetails | null;
}

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({ isOpen, onDismiss, plant }) => {
    if (!plant) return null;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
            <div className="plant-details-modal">
                <IonButton onClick={onDismiss} fill="clear">Schließen</IonButton>
                <IonImg
                    src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                        ? plant.default_image.thumbnail
                        : "assets/fallback_picture/monstera.png"}
                    className="plant-detail-image"
                />
                <div className="plant-detail-name">{plant.common_name}</div>
                <div className="plant-detail-scientific">{plant.scientific_name}</div>
                <div className="plant-detail-description">
                    {plant.description || "Keine Beschreibung verfügbar"}
                </div>
            </div>
        </IonModal>
    );
};

export default PlantDetailsModal;
