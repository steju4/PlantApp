import React, {useRef, useState, useEffect} from 'react';
import {
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRange,
    IonTextarea,
    IonToolbar
} from '@ionic/react';
import './css/List.css';
import {ArgumentItem, Dilemma} from "../interfaces";
import store from '../db/storage';
import {trashBinOutline} from "ionicons/icons";


interface ProListProps {
    items: ArgumentItem[];
    updatePercentages: (pros: ArgumentItem[], cons: ArgumentItem[]) => void; // Neue Prop-Typisierung
    dilemma: {proArguments: ArgumentItem[], conArguments: ArgumentItem[], ID: number};

}

const ProList: React.FC<ProListProps> = ({ items, updatePercentages, dilemma }) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [localItems, setLocalItems] = useState<ArgumentItem[]>(items);
    const [currentArgument, setCurrentArgument] = useState<ArgumentItem | null>(null);

    // Synchronisiere lokale Items mit den Props
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const openPopup = (argument: ArgumentItem) => {
        setCurrentArgument(argument);
        modal.current?.present();
    };

    const handleSave = async () => {
        if (!currentArgument) return;

        // Aktualisiere die lokale Liste
        const updatedItems = localItems.map((arg) =>
            arg.ID === currentArgument.ID ? currentArgument : arg
        );
        setLocalItems(updatedItems);

        // Debugging: Prüfen der aktualisierten Liste

        // Änderungen in den Speicher schreiben
        const User = await store.get('user');

        if (User?.dilemmata?.[0]) {
            // Hole das erste Dilemma
            const updatedDilemma = {
                ...User.dilemmata[0],
                pro: User.dilemmata[0].pro.map((arg: { ID: number }) =>
                    arg.ID === currentArgument.ID ? currentArgument : arg
                ),
            };

            // Prüfe auf Änderungen, bevor die Daten gespeichert werden
            const oldDilemma = User.dilemmata[0];
            if (
                JSON.stringify(oldDilemma.pro) !== JSON.stringify(updatedDilemma.pro) ||
                JSON.stringify(oldDilemma.contra) !== JSON.stringify(updatedDilemma.contra) ||
                JSON.stringify(oldDilemma.name) !== JSON.stringify(updatedDilemma.name)
            ) {
                updatedDilemma.lastEdit = new Date(Date.now()).toLocaleDateString();

                // Speichere nur das veränderte Dilemma in der Liste der Dilemmata
                const updatedDilemmata = User.dilemmata.map((dilemma: Dilemma, index: number) =>
                    index === 0 ? updatedDilemma : dilemma
                );

                await store.set('user', { ...User, dilemmata: updatedDilemmata });
                updatePercentages(updatedDilemma.pro, updatedDilemma.contra);
            }
        } else {
            console.error("Dilemmata data is missing or undefined.");
        }

        // Modal schließen und aktuelles Argument zurücksetzen
        setCurrentArgument(null);
        modal.current?.dismiss();
    };
    const DeleteArgument = async(argID:number)=>{
        const currentArguments = [...localItems]
        const index = currentArguments.findIndex(proArgument => proArgument.ID === argID);
        currentArguments.splice(index, 1);
        setLocalItems(currentArguments);
        const User = await store.get('user');
        const Dilemma = User.dilemmata?.find((User_Dilemma: Dilemma) => User_Dilemma.id === dilemma.ID);
        const Dilemma_Index = User.dilemmata?.findIndex((User_Dilemma: Dilemma) => User_Dilemma.id === dilemma.ID);
        Dilemma.pro = currentArguments;
        User.dilemmata[Dilemma_Index] = Dilemma
        await store.set('user', User);
        updatePercentages(Dilemma.pro, Dilemma.contra);

    }


    return (
        <div className="list-div">
            <IonList className="list">
                <IonItem>
                    <IonLabel style={{fontWeight: 'bold'}}>Pro</IonLabel>
                </IonItem>
                <IonModal ref={modal} style={{
                    '--width': '100vw',
                    '--height': '100vh',
                    '--border-radius': '0',
                }}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                <IonButton strong={true} onClick={handleSave}>
                                    Confirm
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        {currentArgument && (
                            <>
                                <IonItem>
                                    <IonLabel>Importance</IonLabel>
                                    <IonRange
                                        min={1}
                                        max={10}
                                        step={1}
                                        snaps
                                        value={currentArgument.importance}
                                        onIonInput={(e) =>
                                            setCurrentArgument({
                                                ...currentArgument,
                                                importance: e.detail.value as number,
                                            })
                                        }
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonTextarea
                                        autoGrow
                                        placeholder="Neues Argument..."
                                        value={currentArgument.description}
                                        onIonInput={(e) =>
                                            setCurrentArgument({
                                                ...currentArgument,
                                                description: e.detail.value || '',
                                            })
                                        }
                                    />
                                </IonItem>
                            </>
                        )}
                    </IonContent>
                </IonModal>
                {localItems.map((item) => (
                    <IonItem button key={item.ID} onClick={() => openPopup(item)} >
                        <IonBadge className="badge-class" color="success" >
                            {item.importance}
                        </IonBadge>
                        <IonLabel className= "label-class" style={{margin:"5px"}} >{item.description}</IonLabel>
                            <div >
                        <IonIcon icon={trashBinOutline} size={"small"} style={{ color: 'rgb(148, 1, 4)'}} onClick={(event) => {
                            event.stopPropagation();
                            DeleteArgument(item.ID);
                        }}>

                        </IonIcon>
                            </div>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ProList;
