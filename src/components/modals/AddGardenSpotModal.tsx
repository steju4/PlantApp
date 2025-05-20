import React from 'react';

import '../css/List.css';
import {IonButton, IonButtons, IonHeader, IonTextarea, IonTitle, IonToolbar} from "@ionic/react";

interface GardenSpotProps {

    newGardenSpot: () => void;
    setGardenSpotName: (name: string) => void;
    closeGardenSpotDilemma: () => void;


}


const AddGardenSpotModal: React.FC<GardenSpotProps> = ({ newGardenSpot, setGardenSpotName, closeGardenSpotDilemma}) => {


    return (
        <div >
            <IonHeader style={{height:"calc(var(--status-bar-height) + 80px)"}}>
                <IonToolbar style={{position:"absolute", bottom:"0px"}}>
                    <IonButtons slot="start">
                        <IonButton onClick={() => closeGardenSpotDilemma()}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={newGardenSpot}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonTitle style={{marginTop: "20px"}}>New Dilemma</IonTitle>
            <div style={{margin: "20px"}}>
                <IonTextarea className="Textarea" autoGrow placeholder={"Enter Dilemma Name..."}
                             style={{
                                 height: "100%",
                                 width: "100%",
                                 border: "2px solid black",
                                 borderRadius: "5px"

                             }}
                             onIonInput={(e) => setGardenSpotName(e.detail.value as string)}
                             onKeyPress={(e) => { if (e.key === 'Enter') newGardenSpot(); }} // Inline Handler
                >

                </IonTextarea>


            </div>
        </div>


    )
}
export default AddGardenSpotModal;