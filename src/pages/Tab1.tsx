import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import React, {useState} from "react";
import ProgressBar from '../components/ProgressBar';

const Tab1: React.FC = () => {

    const [green, setGreen] = useState(50);
    const [red, setRed] = useState(50);


    function increase_percentage(colour: string, percentage: number) {
        if (colour == "green") {
            setGreen(green + percentage);
            setRed(red - percentage);
        } else {
            setRed(red + percentage);
            setGreen(green - percentage);
        }


    }




    return (
        <IonPage>

            <IonContent fullscreen>
                <div style={{padding: '10px'}}>
                    <h1>Dynamic Progress Bar</h1>
                    <ProgressBar greenPercentage={green} redPercentage={red}  />
                    <div style={{marginTop: '10px'}}>
                        <button onClick={() => increase_percentage("green", 10)}>Increase Green</button>
                        <button onClick={() => increase_percentage("red", 10)}>Increase Red</button>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    )
        ;
};

export default Tab1;
