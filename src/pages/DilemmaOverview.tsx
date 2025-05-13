import React, {useEffect, useRef, useState} from 'react';
import {

    IonContent,
    IonFabButton, IonFooter,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {add, create} from "ionicons/icons";
import '../components/css/DilemmaOverview.css';
import store from "../storage/storage";
import {ColorPicker, Dilemma, UserData} from "../constants/interfaces";
import {StatusBar, Style} from '@capacitor/status-bar';




const DilemmaOverview: React.FC =  () => {

    const modal2 = useRef<HTMLIonModalElement>(null);
    const addDilemmaModal = useRef<HTMLIonModalElement>(null);
    const editDilemmaModal = useRef<HTMLIonModalElement>(null);


    useEffect(() => {
            StatusBar.setStyle({style: Style.Dark});

        }
    )


    useEffect(() =>{
        const statusBarHeight = window.navigator.userAgent.includes('Android') ? 24 : 0;
        document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`);
        console.log(statusBarHeight);
    })





    return (

        <IonPage>

            <IonToolbar style={{marginTop: "calc(var(--status-bar-height) + 15px)"}}>

                <IonTitle style={{marginTop: "15px"}} className={"title-Tab1"}>Plants</IonTitle>
                <div className="vertical-line"></div>
            </IonToolbar>
            <IonContent >

            </IonContent>
            <IonFooter style={{backgroundColor: 'white', width: '100vw', height: '90px'}}>

            </IonFooter>
        </IonPage>
    );
};

export default DilemmaOverview;
