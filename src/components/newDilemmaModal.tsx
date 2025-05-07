import React from 'react';

import './css/List.css';
import {ColorPicker} from "../interfaces";
import {IonButton, IonButtons, IonHeader, IonTextarea, IonTitle, IonToolbar} from "@ionic/react";
import ColorPickerComponent from "./colorPicker";

interface ColorPickerProps {
    colors: ColorPicker[];
    selectColor: (id: number) => void;
    newDilemma: () => void;
    setDilemmaName: (name: string) => void;
    closeAddDilemmaModal: () => void;


}


const NewDilemmaModal: React.FC<ColorPickerProps> = ({colors, selectColor, newDilemma, setDilemmaName, closeAddDilemmaModal}) => {


    return (
        <div >
            <IonHeader  >
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => closeAddDilemmaModal()}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={newDilemma}>
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
                             onIonInput={(e) => setDilemmaName(e.detail.value as string)}
                             onKeyPress={(e) => { if (e.key === 'Enter') newDilemma(); }} // Inline Handler
                                >

                </IonTextarea>
                <ColorPickerComponent colors={colors} selectColor={selectColor}></ColorPickerComponent>


            </div>
        </div>


    )
}
export default NewDilemmaModal;