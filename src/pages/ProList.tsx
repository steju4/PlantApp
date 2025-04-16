import React, {useRef} from 'react';
import {IonBadge, IonItem, IonLabel, IonList} from '@ionic/react';
import './List.css';
import {ArgumentItem} from "./Tab2";
import Popup from "../components/new_argument_popup";


interface ProListProps {
    items: ArgumentItem[];
}

const ProList: React.FC<ProListProps> = ({ items }) => {
    const popupRef = useRef<any>(null);

    const openPopup = () => {
        popupRef.current?.openModal();
    };
    return (
        <div className="list-div">
            <IonList className="list">
                <IonItem>
                    <IonLabel style={{fontWeight:"bold"}} >Pro</IonLabel>
                </IonItem>
                <Popup ref={popupRef}></Popup>
                {items.map((item, index) => (
                    <IonItem button key={index} onClick={openPopup}>
                            <IonBadge style={{width:"20px",margin:"10px"}} color="success">{item.importance}</IonBadge>

                        <IonLabel>{item.description}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ProList;
