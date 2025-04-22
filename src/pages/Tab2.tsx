import {
    IonButton,
    IonContent,
    IonFabButton,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import '../components/css/Tab2.css';
import React, {useEffect, useRef, useState} from "react";
import ProList from "../components/ProList";
import ContraList from "../components/ContraList";
import Popup from "../components/new_argument_popup";
import {add} from "ionicons/icons";
import ProgressBar from "../components/ProgressBar";
import store from "../db/storage";

export interface ArgumentItem {
    description: string;
    importance: number;
    ID: number;
}
export interface UserData{
    id: number;
    name: string;
    pro: ArgumentItem[];
    contra: ArgumentItem[];
};
const Tab2: React.FC = () => {

    const [userData, setUserData] = useState<UserData | null>(null);
    const [greenPercentage, setGreenPercentage] = useState(50);
    const [redPercentage, setRedPercentage] = useState(50);

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
                if (storedUser.pro.length > 0 || storedUser.contra.length > 0) {
                    updatePercentages(storedUser.pro, storedUser.contra);
                }
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

    const emptyStore = async () => {
        await store.clear();
        await store.set('user', {
            id: 0,
            name: "",
            pro: [],
            contra: [],
        });
        const storedUser: UserData | null = await store.get('user');
        setUserData(storedUser);
    }

    const popupRef = useRef<any>(null);

    const openPopup = () => {
        popupRef.current?.openModal();
    };





    const updatePercentages = (pros: ArgumentItem[], cons: ArgumentItem[]) => {
        const totalProImportance = pros.reduce((sum, item) => sum + item.importance, 0)
        const totalContraImportance = cons.reduce((sum, item) => sum + item.importance, 0)
        const total = totalProImportance + totalContraImportance;
            setGreenPercentage(Math.round((totalProImportance / total) * 100));
            setRedPercentage(Math.round((totalContraImportance / total) * 100));

    };


    return (
        <IonPage>
            <IonToolbar>
                <IonTitle>Standortwechsel</IonTitle>
            </IonToolbar>
            <IonContent >
                <div style={{margin: "10px"}}>
                    <ProgressBar greenPercentage={greenPercentage} redPercentage={redPercentage}></ProgressBar>
                    <IonButton onClick={emptyStore}>
                        Daten löschen
                    </IonButton>
                    <IonButton onClick={() => newArgument("Teständerung", 4, true, userData?.pro[1].ID || 1)}>
                        Ändern

                    </IonButton>


                </div>

                <div className="listen-container">
                    <ProList items={userData?.pro || []} updatePercentages={updatePercentages}/>

                    <div className="separator"></div>
                    <ContraList items={userData?.contra || []} updatePercentages={updatePercentages}/>
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
