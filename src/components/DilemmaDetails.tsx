import React, {useEffect, useRef, useState} from 'react';
import {

    IonContent,
    IonTitle, IonFabButton, IonIcon, IonLabel, IonHeader, IonInput, IonToolbar,
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
    const [dilemmaName, setDilemmaName] = useState(name);
    const [dilemma, setDilemma] = useState({
        proArguments: pro,
        conArguments: contra,
        ID: id
    });

    useEffect(() => {
        updatePercentages(pro, contra);
    }, []);

    useEffect(() => {
        const changeDilemmaName = async () => {
            const storedUser = await store.get('user') as UserData;
            if (storedUser) {
                const DilemmaIndex = storedUser.dilemmata.findIndex(d => d.id === id);
                const updatedUser = storedUser
                updatedUser.dilemmata[DilemmaIndex].name = dilemmaName;
                await store.set('user', updatedUser);
            }
        }
        changeDilemmaName()
    }, [dilemmaName]); // Funktion wird ausgeführt, wenn "value" sich ändert


    const updatePercentages = (pros: ArgumentItem[], cons: ArgumentItem[]) => {
        const totalProImportance = pros.reduce((sum, item) => sum + item.importance, 0)
        const totalContraImportance = cons.reduce((sum, item) => sum + item.importance, 0)
        const total = totalProImportance + totalContraImportance;


        setGreenPercentage(Math.round((totalProImportance / total) * 100));
        console.log(greenPercentage)
        setRedPercentage(Math.round((totalContraImportance / total) * 100));
        console.log(redPercentage)


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
        <IonContent fullscreen className="safe-area">
            <Popup ref={popupRef} style={{
                '--width': '100vw',
                '--height': '100vh',
                '--border-radius': '0',
            }}
                   addNewProArgument={addNewProArgument}
                   addNewContraArgument={addNewContraArgument}/>
            <IonToolbar style={{marginTop:"30px"}}>
                <IonHeader className="ion-no-border" >
                    <IonLabel className="back-button" onClick={onClose}>
                        <IonIcon icon={returnDownBackOutline} className="back-icon"/>
                    </IonLabel>
                </IonHeader>
            </IonToolbar>

                <div>
                    <div className="listen-container">

                        <IonTitle>
                            <IonInput value={dilemmaName} onIonInput={(e) => setDilemmaName(e.detail.value as string)}>
                            </IonInput>
                        </IonTitle>

                        <div style={{marginRight: "10px", marginTop: "14px", fontSize: "18px"}}>
                        <IonLabel className="date-label" style={{fontWeight: "bold"}}>{lastEdit}</IonLabel>
                        </div>

                    </div>
                    <div style={{margin: "10px"}}>
                        <ProgressBar greenPercentage={greenPercentage} redPercentage={redPercentage}></ProgressBar>
                    </div>
                </div>


            {/*
                <IonButton onClick={emptyStore}></IonButton>
*/}


            <div className="listen-container">
                <div className="prolist">
                    <ProList
                        items={dilemma.proArguments || []}
                        updatePercentages={updatePercentages}
                        dilemma={dilemma}
                    />
                </div>
                <div className="separator"></div>

                <div className="contralist">

                    <ContraList
                        items={dilemma.conArguments || []}
                        updatePercentages={updatePercentages}
                        dilemma={dilemma}
                    /></div>
            </div>


            <div className="open-argument-edit-button">
                <IonFabButton onClick={openPopup} className="AddButton">
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </div>

        </IonContent>
    )
}
export default DilemmaDetails;
