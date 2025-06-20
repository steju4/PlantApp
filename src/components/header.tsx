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
import './css/header.css';

// Props-Interface für den Header-Komponent
interface HeaderProps {
    title: string;             // Titel, der in der Mitte angezeigt wird
    onClose: () => void;       // Callback-Funktion, die beim Schließen-Button ausgelöst wird
    onConfirm?: () => void;    // Optionale Callback-Funktion für den Bestätigen-Button
    showConfirm?: boolean;     // Optionale Steuerung, ob der Bestätigen-Button angezeigt wird
    confirmText?: string;      // Optionaler Text für den Bestätigen-Button (Standard: "Confirm")
}

// Funktionaler React-Komponent für den Header mit Close- und optional Confirm-Button
const Header: React.FC<HeaderProps> = ({ title, onClose, onConfirm, showConfirm, confirmText }) => {
    return (
        <IonHeader className="header-container">
            <IonToolbar>
                {/* Linker Bereich: Close-Button */}
                <IonButtons slot="start">
                    <IonButton onClick={onClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>

                {/* Mittlerer Bereich: Titel */}
                <IonTitle className="centered-title">{title}</IonTitle>

                {/* Rechter Bereich: Bestätigen-Button, falls showConfirm true und onConfirm vorhanden */}
                {showConfirm && onConfirm ? (
                    <IonButtons slot="end">
                        <IonButton fill="clear" onClick={onConfirm}>
                            <span className="confirm-text-gradient">
                                {confirmText || 'Confirm'}
                            </span>
                        </IonButton>
                    </IonButtons>
                ) : (
                    // Platzhalter-Div, um Layout beim Fehlen des Bestätigen-Buttons stabil zu halten
                    <IonButtons slot="end">
                        <div className="placeholder-button" />
                    </IonButtons>
                )}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
