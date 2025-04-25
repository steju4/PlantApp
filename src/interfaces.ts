export interface ArgumentItem {
    description: string;
    importance: number;
    ID: number;
}

export interface Dilemma {

    id: number;
    name: string;
    pro: ArgumentItem[];
    contra: ArgumentItem[];
    lastEdit: string;
    color: string;
}

export interface UserData {
    id: number;
    dilemmata: Dilemma[];
}

export interface ColorPicker {
    colorName: string;
    colorcode: string;
    border: string;
    id: number;
}