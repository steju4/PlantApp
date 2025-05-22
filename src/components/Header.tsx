import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import './css/Header.css'; // Importiere das Header-CSS

interface HeaderProps {
    title: string;
    onClose: () => void;
    onConfirm?: () => void;  // Optionaler Prop für den Confirm-Button
    showConfirm?: boolean;   // Optional, ob der Confirm-Button angezeigt werden soll
}

const Header: React.FC<HeaderProps> = ({ title, onClose, onConfirm, showConfirm }) => {
    return (
        <IonHeader className="header-container">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={onClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
                <IonTitle className="ion-text-left">{title}</IonTitle>
                {showConfirm && onConfirm && (
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={onConfirm}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                )}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
