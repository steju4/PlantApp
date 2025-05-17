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
import '../css/login.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string) => void;
    onShowRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onShowRegister }) => {
    const emailRef = useRef<HTMLIonInputElement>(null);
    const passwordRef = useRef<HTMLIonInputElement>(null);
    const [error, setError] = useState<string>('');

    const handleLogin = async () => {
        const email = emailRef.current?.value?.toString().trim() || '';
        const password = passwordRef.current?.value?.toString() || '';
        if (!email || !password) {
            setError('Bitte füllen Sie alle Felder aus.');
            return;
        }
        const url = 'http://localhost:8080/auth/login';

        try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            if (res.status === 401) {
                setError('E-Mail oder Passwort ist falsch.');
            } else {
                setError('Fehler beim Login. Bitte versuche es erneut.');
            }
            return;
        }

        const data = await res.json();
        if (data.token) {
            console.log('Login erfolgreich mit Token:', data);
            sessionStorage.setItem('token', data.token);
        }
        setError('');
        onLogin(email);
        onClose();

    } catch (err) {
        setError('Serverfehler. Bitte versuche es später erneut.');
        console.error('Fehler:', err);
    }
};
    
    

    return (
        <IonModal isOpen={isOpen}
                  onDidDismiss={onClose}
                  style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="login-modal">
                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            type="email"
                            ref = {emailRef}
                            placeholder="E-Mail-Adresse"
                        />
                    </div>
                    <div className="input-container">
                        <IonLabel position="stacked">Passwort</IonLabel>
                        <IonInput
                            type="password"
                            ref = {passwordRef}
                            placeholder="Passwort"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <IonButton expand="block" onClick={handleLogin}>
                        Einloggen
                    </IonButton>

                    <div className="register-hint">
                        <span>
                            Sie haben noch keinen Account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); onShowRegister(); }}>
                                Jetzt registrieren
                            </a>
                        </span>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default LoginModal;
