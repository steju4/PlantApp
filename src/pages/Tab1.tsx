import React, {useEffect, useState} from 'react';
import store from '../db/storage';
import {IonBadge, IonContent, IonItem, IonLabel, IonList, IonPage, IonTextarea} from "@ionic/react";


// Typ für die Benutzerdaten


const ComplexDataExample = () => {
    // useState mit explizitem Typ
    type UserData = {
        id: number;
        name: string;
        pro: { proID: number, content: string, importance: number }[];
        contra: { conID: number, content: string, importance: number }[];
    };
    const [userData, setUserData] = useState<UserData | null>(null);
    const [text_value, setText_value] = useState("");
    const [importance_value, setImportance_value] = useState("");
    const [ID_value, setID_value] = useState("");


    // Beispielobjekt
    const exampleUser: UserData = {
        id: 123,
        name: 'Max Mustermann',
        pro: [{proID: 1, content: "Kurze Anfahrt", importance: 5}, {
            proID: 2,
            content: "Weniger Kosten",
            importance: 3
        }],
        contra: [{conID: 1, content: "Lange Anfahrt", importance: 2}, {
            conID: 2,
            content: "Hohe Kosten",
            importance: 8
        }],
    };

    // Speichern der Benutzerdaten
    const saveUserData = async () => {
        await store.set('user', exampleUser);
        setUserData(exampleUser);
    };
     const newArgument = async (content: string, importance: number, pro: boolean, ID: number) => {
        const storedUser: UserData | null = await store.get('user');
        if (storedUser) {
            let originalLength = 0
            let argumentToEdit
            if (pro) {
                originalLength = storedUser.pro.length;
                if (storedUser.pro && storedUser.pro.length > 0) {

                    argumentToEdit = storedUser.pro.find((argument) => argument.proID === ID)
                    if (argumentToEdit) {
                        argumentToEdit.content = content;
                        argumentToEdit.importance = importance;
                    } else {
                        console.log(`Es konnte kein Pro-Element mit der ID:${ID} gefunden werden.`)
                    }
                } else {
                    storedUser.pro = [{proID: 1, content: content, importance: importance}];
                }
            } else {
                originalLength = storedUser.contra.length;

                if (storedUser.contra && storedUser.contra.length > 0) {
                    argumentToEdit = storedUser.contra.find((argument) => argument.conID === ID)
                    if (argumentToEdit) {
                        argumentToEdit.content = content;
                        argumentToEdit.importance = importance;
                    } else {
                        console.log(`Es konnte kein Contra-Element mit der ID:${ID} gefunden werden.`)
                    }
                } else {
                    storedUser.contra = [{conID: 1, content: content, importance: importance}];
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

    return (
        <IonPage>
            <IonContent>
                <IonTextarea
                    autoGrow
                    placeholder="Neues Argument..."
                    onIonInput={(e) => setText_value(e.detail.value!)}
                    value={text_value}
                />
                <IonTextarea
                    autoGrow
                    placeholder="Neue Importance..."
                    onIonInput={(e) => setImportance_value(e.detail.value!)}
                    value={importance_value}
                />
                <IonTextarea
                    autoGrow
                    placeholder="Neue ID..."
                    onIonInput={(e) => setID_value(e.detail.value!)}
                    value={ID_value}
                />

                <IonList>
                    {userData?.pro?.map((item, index) => (
                        <IonItem button key={index}>
                            <IonBadge style={{width: "20px", margin: "10px"}}
                                      color="success">{item.importance}</IonBadge>

                            <IonLabel>{item.content}</IonLabel>
                        </IonItem>
                    ))}
                    {userData?.contra?.map((item, index) => (
                        <IonItem button key={index}>
                            <IonBadge style={{width: "20px", margin: "10px"}}
                                      color="danger">{item.importance}</IonBadge>

                            <IonLabel>{item.content}</IonLabel>
                        </IonItem>
                    ))}


                </IonList>
                <IonItem onClick={saveUserData}>Daten speichern</IonItem>
                <IonItem onClick={() => newArgument(text_value, parseInt(importance_value), false, parseInt(ID_value))}>Daten
                    ändern</IonItem>

            </IonContent>
        </IonPage>

    );
};

export default ComplexDataExample;

/*
<div>
    <h1>Benutzerdaten</h1>
    {userData ? (
        <div>
            <p><strong>ID:</strong> {userData.id}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Aufgaben:</strong> {userData.tasks.join(', ')}</p>
            <p><strong>Erledigte Aufgaben:</strong> {userData.completedTasks.join(', ')}</p>
        </div>
    ) : (
        <p>Keine Daten gefunden</p>
    )}
    <button onClick={saveUserData}>Daten speichern</button>
</div>*/
