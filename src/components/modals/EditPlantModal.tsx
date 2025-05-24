import React, { useState, useEffect } from 'react';
import { IonModal, IonImg, IonButton, IonIcon, IonContent } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { PlantDetails } from '../../constants/interfaces';
import Header from "../Header";
import '../css/PlantDetailsModal.css'; // gleiche CSS wird verwendet

interface EditPlantModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: (quantity: number) => void;
    plant: PlantDetails | null;
}

const EditPlantModal: React.FC<EditPlantModalProps> = ({ isOpen, onDismiss, onConfirm, plant }) => {
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (plant?.quantity) {
            setQuantity(plant.quantity);
        }
    }, [plant]);

    if (!plant) return null;

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onDismiss}
            style={{
                '--width': '100vw',
                '--height': '100vh',
                '--border-radius': '0',
                '--padding-top': '0',
                '--padding-bottom': '0',
            }}
        >
            <Header
                title={plant.common_name || "Bearbeite Pflanze"}
                onClose={onDismiss}
                onConfirm={() => onConfirm(quantity)}
                showConfirm={true}
            />

            <IonContent fullscreen className="modal-content">
                <div className="plant-details-modal-content">
                    <IonImg
                        src={
                            plant.default_image.thumbnail !== "https://perenual.com/storage/image/upgrade_access.jpg"
                                ? plant.default_image.thumbnail
                                : "assets/fallback_picture/monstera.png"
                        }
                        className="plant-detail-image"
                    />

                    <div className="plant-detail-name">{plant.common_name}</div>
                    <div className="plant-detail-scientific">{plant.scientific_name}</div>

                    <div className="plant-detail-quantity">
                        <IonButton onClick={decreaseQuantity} className="quantity-button">
                            <IonIcon icon={remove} />
                        </IonButton>

                        <input
                            type="number"
                            min={1}
                            value={quantity === 0 ? '' : quantity}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                    setQuantity(0);
                                    return;
                                }
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num >= 0) {
                                    setQuantity(num);
                                }
                            }}
                            onBlur={() => {
                                if (quantity < 1) {
                                    setQuantity(1);
                                }
                            }}
                            className="quantity-input"
                        />

                        <IonButton onClick={increaseQuantity} className="quantity-button">
                            <IonIcon icon={add} />
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default EditPlantModal;
