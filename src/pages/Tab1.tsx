import React, { useEffect, useRef, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFabButton, IonHeader, IonIcon,
    IonItem,
    IonLabel,
    IonList, IonModal,
    IonPage, IonTextarea,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {add, create} from "ionicons/icons";
import '../components/css/Tab1.css';
import DilemmaDetails from "../components/DilemmaDetails";
import store from "../db/storage";
import { Dilemma, UserData} from "../interfaces";


const Tab1: React.FC = () => {
    const [userData, setUserData] = useState<UserData>();
    const [dilemmaName, setDilemmaName] = useState("");
    const [dilemma, setDilemma] = useState<Dilemma>({
        id: 0,
        name: '',
        pro: [],
        contra: [],
        lastEdit: ''
    });
    const modal2 = useRef<HTMLIonModalElement>(null);
    const addDilemmaModal = useRef<HTMLIonModalElement>(null);


    useEffect(() => {
            const fetchUserData = async () => {
                const storedUser: UserData | null = await store.get('user');

                if (storedUser?.dilemmata) {
                    setUserData(storedUser);
                }
            }
            fetchUserData();
        }
    )



    const newDilemma = async () => {

        if (userData){
            const newUserData = [...userData.dilemmata];
            const newItem = {
                id: Date.now(),
                name: dilemmaName,
                pro: [],
                contra: [],
                lastEdit: ""
            }
            newUserData.push(newItem)
            userData.dilemmata = newUserData;
            setUserData(userData);
            await store.set('user', userData);
            addDilemmaModal.current?.dismiss();



        }
    }
    const openDilemma =  (id:number) => {
        if (userData){
            const chosenDilemma = userData.dilemmata.find((d) => d.id === id);
            if (chosenDilemma){
                setDilemma(chosenDilemma)

                modal2.current?.present()
            }

        }
    }


    return (
        <IonPage>
            <IonToolbar style={{marginTop: "20px"}}>
                <IonTitle>Dilemmata</IonTitle>
            </IonToolbar>
            <IonContent>
                <IonList>
                    {userData?.dilemmata.map(dilemma => (
                        <IonItem key={dilemma.id}>
                            <div className={"dilemma-container"}>
                                <div className="icon-container">
                                    <IonLabel onClick={() => openDilemma(dilemma.id)}>
                                        {dilemma.name}
                                    </IonLabel>
                                </div>
                                <IonIcon onClick={() => console.log("TODO")} className="edit-icon"
                                         icon={create}></IonIcon></div>

                        </IonItem>
                    ))}

                </IonList>
                <IonModal ref={modal2} style={{
                    '--width': '100vw',
                    '--height': '100vh',
                    '--border-radius': '0',
                }} >
                    <DilemmaDetails
                        pro={dilemma.pro}
                        id={dilemma.id}
                        name={dilemma.name}
                        contra={dilemma.contra}
                        lastEdit={dilemma.lastEdit}
                        onClose={() => modal2.current?.dismiss()}
                    />
                </IonModal>
                <IonModal ref={addDilemmaModal} style={{
                    '--width': '100vw',
                    '--height': '100vh',
                    '--border-radius': '0',
                }}>
                    <div>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonButton onClick={() => addDilemmaModal.current?.dismiss()}>Cancel</IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                <IonButton strong={true} onClick={newDilemma}>
                                    Confirm
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonTitle style={{marginTop: "20px"}}>Neues Dilemma anlegen</IonTitle>
                    <div style={{margin: "20px"}}>
                    <IonTextarea autoGrow placeholder={"Hier Dilemma-Namen eingeben..."} style={{
                        height: "100%",
                        width: "100%",
                        border: "2px solid black",
                        borderRadius: "5px"

                    }}
                                 onIonInput={(e) => setDilemmaName(e.detail.value as string)}>

                    </IonTextarea>

                        </div>
                    </div>
                </IonModal>

            </IonContent>
            <div className="open-modal-button">
                <IonFabButton onClick={() => addDilemmaModal.current?.present()}>
                    <IonIcon icon={add}>
                    </IonIcon>
                </IonFabButton>

            </div>
        </IonPage>

    );
};

export default Tab1;

