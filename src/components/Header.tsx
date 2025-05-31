import React from 'react';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';
import './css/Header.css';

interface HeaderProps {
    title: string;
    onClose: () => void;
    onConfirm?: () => void;
    showConfirm?: boolean;
    confirmText?: string;
}

const Header: React.FC<HeaderProps> = ({ title, onClose, onConfirm, showConfirm, confirmText }) => {
    return (
        <IonHeader className="header-container">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={onClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>

                <IonTitle className="centered-title">{title}</IonTitle>

                {showConfirm && onConfirm ? (
                    <IonButtons slot="end">
                        <IonButton fill="clear" onClick={onConfirm}>
                            <span className="confirm-text-gradient">
                                {confirmText || 'Confirm'}
                            </span>
                        </IonButton>
                    </IonButtons>
                ) : (
                    <IonButtons slot="end">
                        <div className="placeholder-button" />
                    </IonButtons>
                )}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;