import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
    IonContent,
    IonFabButton, IonIcon,
    IonItem,
    IonLabel,
    IonList, IonModal,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {add, create} from "ionicons/icons";
import '../components/css/Tab1.css';
import DilemmaDetails from "../components/DilemmaDetails";
import store from "../db/storage";
import {Dilemma, UserData} from "./Tab2";


const Tab1: React.FC = forwardRef((props, ref) => {
    const [dilemma, setDilemma] = useState<Dilemma>({
        id: 0,
        name: '',
        pro: [],
        contra: [],
        lastEdit: ''
    });
    const modal2 = useRef<HTMLIonModalElement>(null);
    useEffect(() => {
            const fetchUserData = async () => {
                const storedUser: UserData | null = await store.get('user');
                if (storedUser){
                    setDilemma(storedUser?.dilemmata[0]);

                }
            }
            fetchUserData();
        }
    )

    useImperativeHandle(ref, () => ({
        openDilemmaDetails: () => modal2.current?.present(),
        closeDilemmaDetails: () => modal2.current?.dismiss(),
    }));


    return (
        <IonPage>
            <IonToolbar style={{marginTop: "20px"}}>
                <IonTitle>Dilemmata</IonTitle>
            </IonToolbar>
            <IonContent>
                <IonList>
                    <IonItem>
                        <div className={"dilemma-container"}>
                            <div className="icon-container">
                                <IonLabel onClick={() => modal2.current?.present()}>
                                    Pause
                                </IonLabel>
                            </div>
                            <IonIcon onClick={() => console.log("Hi")} className="edit-icon"
                                     icon={create}></IonIcon>
                        </div>
                    </IonItem>
                </IonList>
                <IonModal ref={modal2}>
                    <DilemmaDetails
                        pro={dilemma.pro}
                        id={dilemma.id}
                        name={dilemma.name}
                        contra={dilemma.contra}
                        lastEdit={dilemma.lastEdit}
                        onClose={() => modal2.current?.dismiss()}
                    />
                </IonModal>

            </IonContent>
            <div className="open-modal-button">
                <IonFabButton>
                    <IonIcon icon={add}>
                    </IonIcon>
                </IonFabButton>
            </div>
        </IonPage>

    );
});

export default Tab1;

