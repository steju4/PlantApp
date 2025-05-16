import React, { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonInput,
    IonButton
} from '@ionic/react';
import '../css/register.css';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (firstName: string, email: string, password: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleRegister = () => {
        if (firstName && lastName && email && postalCode && city && password && confirmPassword) {
            if (password !== confirmPassword) {
                setPasswordError('Die Passwörter stimmen nicht überein.');
                return;
            }
            setPasswordError('');
            onRegister(firstName, email, password);
            onClose();
        } else {
            setPasswordError('Bitte füllen Sie alle Felder aus.');
        }
    };

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registrieren</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="register-modal">
                    <div className="name-container">
                        <div className="input-item">
                            <IonLabel position="stacked">Vorname</IonLabel>
                            <IonInput
                                value={firstName}
                                onIonChange={(e) => setFirstName(e.detail.value!)}
                                placeholder="Dein Vorname"
                                type="text"
                            />
                        </div>
                        <div className="input-item">
                            <IonLabel position="stacked">Nachname</IonLabel>
                            <IonInput
                                value={lastName}
                                onIonChange={(e) => setLastName(e.detail.value!)}
                                placeholder="Dein Nachname"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="plz-wohnort-container">
                        <div className="input-item plz">
                            <IonLabel position="stacked">PLZ</IonLabel>
                            <IonInput
                                value={postalCode}
                                onIonChange={(e) => setPostalCode(e.detail.value!)}
                                placeholder="PLZ"
                            />
                        </div>
                        <div className="input-item wohnort">
                            <IonLabel position="stacked">Wohnort</IonLabel>
                            <IonInput
                                value={city}
                                onIonChange={(e) => setCity(e.detail.value!)}
                                placeholder="Wohnort"
                            />
                        </div>
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            value={email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                            type="email"
                            placeholder="Deine E-Mail-Adresse"
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Passwort</IonLabel>
                        <IonInput
                            type="password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                            placeholder="Dein Passwort"
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Passwort wiederholen</IonLabel>
                        <IonInput
                            type="password"
                            value={confirmPassword}
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                            placeholder="Passwort wiederholen"
                        />
                    </div>

                    {passwordError && <p className="error-message">{passwordError}</p>}

                    <IonButton className="register-button" onClick={handleRegister}>
                        Registrieren
                    </IonButton>
                    <IonButton className="cancel-button" expand="block" fill="clear" color="medium" onClick={onClose}>
                        Abbrechen
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default RegisterModal;
