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
import '../css/login.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
    onShowRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onShowRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Bitte füllen Sie alle Felder aus.');
            return;
        }
        setError('');
        onLogin(email, password);
        onClose();
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
                            value={email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                            placeholder="E-Mail-Adresse"
                        />
                    </div>
                    <div className="input-container">
                        <IonLabel position="stacked">Passwort</IonLabel>
                        <IonInput
                            type="password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
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
