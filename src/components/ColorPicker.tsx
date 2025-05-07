import React from 'react';

import './css/List.css';
import {ColorPicker} from "../constants/interfaces";

interface ColorPickerProps {
    colors: ColorPicker[];
    selectColor: (id: number) => void;
}

const ColorPickerComponent: React.FC<ColorPickerProps> = ({colors, selectColor }) => {


    return(
        <div style={{
            display: "flex",
            flexWrap: "wrap", // Wrappt die Elemente bei Platzmangel
            gap: "3%", // Fügt Abstand zwischen den Farben hinzu
            justifyContent: "center", // Zentriert die Farben horizontal
            marginTop: "20px"
        }}>
            {colors?.map((color) => (
                <div key={color.id} style={{
                    display: "flex",
                    width: "40px",
                    height: "40px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                }}>
                    <div style={{borderRadius: "10px", border: color.border, padding: "3px"}}
                         onClick={() => {
                             selectColor(color.id)
                         }}>
                        <div style={{
                            backgroundColor: color.colorcode,
                            width: "25px",
                            height: "25px",
                            borderRadius: "10px",
                        }}></div>
                    </div>
                </div>
            ))}
        </div>

    )
}
export default ColorPickerComponent;