import React, {useEffect, useState} from "react";
import {IonButton, IonButtons, IonContent, IonItem, IonList, IonPage} from "@ionic/react";
import {language} from "ionicons/icons";
/*
import {addToTable} from "../db/database-script";
*/

const Tab1: React.FC = () => {


    return (
        <IonPage>
            <IonContent>
                <IonButton slot="large">

                </IonButton>
{/*                <IonButton size={"large"} style={{width:'200px'}} onClick={()=>{addToTable(82,"pros", "Wenn das funktioniert, fress ich n Besen!")}}>

                </IonButton>*/}

            </IonContent>
        </IonPage>
    );
};

export default Tab1;
