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
import DilemmaDetails from "../components/DilemmaDetails";
import store from "../storage/storage";
import {ColorPicker, Dilemma, UserData} from "../constants/interfaces";
import {colorOptions} from "../constants/Colors";
import EditDilemmaModal from "../components/EditDilemmaModal";
import NewDilemmaModal from "../components/NewDilemmaModal";
import {StatusBar, Style} from '@capacitor/status-bar';


const DilemmaOverview: React.FC = () => {
    const [colors, setColors] = useState<ColorPicker[]>(colorOptions);
    const [selectedColor, setSelectedColor] = useState("");
    const [userData, setUserData] = useState<UserData>();
    const [dilemmaName, setDilemmaName] = useState("");
    const [clickedDilemmaName, setClickedDilemmaName] = useState("");
    const [dilemma, setDilemma] = useState<Dilemma>({
        id: 0,
        name: '',
        pro: [],
        contra: [],
        lastEdit: '',
        color: "white",
        progressbarBlur: false
    });
    const modal2 = useRef<HTMLIonModalElement>(null);
    const addDilemmaModal = useRef<HTMLIonModalElement>(null);
    const editDilemmaModal = useRef<HTMLIonModalElement>(null);


    useEffect(() => {
            StatusBar.setStyle({style: Style.Dark});
        }
    )

    useEffect(() => {
            const fetchUserData = async () => {
                const storedUser: UserData | null = await store.get('user');
                if (storedUser?.dilemmata) {
                    setUserData(storedUser);
                }
            }
            fetchUserData();
        }
    )


    const newDilemma = async () => {
        if (dilemmaName.trim() !== "") {
            if (userData) {
                const newUserData = [...userData.dilemmata];
                const newItem = {
                    id: Date.now(),
                    name: dilemmaName,
                    pro: [],
                    contra: [],
                    lastEdit: "",
                    color: selectedColor,
                    progressbarBlur: false
                }
                newUserData.push(newItem)
                userData.dilemmata = newUserData;
                setUserData(userData);
                await store.set('user', userData);
                addDilemmaModal.current?.dismiss();
                resetColorSelector()


            } else {
                const newItem = {
                    id: Date.now(),
                    name: dilemmaName,
                    pro: [],
                    contra: [],
                    lastEdit: "",
                    color: selectedColor,
                    progressbarBlur: false
                }
                const newUserData = {
                    dilemmata: [newItem],
                    id: Date.now(),
                }
                setUserData(newUserData);
                await store.set('user', newUserData);
                addDilemmaModal.current?.dismiss();
                resetColorSelector()

            }
        }
        setDilemmaName("")

    }

    const openDilemma = (id: number) => {
        if (userData) {
            const chosenDilemma = userData.dilemmata.find((d) => d.id === id);
            if (chosenDilemma) {
                setDilemma(chosenDilemma)
                modal2.current?.present()
            }
        }
    }
    const openEditDilemma = async (ID: number) => {
        const clickedDilemma = userData?.dilemmata?.find(d => d.id === ID)
        if (clickedDilemma)
            setSelectedColor(clickedDilemma.color)
        if (clickedDilemma?.color != "") {
            const clickedDilemmaColorIndex = colors.findIndex(color => color.colorcode == clickedDilemma?.color)
            const colorCopy = [...colors]
            colorCopy[clickedDilemmaColorIndex].border = "1px solid grey"
        }
        if (clickedDilemma) {

            setDilemma(clickedDilemma)
            setClickedDilemmaName(clickedDilemma.name);
            editDilemmaModal.current?.present()
        }
    }

    const editDilemma = async (ID: number) => {
        if (clickedDilemmaName.trim() !== "") {

            const clickedDilemma = userData?.dilemmata?.find(d => d.id === ID)
            const clickedDilemmaIndex: number = userData?.dilemmata?.findIndex(d => d.id === ID) as number
            if (clickedDilemma) {
                clickedDilemma.name = clickedDilemmaName
                const changedUserData = userData
                if (changedUserData)
                    changedUserData.dilemmata[clickedDilemmaIndex].name = clickedDilemmaName
                if (selectedColor != "" && changedUserData) {
                    changedUserData.dilemmata[clickedDilemmaIndex].color = selectedColor
                } else {
                    changedUserData!.dilemmata[clickedDilemmaIndex].color = ""

                }
                resetColorSelector()
                setUserData(changedUserData)
                await store.set('user', changedUserData);
                editDilemmaModal.current?.dismiss()
                setDilemmaName("")
            }
        }
    }
    const deleteDilemma = async (ID: number) => {
        const clickedDilemmaIndex: number = userData?.dilemmata?.findIndex(d => d.id === ID) as number
        userData?.dilemmata?.splice(clickedDilemmaIndex, 1)
        await store.set('user', userData);
        setUserData(userData);
        resetColorSelector()
        editDilemmaModal.current?.dismiss()
    }

    const resetColorSelector = () => {
        setSelectedColor("");
        let colorsCopy
        if (colors) {
            colorsCopy = [...colors]
        }
        if (colorsCopy) {
            colorsCopy.forEach((color) => {
                color.border = ""
            })
            setColors(colorsCopy)
        }

    }

    const selectColor = async (id: number) => {
        const selectedColorIndex = colors?.findIndex(d => d.id === id);
        let colorsCopy
        if (colors) {
            colorsCopy = [...colors]
        }
        if (colorsCopy) {
            if (selectedColor === colorsCopy[selectedColorIndex].colorcode) {
                colorsCopy[selectedColorIndex].border = ""
                setColors(colorsCopy)
                resetColorSelector()
            } else {
                resetColorSelector()
                if (colorsCopy) {
                    colorsCopy[selectedColorIndex].border = "1px solid grey"
                    setColors(colorsCopy)
                    setSelectedColor(colorsCopy[selectedColorIndex].colorcode)
                }
            }
        }
    }
    const closeAddDilemmaModal = () => {
        addDilemmaModal.current?.dismiss()
        resetColorSelector()
    }
    const closeEditDilemmaModal = () => {
        editDilemmaModal.current?.dismiss()
        resetColorSelector()
    }


    return (

        <IonPage>

            <IonToolbar style={{marginTop: "calc(var(--status-bar-height) + 15px)"}}>

                <IonTitle style={{marginTop: "15px"}} className={"title-Tab1"}>Dilemmas</IonTitle>
                <div className="vertical-line"></div>
            </IonToolbar>
            <IonContent >
                <div style={{paddingLeft:"10px", paddingRight:"10px"}}>
                {userData?.dilemmata.map(dilemma => (
                    <IonItem key={dilemma.id} lines="none" className="dilemma-item"
                             style={{"--background": dilemma.color}}>
                        <div className={"dilemma-container"}>

                            <div className="icon-container">
                                <IonLabel onClick={() => {
                                    {
                                        openDilemma(dilemma.id)
                                    }
                                    console.log(dilemma.id)
                                }}>
                                    {dilemma.name}
                                </IonLabel>
                            </div>

                            <IonIcon onClick={() => openEditDilemma(dilemma.id)} className="edit-icon"
                                     icon={create}></IonIcon></div>
                    </IonItem>
                ))}
                </div>
                <IonModal ref={modal2} className="modal-sizer">
                    <DilemmaDetails
                        pro={dilemma.pro}
                        id={dilemma.id}
                        name={dilemma.name}
                        contra={dilemma.contra}
                        color={dilemma.color}
                        lastEdit={dilemma.lastEdit}
                        progressbarBlur={dilemma.progressbarBlur}
                        onClose={() => modal2.current?.dismiss()}
                    />
                </IonModal>
                <IonModal ref={editDilemmaModal} className="modal-sizer">
                    <EditDilemmaModal dilemma={dilemma} editDilemma={editDilemma}
                                      closeEditDilemmaModal={() => closeEditDilemmaModal()}
                                      selectColor={selectColor} colors={colors} clickedDilemmaName={clickedDilemmaName}
                                      deleteDilemma={deleteDilemma}
                                      setClickedDilemmaName={setClickedDilemmaName}
                                      resetColorSelector={resetColorSelector}></EditDilemmaModal>
                </IonModal>
                <IonModal ref={addDilemmaModal} className="modal-sizer">
                    <NewDilemmaModal newDilemma={newDilemma} colors={colors} selectColor={selectColor}
                                     closeAddDilemmaModal={() => closeAddDilemmaModal()}
                                     setDilemmaName={setDilemmaName}/>
                </IonModal>
            </IonContent>
            <IonFooter style={{backgroundColor: 'white', width: '100vw', height: '90px'}}>
                <div className="open-modal-button">
                    <IonFabButton className={"AddButton"} onClick={() => addDilemmaModal.current?.present()}>
                        <IonIcon icon={add}>
                        </IonIcon>
                    </IonFabButton>
                </div>
            </IonFooter>
        </IonPage>
    );
};

export default DilemmaOverview;
