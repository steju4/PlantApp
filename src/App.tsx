import { Route, Redirect } from 'react-router-dom';       // Routing-Komponenten
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact
} from '@ionic/react';                                    // Ionic Grundkomponenten
import { IonReactRouter } from '@ionic/react-router';     // Ionic-spezifischer Router
import Dashboard from './pages/dashboard';                // Hauptseite nach Login
import LoginModal from './components/modals/login';       // Login-Modal
import RegisterModal from './components/modals/register'; // Registrierungs-Modal

// Ionic CSS-Basisdateien
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';                           // eigene Theme-Variablen

import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar"; // StatusBar-Steuerung

setupIonicReact();                                        // Initialisiert Ionic React

const App: React.FC = () => {
  // steuert Sichtbarkeit der Register- und Login-Modals
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('token')                         // Token aus SessionStorage holen
  );
  const [showLogin, setShowLogin] = useState(!token);      // Login-Modal anzeigen, wenn kein Token

  // StatusBar auf dunkles Design setzen (einmal beim Mount)
  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  // Sobald sich der Token ändert, Login-Modal verbergen
  useEffect(() => {
    if (token) setShowLogin(false);
  }, [token]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Start-Route: "/" */}
            <Route exact path="/">
              {token ? (
                <Redirect to="/tab1" />                    // bei vorhandenem Token direkt zum Dashboard
              ) : (
                <>
                  <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={() => {}}
                    onShowRegister={() => setShowRegister(true)}
                    setToken={setToken}                     // Token-Setter an Login-Modal übergeben
                  />
                  <RegisterModal
                    isOpen={showRegister}
                    onClose={() => setShowRegister(false)}
                    onRegister={() => setShowRegister(false)}
                  />
                </>
              )}
            </Route>

            {/* Dashboard-Route: "/tab1" */}
            <Route exact path="/tab1">
              {token ? (
                <Dashboard token={token} />                // Dashboard anzeigen, wenn Token da
              ) : (
                <Redirect to="/" />                       // sonst zurück zur Login-Seite
              )}
            </Route>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;