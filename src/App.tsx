import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/landingpage';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

setupIonicReact();

const App: React.FC = () => {
  const [redirectToDashboard, setRedirectToDashboard] = useState<boolean>(false);

  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
    const token = sessionStorage.getItem('token');
    if (token) {
      setRedirectToDashboard(true);
    }
  }, []);

  return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              {/* Redirect to Tab1 when the app starts */}
              <Route exact path="/">
                {redirectToDashboard ? <Redirect to="/tab1" /> : <LandingPage />}
              </Route>
              <Route exact path="/landingpage">
                <LandingPage />
              </Route>
              <Route exact path="/tab1">
                <Dashboard />
              </Route>
            </IonRouterOutlet>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
