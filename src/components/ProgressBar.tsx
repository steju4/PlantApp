import React from 'react';

interface ProgressBarProps {
    greenPercentage: number; // Anteil des grünen Balkens (0-100)
    redPercentage: number;  // Anteil des roten Balkens (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ greenPercentage, redPercentage }) => {
    const adjustedGreen = Math.min(greenPercentage, 100);
    const adjustedRed = Math.min(redPercentage, 100 - adjustedGreen);


    return (
        <div className="seperator" style={{
            position: 'relative', // Für das Positionieren des mittigen Strichs
            display: 'flex',
            width: '100%',
            height: '10px',
            border: '1px solid white',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: "0 0 0 1px black"
        }}>
            {/* Grüner Bereich */}
            <div className ="greenBar" style={{
                width: `${adjustedGreen}%`,
                backgroundColor: '#4ed175',
                transition: 'width 0.6s ease',
                display: 'flex',
                justifyContent: 'center', // Horizontale Zentrierung
                alignItems: 'center',  // Vertikale Zentrierung
            }}>

            </div>

            {/* Mittiger gestrichelter Strich */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '80%', // Höhe des Strichs als Prozentsatz der ProgressBar
                borderLeft: '1px dashed black',
            }}></div>

            {/* Roter Bereich */}
            <div style={{
                width: `${adjustedRed}%`,
                backgroundColor: '#ef5a5a',
                transition: 'width 0.6s ease',
                display: 'flex', // Flexbox für Zentrierung
                justifyContent: 'center', // Horizontale Zentrierung
                alignItems: 'center',  // Vertikale Zentrierung
            }}>

            </div>
        </div>
    );
};

export default ProgressBar;
