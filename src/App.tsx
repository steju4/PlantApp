import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Dashboard from './pages/dashboard';
import LoginModal from './components/modals/login';
import RegisterModal from './components/modals/register';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

setupIonicReact();

const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(!token);


  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  useEffect(() => {
  if (token) setShowLogin(false);
}, [token]);

  return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              {/* Redirect to Tab1 when the app starts */}
              <Route exact path="/">
                {token ? <Redirect to="/tab1" /> : (
                  <>
                    <LoginModal
                      isOpen={showLogin}
                      onClose={() => setShowLogin(false)}
                      onLogin={() => {}}
                      onShowRegister={() => setShowRegister(true)}
                      setToken={setToken}
                    />
                    <RegisterModal
                      isOpen={showRegister}
                      onClose={() => setShowRegister(false)}
                      onRegister={() => setShowRegister(false)}
                    />
                  </>
                )}
              </Route>
              <Route exact path="/tab1">
                {token ? (
                  <Dashboard token={token} />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
            </IonRouterOutlet>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
