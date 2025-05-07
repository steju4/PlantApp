import React from 'react';

import './css/List.css';
import {ColorPicker, Dilemma} from "../constants/interfaces";
import {IonButton, IonButtons, IonHeader, IonIcon, IonTextarea, IonTitle, IonToolbar} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import ColorPickerComponent from "./ColorPicker";

interface ColorPickerProps {
    dilemma: Dilemma;
    clickedDilemmaName: string;
    colors: ColorPicker[];
    closeEditDilemmaModal: () => void;
    selectColor: (id: number) => void;
    editDilemma: (ID: number) => void;
    deleteDilemma: (ID: number) => void;
    setClickedDilemmaName: (name: string) => void;
    resetColorSelector : () => void;

}

const EditDilemmaModal: React.FC<ColorPickerProps> = ({dilemma, clickedDilemmaName, colors, closeEditDilemmaModal, selectColor, editDilemma, deleteDilemma, setClickedDilemmaName, resetColorSelector}) => {


    return (
        <div>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => {closeEditDilemmaModal()
                            resetColorSelector()} }>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <IonButton onClick={() => deleteDilemma(dilemma.id)}>
                            <IonIcon className="delete-button" icon={trashBin}></IonIcon>
                        </IonButton>

                    </IonButtons>

                    <IonButtons slot="end">
                        <IonButton onClick={() => editDilemma(dilemma.id)}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonTitle style={{marginTop: "20px"}}>Rename Dilemma</IonTitle>
            <div style={{margin: "20px"}}>
                <IonTextarea className="Textarea" autoGrow  value={clickedDilemmaName} placeholder={"Hier Dilemma-Namen eingeben..."} style={{
                    height: "100%",
                    width: "100%",
                    border: "2px solid black",
                    borderRadius: "5px"

                }}
                             onIonInput={(e) => setClickedDilemmaName(e.detail.value as string)}
                             onKeyPress={(e) => { if (e.key === 'Enter') editDilemma(dilemma.id)}} // Inline Handler
                >

                </IonTextarea>
                <ColorPickerComponent colors={colors} selectColor={selectColor}></ColorPickerComponent>


            </div>

        </div>

    )
}
export default EditDilemmaModal;