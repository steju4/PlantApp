import React, { useState } from 'react';
import { IonModal, IonImg, IonButton, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { PlantDetails } from '../../constants/interfaces';
import Header from "../Header";
import '../css/PlantDetailsModal.css';

interface PlantDetailsModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    plant: PlantDetails | null;
}

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({ isOpen, onDismiss, onConfirm, plant }) => {
    const [quantity, setQuantity] = useState(1);

    if (!plant) return null;

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}
                  style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}>
            <Header
                title="Pflanzen Details"
                onClose={onDismiss}
                onConfirm={onConfirm}
                showConfirm={true}
            />

            <div className="plant-details-modal">
                <IonImg
                    src={plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                        ? plant.default_image.thumbnail
                        : "assets/fallback_picture/monstera.png"}
                    className="plant-detail-image"
                />

                <div className="plant-detail-name">{plant.common_name}</div>
                <div className="plant-detail-scientific">{plant.scientific_name}</div>

                <div className="plant-detail-quantity">
                    <IonButton onClick={decreaseQuantity} fill="outline">
                        <IonIcon icon={remove} color="inherit" />
                    </IonButton>
                    <span className="quantity-number">{quantity}</span>
                    <IonButton onClick={increaseQuantity} fill="outline">
                        <IonIcon icon={add} color="inherit" />
                    </IonButton>
                </div>

                <IonButton expand="block" className="add-to-cart-button" onClick={() => console.log('Added', quantity)}>
                    Hinzufügen
                </IonButton>
            </div>
        </IonModal>
    );
};

export default PlantDetailsModal;
