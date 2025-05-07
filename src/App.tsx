import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import DilemmaOverview from './pages/DilemmaOverview';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';
import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              {/* Redirect to Tab1 when the app starts */}
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>

              {/* Tab1 Route */}
              <Route exact path="/tab1">
                <DilemmaOverview />
              </Route>
            </IonRouterOutlet>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
