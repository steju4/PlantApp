import {
    IonButton,
    IonContent,
    IonFabButton,
    IonIcon,
    IonPage, IonTextarea,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab2.css';
import React, {useEffect, useRef, useState} from "react";
import ProList from "./ProList";
import ContraList from "./ContraList";
import Popup from "../components/new_argument_popup";
import {add} from "ionicons/icons";
import ProgressBar from "../components/ProgressBar";
import store from "../db/storage";

export interface ArgumentItem {
    description: string;
    importance: number;
    ID: number;
}

const Tab2: React.FC = () => {
    // useState mit explizitem Typ
    type UserData = {
        id: number;
        name: string;
        pro: ArgumentItem[];
        contra: ArgumentItem[];
    };
    const [userData, setUserData] = useState<UserData | null>(null);
    const [text_value, setText_value] = useState("");
    const [importance_value, setImportance_value] = useState("");
    const [ID_value, setID_value] = useState("");


    // Beispielobjekt


    const newArgument = async (content: string, importance: number, pro: boolean, ID: number) => {
        const storedUser: UserData | null = await store.get('user');
        if (storedUser) {
            let originalLength = 0
            let argumentToEdit
            if (pro) {
                originalLength = storedUser.pro.length;
                if (storedUser.pro && storedUser.pro.length > 0) {

                    argumentToEdit = storedUser.pro.find((argument) => argument.ID === ID)
                    if (argumentToEdit) {
                        argumentToEdit.description = content;
                        argumentToEdit.importance = importance;
                    } else {
                        console.log(`Es konnte kein Pro-Element mit der ID:${ID} gefunden werden.`)
                    }
                } else {
                    storedUser.pro = [{
                        description: content, importance: importance, ID: 1
                    }];
                }
            } else {
                originalLength = storedUser.contra.length;

                if (storedUser.contra && storedUser.contra.length > 0) {
                    argumentToEdit = storedUser.contra.find((argument) => argument.ID === ID)
                    if (argumentToEdit) {
                        argumentToEdit.description = content;
                        argumentToEdit.importance = importance;
                    } else {
                        console.log(`Es konnte kein Contra-Element mit der ID:${ID} gefunden werden.`)
                    }
                } else {
                    storedUser.contra = [{ID: 1, description: content, importance: importance}];
                }
            }
            if (pro) {
                if (storedUser.pro.length === originalLength && argumentToEdit != undefined || storedUser.pro.length != originalLength && argumentToEdit === undefined) {
                    console.log("Pro-Argument-Array erfolgreich geändert.")
                }

            } else {
                if (storedUser.contra.length === originalLength && argumentToEdit != undefined || storedUser.contra.length != originalLength && argumentToEdit === undefined) {
                    console.log("Contra-Argument-Array erfolgreich geändert.")
                }

            }
            await store.set('user', storedUser);
            setUserData(storedUser);
        }

    }

    // Abrufen der Benutzerdaten
    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser: UserData | null = await store.get('user');
            if (storedUser) {
                setUserData(storedUser);
            }
        };
        fetchUserData();
    }, []);

    const addNewProArgument = async (newItem: ArgumentItem) => {
        const storedUser: UserData | null = await store.get('user');
        if (storedUser) {
            storedUser.pro.push(newItem);
            updatePercentages(storedUser.pro, storedUser.contra);
            setUserData(storedUser);
            await store.set('user', storedUser);


        }

    }
    const addNewContraArgument = async (newItem: ArgumentItem) => {
        const storedUser: UserData | null = await store.get('user');
        if (storedUser) {
            storedUser.contra.push(newItem);

            updatePercentages(storedUser.pro, storedUser.contra);
            setUserData(storedUser);
            await store.set('user', storedUser);



        }

    }
    const exampleUser: UserData = {
        id: 0,
        name: "",
        pro: [],
        contra: [],
    };
const emptyStore = async ()=>{
    await store.clear();
    await store.set('user', exampleUser);
    const storedUser1: UserData | null = await store.get('user');
    setUserData(storedUser1);








}

    const popupRef = useRef<any>(null);

    const openPopup = () => {
        popupRef.current?.openModal();
    };

    const [greenPercentage, setGreenPercentage] = useState(50);
    const [redPercentage, setRedPercentage] = useState(50);


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
                    <IonButton onClick={emptyStore}>
                        Daten löschen
                    </IonButton>
                    <IonButton onClick={()=> newArgument("Teständerung",4, true, userData?.pro[1].ID || 1 )}>
                        Ändern

                    </IonButton>


                </div>

                <div className="listen-container">
                    <ProList items={userData?.pro || []}/>

                    <div className="separator"></div>
                    <ContraList items={userData?.contra || []}/>
                </div>
                <Popup ref={popupRef}
                       addToProList={addNewProArgument}
                       addToContraList={addNewContraArgument}/>
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
