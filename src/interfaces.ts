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
}

export interface UserData {
    id: number;
    dilemmata: Dilemma[];
}

