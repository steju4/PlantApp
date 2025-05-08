import React, { useRef, useState, useEffect } from 'react';
import {
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRange,
    IonTextarea,
    IonToolbar
} from '@ionic/react';
import './css/List.css';
import { ArgumentItem, Dilemma } from "../constants/interfaces";
import store from '../storage/storage';
import { trashBinOutline } from "ionicons/icons";

interface ContraListProps {
    items: ArgumentItem[];
    updatePercentages: (pros: ArgumentItem[], cons: ArgumentItem[]) => void;
    dilemma: { proArguments: ArgumentItem[], conArguments: ArgumentItem[], ID: number };
}

const ContraList: React.FC<ContraListProps> = ({ items, updatePercentages, dilemma }) => {
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

        // Änderungen im Speicher aktualisieren
        const User = await store.get('user');
        if (User?.dilemmata?.[0]) {
            const updatedDilemma = {
                ...User.dilemmata[0],
                contra: User.dilemmata[0].contra.map((arg: { ID: number }) =>
                    arg.ID === currentArgument.ID ? currentArgument : arg
                ),
            };

            if (
                JSON.stringify(User.dilemmata[0].pro) !== JSON.stringify(updatedDilemma.pro) ||
                JSON.stringify(User.dilemmata[0].contra) !== JSON.stringify(updatedDilemma.contra) ||
                JSON.stringify(User.dilemmata[0].name) !== JSON.stringify(updatedDilemma.name)
            ) {
                updatedDilemma.lastEdit = new Date(Date.now()).toLocaleDateString();
                User.dilemmata[0] = updatedDilemma;

                await store.set('user', User);
                updatePercentages(updatedDilemma.pro, updatedDilemma.contra);
            }
        }

        // Modal schließen und aktuelles Argument zurücksetzen
        setCurrentArgument(null);
        modal.current?.dismiss();
    };

    const DeleteArgument = async (argID: number) => {
        const currentArguments = [...localItems];
        const index = currentArguments.findIndex(contraArgument => contraArgument.ID === argID);
        currentArguments.splice(index, 1);
        setLocalItems(currentArguments);

        const User = await store.get('user');
        const Dilemma = User.dilemmata?.find((User_Dilemma: Dilemma) => User_Dilemma.id === dilemma.ID);
        const Dilemma_Index = User.dilemmata?.findIndex((User_Dilemma: Dilemma) => User_Dilemma.id === dilemma.ID);

        if (Dilemma) {
            Dilemma.contra = currentArguments;
            User.dilemmata[Dilemma_Index] = Dilemma;
            await store.set('user', User);
            updatePercentages(Dilemma.pro, Dilemma.contra);

        }
    };

    return (
        <div className="list-div">
            <IonList className="list" style={{ width:"auto"}}>
                <IonItem>
                    <IonLabel style={{ fontWeight: 'bold' }}>Contra</IonLabel>
                </IonItem>
                <IonModal ref={modal} style={{
                    '--width': '100vw',
                    '--height': '100vh',
                    '--border-radius': '0',
                }}>
                    <IonHeader style={{height:"calc(var(--status-bar-height, 24px) + 80px)"}}>
                        <IonToolbar style={{position:"absolute", bottom:"0px"}}>
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
                                        placeholder="New Argument..."
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
                    <IonItem button key={item.ID} onClick={() => openPopup(item)}>
                        <IonBadge className="badge-class" color="danger">
                            {item.importance}
                        </IonBadge>
                        <IonLabel style={{ maxWidth:"calc(100% - 50px)", margin:"5px", whiteSpace:"normal", overflowWrap:"break-word",hyphens:"auto",wordWrap:"break-word"}} className= "label-class" >{item.description}</IonLabel>
                        <div>
                            <IonIcon  className= "trashbin" icon={trashBinOutline} size={"small"} style={{ color: 'rgb(148, 1, 4)'}} onClick={(event) => {
                                event.stopPropagation();
                                DeleteArgument(item.ID);
                            }} />
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ContraList;
