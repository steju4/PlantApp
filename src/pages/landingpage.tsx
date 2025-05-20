import React, { useState } from 'react';
import {
    IonButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent
} from "@ionic/react";
import RegisterModal from '../components/modals/register';
import LoginModal from "../components/modals/login";

const LandingPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (email: string) => {
        setShowLogin(false);
    };

    const handleRegister = (name: string, email: string) => {
        setShowRegister(false);
    };

    return (
        <IonPage>
            <IonToolbar>
                <IonTitle style={{margin: "20px 0", textAlign: "center"}}>Welcome to PlantApp!</IonTitle>
            </IonToolbar>
            <IonContent className="ion-padding" fullscreen>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "60px"}}>
                    <h2>We're glad you're here!</h2>
                    <IonButton onClick={() => setShowRegister(true)} style={{margin: "16px 0"}}>
                        Register
                    </IonButton>
                    <IonButton onClick={() => setShowLogin(true)}>
                        Login
                    </IonButton>
                </div>
                <RegisterModal
                    isOpen={showRegister}
                    onClose={() => setShowRegister(false)}
                    onRegister={handleRegister}
                />
                <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                    onShowRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                />
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;