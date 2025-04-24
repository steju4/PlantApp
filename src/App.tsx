import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { dice } from 'ionicons/icons';
import Tab1 from './pages/Tab1';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
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
              <Tab1 />
            </Route>
          </IonRouterOutlet>


        </IonTabs>
      </IonReactRouter>
    </IonApp>
);

export default App;
