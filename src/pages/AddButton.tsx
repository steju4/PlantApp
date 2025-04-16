import React from 'react';
import {IonFab, IonFabButton, IonIcon} from '@ionic/react';
import './AddButton.css';
import {add} from "ionicons/icons";


const AddButton: React.FC = () => {
    return (
        <IonFab>
            <IonFabButton>
                <IonIcon icon={add}></IonIcon>
            </IonFabButton>
        </IonFab>
    );
};
export default AddButton;
