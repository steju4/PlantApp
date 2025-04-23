import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonItem,
    IonRange,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
} from '@ionic/react';

const Popup = forwardRef(({ addNewProArgument, addNewContraArgument }: any, ref) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [value, setValue] = useState(5);
    const [text_value, setText_value] = useState('');
    const [segment_value, setSegment_value] = useState('pro');

    // Expose openModal and closeModal via ref
    useImperativeHandle(ref, () => ({
        openModal: () => modal.current?.present(),
        closeModal: () => modal.current?.dismiss(),
    }));

    const handleAddToList = () => {
        const newItem = {
            importance: value,
            description: text_value,
            category: segment_value,
            ID: Date.now(),
        };
        segment_value === 'pro' ? addNewProArgument(newItem) : addNewContraArgument(newItem);
        modal.current?.dismiss();
    };

    const confirm = () => {
        if (text_value.trim()) handleAddToList();
        setSegment_value('pro');
        setText_value('');
        setValue(5);
        modal.current?.dismiss();
    };

    return (
        <IonContent >
            <IonModal ref={modal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={confirm}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItem>
                        <IonSegment
                            value={segment_value}
                            onIonChange={(e) => setSegment_value(e.detail.value as string)}
                        >
                            <IonSegmentButton value="pro">
                                <IonLabel color="success">Pro</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="contra">
                                <IonLabel color="danger">Contra</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Importance</IonLabel>
                        <IonRange
                            min={1}
                            max={10}
                            step={1}
                            snaps
                            value={value}
                            onIonInput={(e) => setValue(e.detail.value as number)}
                        />
                        <div style={{ fontWeight: 'bold' }}>{value}</div>
                    </IonItem>
                    <IonItem>
                        <IonTextarea
                            autoGrow
                            placeholder="Neues Argument..."
                            onIonInput={(e) => setText_value(e.detail.value!)}
                            value={text_value}
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
        </IonContent>
    );
});

export default Popup;
