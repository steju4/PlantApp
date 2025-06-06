import React, { useState, useRef } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonIcon
} from '@ionic/react';
import { close, eye, eyeOff } from 'ionicons/icons'; // eye & eyeOff hinzufügen
import Header from "../header";
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
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleRegister = async () => {
        const firstName = firstNameRef.current?.value?.toString().trim() || '';
        const lastName = lastNameRef.current?.value?.toString().trim() || '';
        const email = emailRef.current?.value?.toString().trim() || '';
        const postalCode = postalCodeRef.current?.value?.toString().trim() || '';
        const city = cityRef.current?.value?.toString().trim() || '';
        const password = passwordRef.current?.value?.toString() || '';
        const confirmPassword = confirmPasswordRef.current?.value?.toString() || '';

        // Prüfen, ob alle erforderlichen Felder ausgefüllt sind
        if (!firstName || !lastName || !email || !postalCode || !city || !password || !confirmPassword) {
            setPasswordError('Please fill in all fields.');
            return;
        }

        // Validierung der E-Mail-Adresse mit einfachem Regex-Muster
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setPasswordError('Please enter a valid email address.');
            return;
        }

        // Überprüfen, ob die E-Mail-Adresse bereits existiert (aus dem Backend-Check)
        if (emailExists) {
            setPasswordError('This email is already taken.');
            return;
        }

        // Passwort muss mindestens 8 Zeichen lang sein
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        // Regex-Definitionen für Passwortanforderungen
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // mindestens ein Sonderzeichen
        const numberRegex = /\d/; // mindestens eine Zahl
        const uppercaseRegex = /[A-Z]/; // mindestens ein Großbuchstabe

        // Prüfen, ob Passwort mindestens ein Sonderzeichen enthält
        if (!specialCharRegex.test(password)) {
            setPasswordError('Password must contain at least one special character.');
            return;
        }

        // Prüfen, ob Passwort mindestens eine Zahl enthält
        if (!numberRegex.test(password)) {
            setPasswordError('Password must contain at least one number.');
            return;
        }

        // Prüfen, ob Passwort mindestens einen Großbuchstaben enthält
        if (!uppercaseRegex.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return;
        }


        // Prüfen, ob Passwort und Bestätigung übereinstimmen
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
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

    } catch (err) {
      console.error('Fehler:', err);
    }
};

    return (
        // IonModal-Komponente für das Registrierungs-Modal
        <IonModal
            isOpen={isOpen} // Modal sichtbar, wenn isOpen true ist
            onDidDismiss={onClose} // Callback beim Schließen des Modals
            style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }} // Volle Bildschirmgröße, keine Abrundung
        >
            {/* Header-Komponente mit Titel und Schließen-Button */}
            <Header
                title="Register"
                onClose={onClose}
                showConfirm={false} // Kein Bestätigungs-Button im Header
            />
            <IonContent className="ion-padding">
                <div className="register-modal">
                    {/* Eingabefelder für Vor- und Nachname */}
                    <div className="name-container">
                        <div className="input-item">
                            <IonLabel position="stacked">First name</IonLabel>
                            <IonInput ref={firstNameRef} placeholder="Your first name" type="text" />
                        </div>
                        <div className="input-item">
                            <IonLabel position="stacked">Last name</IonLabel>
                            <IonInput ref={lastNameRef} placeholder="Your last name" type="text" />
                        </div>
                    </div>

                    {/* Eingabefelder für Postleitzahl und Stadt */}
                    <div className="plz-wohnort-container">
                        <div className="input-item plz">
                            <IonLabel position="stacked">Postal Code</IonLabel>
                            <IonInput ref={postalCodeRef} placeholder="Postal Code" />
                        </div>
                        <div className="input-item wohnort">
                            <IonLabel position="stacked">City</IonLabel>
                            <IonInput ref={cityRef} placeholder="City" />
                        </div>
                    </div>

                    {/* Eingabefeld für E-Mail mit Validierungs-Check beim Verlassen */}
                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            ref={emailRef}
                            type="email"
                            placeholder="Your email address"
                            onIonBlur={e => checkEmail(e.target.value as string)} // Email-Verfügbarkeit prüfen beim Verlassen des Feldes
                            onIonInput={() => setPasswordError('')} // Fehleranzeige löschen bei Eingabe
                        />
                    </div>

                    {/* Eingabefeld für Passwort mit Sichtbarkeit umschalten */}
                    <div className="input-container">
                        <IonLabel position="stacked">Password</IonLabel>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <IonInput
                                type={showPassword ? "text" : "password"} // Passwort anzeigen oder verstecken
                                ref={passwordRef}
                                placeholder="Your password"
                                onIonInput={() => setPasswordError('')} // Fehleranzeige löschen bei Eingabe
                                style={{ flex: 1 }}
                            />
                            <IonIcon
                                icon={showPassword ? eyeOff : eye} // Icon passend zur Sichtbarkeit
                                style={{ fontSize: "24px", paddingLeft: "8px", cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)} // Passwort-Sichtbarkeit toggeln
                            />
                        </div>
                    </div>

                    {/* Eingabefeld zur Passwort-Wiederholung mit Sichtbarkeit umschalten */}
                    <div className="input-container">
                        <IonLabel position="stacked">Repeat Password</IonLabel>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <IonInput
                                type={showConfirmPassword ? "text" : "password"} // Sichtbarkeit ähnlich wie beim Passwort
                                ref={confirmPasswordRef}
                                placeholder="Repeat Password"
                                onIonInput={() => setPasswordError('')} // Fehleranzeige löschen bei Eingabe
                                style={{ flex: 1 }}
                            />
                            <IonIcon
                                icon={showConfirmPassword ? eyeOff : eye}
                                style={{ fontSize: "24px", paddingLeft: "8px", cursor: "pointer" }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                    </div>

                    {/* Anzeige der Fehlermeldung, falls gesetzt */}
                    {passwordError && <p className="error-message">{passwordError}</p>}

                    {/* Button zum Abschicken der Registrierung */}
                    <IonButton className="register-button" onClick={handleRegister}>
                        Register
                    </IonButton>

                    {/* Button zum Abbrechen und Schließen des Modals */}
                    <IonButton className="cancel-button" expand="block" fill="clear" color="medium" onClick={onClose}>
                        Cancel
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default RegisterModal;
