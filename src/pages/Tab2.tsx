import {
    IonContent,
    IonFabButton,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab2.css';
import React, {useRef, useState} from "react";
import ProList from "./ProList";
import ContraList from "./ContraList";
import Popup from "../components/new_argument_popup";
import {add} from "ionicons/icons";
import ProgressBar from "../components/ProgressBar";

export interface ArgumentItem {
    description: string;
    importance: number;
    category: string;
    ID: number;
}

const Tab2: React.FC = () => {
    const popupRef = useRef<any>(null);

    const openPopup = () => {
        popupRef.current?.openModal();
    };
    const [proItems, setProItems] = useState<ArgumentItem[]>([]);
    const [contraItems, setContraItems] = useState<ArgumentItem[]>([]);
    const [greenPercentage, setGreenPercentage] = useState(50);
    const [redPercentage, setRedPercentage] = useState(50);

    const addToProList = (newItem: ArgumentItem) => {
        const updatedProItems = [...proItems, newItem];
        setProItems(updatedProItems);
        updatePercentages(updatedProItems, contraItems);
    };

    const addToContraList = (newItem: ArgumentItem) => {
        const updatedContraItems = [...contraItems, newItem];
        setContraItems(updatedContraItems);
        updatePercentages(proItems, updatedContraItems);
    };

    const calculateTotalImportance = (items: ArgumentItem[]) => {
        return items.reduce((sum, item) => sum + item.importance, 0);
    };

    const updatePercentages = (pros: ArgumentItem[], cons: ArgumentItem[]) => {
        const totalProImportance = calculateTotalImportance(pros);
        const totalContraImportance = calculateTotalImportance(cons);

        const total = totalProImportance + totalContraImportance;

        if (total === 0) {
            // Verhindert Division durch 0
            setGreenPercentage(50);
            setRedPercentage(50);
        } else {
            const green = (totalProImportance / total) * 100;
            const red = (totalContraImportance / total) * 100;

            setGreenPercentage(Math.round(green));
            setRedPercentage(Math.round(red));
        }
    };

    return (
        <IonPage>
            <IonToolbar>
                <IonTitle>Standortwechsel</IonTitle>
            </IonToolbar>
            <IonContent fullscreen>
                <div style={{margin: "10px"}}>
                    <ProgressBar greenPercentage={greenPercentage} redPercentage={redPercentage}></ProgressBar>
                </div>

                <div className="listen-container">
                    <ProList items={proItems} />
                    <div className="separator"></div>
                    <ContraList items={contraItems} />
                </div>
                <Popup ref={popupRef}
                    addToProList={addToProList}
                    addToContraList={addToContraList} />
            </IonContent>
            <div className="open-modal-button">
                <IonFabButton onClick={openPopup}>
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </div>
        </IonPage>
    );
};


export default Tab2;
