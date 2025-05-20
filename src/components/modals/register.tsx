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
import { close } from 'ionicons/icons';
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
            setPasswordError('Please fill in all fields.');
            return;
        }

        if (emailExists) {
            setPasswordError('This email is already taken.');
            return;
        }

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
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}
        >
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonButton onClick={onClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
                    <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="register-modal">
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

                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            ref={emailRef}
                            type="email"
                            placeholder="Your email address"
                            onIonBlur={e => checkEmail(e.target.value as string)}
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Password</IonLabel>
                        <IonInput
                            type="password"
                            ref={passwordRef}
                            placeholder="Your password"
                        />
                    </div>

                    <div className="input-container">
                        <IonLabel position="stacked">Repeat Password</IonLabel>
                        <IonInput
                            type="password"
                            ref={confirmPasswordRef}
                            placeholder="Repeat Password"
                        />
                    </div>

                    {passwordError && <p className="error-message">{passwordError}</p>}

                    <IonButton className="register-button" onClick={handleRegister}>
                        Register
                    </IonButton>
                    <IonButton className="cancel-button" expand="block" fill="clear" color="medium" onClick={onClose}>
                        Cancel
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default RegisterModal;
