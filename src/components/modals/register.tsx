import React, { useState, useRef } from 'react';
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
    const firstNameRef = useRef<HTMLIonInputElement>(null);
    const lastNameRef = useRef<HTMLIonInputElement>(null);
    const emailRef = useRef<HTMLIonInputElement>(null);
    const postalCodeRef = useRef<HTMLIonInputElement>(null);
    const cityRef = useRef<HTMLIonInputElement>(null);
    const passwordRef = useRef<HTMLIonInputElement>(null);
    const confirmPasswordRef = useRef<HTMLIonInputElement>(null);

    const [passwordError, setPasswordError] = useState<string>('');

    const handleRegister = async () => {
        const firstName = firstNameRef.current?.value?.toString().trim() || '';
        const lastName = lastNameRef.current?.value?.toString().trim() || '';
        const email = emailRef.current?.value?.toString().trim() || '';
        const postalCode = postalCodeRef.current?.value?.toString().trim() || '';
        const city = cityRef.current?.value?.toString().trim() || '';
        const password = passwordRef.current?.value?.toString() || '';
        const confirmPassword = confirmPasswordRef.current?.value?.toString() || '';

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !postalCode.trim() || !city.trim() || !password.trim() || !confirmPassword.trim()) {
            setPasswordError('Bitte füllen Sie alle Felder aus.');
            return;
        }

        if (emailExists) {
            setPasswordError('Diese E-Mail ist bereits vergeben.');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Die Passwörter stimmen nicht überein.');
            return;
        }

        setPasswordError('');
        await handleSubmit({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            zipCode: postalCode.trim(),
            cityName: city.trim(),
            password: password.trim()
        });
        onRegister(firstName.trim(), email.trim(), password.trim());
        onClose();
    };

    const [emailExists, setEmailExists] = useState<boolean>(false);
const [setEmailCheckLoading] = useState<boolean>(false);

const checkEmail = async (email: string) => {
    if (!email) return;
    try {
        const res = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);
        const exists = await res.json();
        setEmailExists(exists);
    } catch {
        setEmailExists(false);
    }
};

const handleSubmit = async (formData: any) => {
    const url = 'http://localhost:8080/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Fehler beim Request');
      }

      const data = await res.json();
      console.log(data);
      // z. B. JWT speichern oder auf Startseite weiterleiten

    } catch (err) {
      console.error('Fehler:', err);
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
                            <IonInput ref={firstNameRef} placeholder="Dein Vorname" type="text" />
                        </div>
                        <div className="input-item">
                            <IonLabel position="stacked">Nachname</IonLabel>
                            <IonInput ref={lastNameRef} placeholder="Dein Nachname" type="text" />
                        </div>
                    </div>

                    <div className="plz-wohnort-container">
                        <div className="input-item plz">
                            <IonLabel position="stacked">PLZ</IonLabel>
                            <IonInput ref={postalCodeRef} placeholder="PLZ" />
                        </div>
                        <div className="input-item wohnort">
                            <IonLabel position="stacked">Wohnort</IonLabel>
                            <IonInput ref={cityRef} placeholder="Wohnort" />
                        </div>
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            ref={emailRef}
                            type="email"
                            placeholder="Deine E-Mail-Adresse"
                            onIonBlur={e => checkEmail(e.target.value as string)}
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Passwort</IonLabel>
                        <IonInput
                            type="password"
                            ref={passwordRef}
                            placeholder="Dein Passwort"
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Passwort wiederholen</IonLabel>
                        <IonInput
                            type="password"
                            ref={confirmPasswordRef}
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
