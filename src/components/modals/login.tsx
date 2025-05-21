import React, { useState, useRef } from 'react';
import { close } from 'ionicons/icons';
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
import { useHistory } from 'react-router-dom';
import '../css/login.css';
import Logo from '../../../public/assets/icon/logo.png';

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
    const history = useHistory();

    const handleLogin = async () => {
        const email = emailRef.current?.value?.toString().trim() || '';
        const password = passwordRef.current?.value?.toString() || '';
        if (!email || !password) {
            setError('Please fill in all fields.');
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
                setError('Email or password is incorrect.');
            } else {
                setError('Error logging in. Please try again.');
            }
            return;
        }
        else {
            history.push('/tab1');
        }

        const data = await res.json();
        if (data.token) {
            console.log('Login successful with token:', data);
            sessionStorage.setItem('token', data.token);
        }
        setError('');
        onLogin(email);
        onClose();

    } catch (err) {
        setError('Server error. Please try again later.');
        console.error('Error:', err);
    }
};
    
    

    return (
        <IonModal isOpen={isOpen}
                  onDidDismiss={onClose}
                  style={{ '--width': '100vw', '--height': '100vh', '--border-radius': '0' }}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <img src={Logo} alt="Logo" style={{ height: 50, marginLeft: 10, marginRight: 0 }} />
                    </IonButtons>
                    <IonTitle style={{ paddingLeft: "7px" }}>Welcome to PlantApp!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="login-modal">
                    <div
                        className="login-modal-header"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "30px",
                            marginBottom: "28px",
                            gap: "24px"
                        }}
                    >
                        <img src={Logo} alt="Logo" style={{ height: 150 }} />
                        <div>
                            <h2 style={{ marginBottom: 8, marginTop: 0, fontWeight: 700, color: "#4CAF50" }}>
                                Welcome to PlantApp!
                            </h2>
                            <p
                                style={{
                                    textAlign: "left",
                                    maxWidth: "95%",
                                    color: "#555",
                                    margin: 0
                                }}
                            >
                                Manage your plants and locations easily in a digital way.<br />
                                Create your own locations, add plants from a huge database, and keep everything in view!
                            </p>
                        </div>
                    </div>
                    <div className="input-container">
                        <IonLabel position="stacked">E-Mail</IonLabel>
                        <IonInput
                            type="email"
                            ref = {emailRef}
                            placeholder="Email address"
                        />
                    </div>
                    <div className="input-container">
                        <IonLabel position="stacked">Password</IonLabel>
                        <IonInput
                            type="password"
                            ref = {passwordRef}
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <IonButton expand="block" onClick={handleLogin}>
                        Login
                    </IonButton>

                    <div className="register-hint">
                        <span>
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); onShowRegister(); }}>
                                Register now
                            </a>
                        </span>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default LoginModal;
