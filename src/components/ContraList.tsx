import React, { useRef, useState, useEffect } from 'react';
import {
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRange,
    IonTextarea,
    IonToolbar
} from '@ionic/react';
import './css/List.css';
import { ArgumentItem } from '../pages/Tab2';
import store from '../db/storage';

interface ContraListProps {
    items: ArgumentItem[];
    updatePercentages: (pros: ArgumentItem[], cons: ArgumentItem[]) => void;
}

const ContraList: React.FC<ContraListProps> = ({ items, updatePercentages }) => {
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
        const storedUser = await store.get('user');
        const targetDilemma = storedUser?.dilemmata?.[0];

        if (!currentArgument || !targetDilemma) return;

        // Aktualisiere die lokale Liste
        const updatedItems = localItems.map((arg) =>
            arg.ID === currentArgument.ID ? currentArgument : arg
        );
        setLocalItems(updatedItems);

        // Änderungen im Speicher aktualisieren
        const updatedDilemma = {
            ...targetDilemma,
            contra: targetDilemma.contra.map((arg: { ID: number }) =>
                arg.ID === currentArgument.ID ? currentArgument : arg
            ),
        };

        if (
            JSON.stringify(targetDilemma.pro) !== JSON.stringify(updatedDilemma.pro) ||
            JSON.stringify(targetDilemma.contra) !== JSON.stringify(updatedDilemma.contra) ||
            JSON.stringify(targetDilemma.name) !== JSON.stringify(updatedDilemma.name)
        ) {
            updatedDilemma.lastEdit = new Date(Date.now()).toLocaleDateString();
            storedUser.dilemmata[0] = updatedDilemma;

            await store.set('user', storedUser);
            updatePercentages(updatedDilemma.pro, updatedDilemma.contra);
        }

        // Modal schließen und aktuelles Argument zurücksetzen
        setCurrentArgument(null);
        modal.current?.dismiss();
    };

    return (
        <div className="list-div">
            <IonList className="list">
                <IonItem>
                    <IonLabel style={{ fontWeight: 'bold' }}>Contra</IonLabel>
                </IonItem>
                <IonModal ref={modal}>
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
                    <IonItem button key={item.ID} onClick={() => openPopup(item)}>
                        <IonBadge className="badge-class" color="danger">
                            {item.importance}
                        </IonBadge>
                        <IonLabel className="label-class" style={{ margin: "5px" }}>{item.description}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ContraList;
