import React, {useEffect, useRef, useState} from 'react';
import {

    IonContent,
    IonToolbar,
    IonTitle, IonFabButton, IonIcon, IonLabel,
} from '@ionic/react';
import {ArgumentItem, Dilemma, UserData} from "../interfaces";
import ProgressBar from "./ProgressBar";
import ProList from "./ProList";
import ContraList from "./ContraList";
import Popup from "./new_argument_popup";
import {add, returnDownBackOutline} from "ionicons/icons";
import "./css/Tab2.css"
import store from "../db/storage";


type Props = Dilemma & {
    onClose: () => void;
};

const DilemmaDetails: React.FC<Props> = ({pro, contra, id, lastEdit, name, onClose}) => {
    const [greenPercentage, setGreenPercentage] = useState(50);
    const [redPercentage, setRedPercentage] = useState(50);
    const [dilemma, setDilemma] = useState({
        proArguments: pro,
        conArguments: contra,
    });

    useEffect(() => {
        updatePercentages(pro, contra);
    }, []);



    const updatePercentages = (pros: ArgumentItem[], cons: ArgumentItem[]) => {
        const totalProImportance = pros.reduce((sum, item) => sum + item.importance, 0)
        const totalContraImportance = cons.reduce((sum, item) => sum + item.importance, 0)
        const total = totalProImportance + totalContraImportance;
        setGreenPercentage(Math.round((totalProImportance / total) * 100));
        setRedPercentage(Math.round((totalContraImportance / total) * 100));

    };
    type PopupRefType = {
        openModal: () => void;
        closeModal: () => void;
    };

    const popupRef = useRef<PopupRefType | null>(null);

    const openPopup = () => {
        popupRef.current?.openModal();
    };

    const addNewProArgument = async (newItem: ArgumentItem) => {
        const storedUser = await store.get('user') as UserData;

        if (storedUser?.dilemmata?.find(dilemma => dilemma.id === id)) {
            // Hole das erste Dilemma
            const target = storedUser?.dilemmata?.find(dilemma => dilemma.id === id);
            if (target) {
                // Neues Argument hinzufügen
                target.pro.push(newItem);
                target.lastEdit = new Date().toLocaleDateString();

                // Aktualisiere nur das veränderte Dilemma in der Liste der Dilemmata

                const updatedDilemmata = [...storedUser.dilemmata];
                updatedDilemmata.forEach((dilemma, index) => {
                    if (dilemma.id === target.id) {
                        updatedDilemmata[index] = target
                    }

                });

                // Aktualisiere den `user`-Speicher
                const updatedUser = {...storedUser, dilemmata: updatedDilemmata};

                await store.set('user', updatedUser);

                // Aktualisiere das lokale `dilemma` und Prozentsätze
                updatePercentages(target.pro, target.contra);
                const oldDilemma = dilemma
                oldDilemma.proArguments = target.pro
                setDilemma(oldDilemma);
            }

        } else {
            console.error("Dilemma data is missing or undefined.");
        }
    };


    const addNewContraArgument = async (newItem: ArgumentItem) => {
        const storedUser = await store.get('user') as UserData;
        if (storedUser?.dilemmata?.find(dilemma => dilemma.id === id)) {
            // Hole das erste Dilemma
            const target = storedUser.dilemmata?.find(dilemma => dilemma.id === id);
            if (target) {
                // Neues Contra-Argument hinzufügen
                target.contra.push(newItem);
                target.lastEdit = new Date().toLocaleDateString();

                // Aktualisiere nur das veränderte Dilemma in der Liste der Dilemmata
                const updatedDilemmata = [...storedUser.dilemmata]
                updatedDilemmata.forEach((dilemma, index) => {
                    if (dilemma.id === target.id) {
                        updatedDilemmata[index] = target
                    }
                });

                // Aktualisiere den `user`-Speicher
                const updatedUser = {...storedUser, dilemmata: updatedDilemmata};
                await store.set('user', updatedUser);
                const oldDilemma = dilemma
                oldDilemma.conArguments = target.contra
                setDilemma(oldDilemma);

                // Aktualisiere das lokale `dilemma` und Prozentsätze
                updatePercentages(target.pro, target.contra);

            }

        } else {
            console.error("Dilemma data is missing or undefined.");
        }
    };


    return (
        <IonContent>
            <IonToolbar onClick={onClose}>
                <IonLabel className="back-button">
                    <IonIcon icon={returnDownBackOutline} className="back-icon"/>
                </IonLabel>
            </IonToolbar>

            <div style={{marginTop: "0px"}}>
                <div className="listen-container">

                    <IonTitle>{name}</IonTitle>


                    <IonLabel className="date-label" style={{fontWeight: "bold"}}>{lastEdit}</IonLabel>


                </div>
                <div style={{margin: "10px"}}>
                    <ProgressBar greenPercentage={greenPercentage} redPercentage={redPercentage}></ProgressBar>
                </div>
            </div>


            {/*
                <IonButton onClick={emptyStore}></IonButton>
*/}


            <div className="listen-container">
                <ProList
                    items={dilemma.proArguments || []}
                    updatePercentages={updatePercentages}
                />


                <div className="separator"></div>
                <ContraList
                    items={dilemma.conArguments || []}
                    updatePercentages={updatePercentages}
                /></div>
            <Popup ref={popupRef}
                   addNewProArgument={addNewProArgument}
                   addNewContraArgument={addNewContraArgument}/>
            <div className="open-modal-button">
                <IonFabButton onClick={openPopup}>
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </div>

        </IonContent>
    )
}
export default DilemmaDetails;
