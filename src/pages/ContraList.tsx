import React from 'react';
import {IonBadge, IonItem, IonLabel, IonList} from '@ionic/react';
import './List.css';
import {ArgumentItem} from "./Tab2";


interface ContraListProps {
    items: ArgumentItem[];
}

const ContraList: React.FC<ContraListProps> = ({ items }) => {
    return (
        <div className="list-div">
            <IonList className="list">
                <IonItem>
                    <IonLabel style={{fontWeight:"bold"}} >Contra</IonLabel>
                </IonItem>
                {items.map((item, index) => (
                    <IonItem button key={index}>
                        <IonBadge style={{width:"20px",margin:"10px"}} color="danger">{item.importance}</IonBadge>

                        <IonLabel>{item.description}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ContraList;
