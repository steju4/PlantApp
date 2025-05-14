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
    progressbarBlur: boolean
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

export interface PlantDetails {
    id: number;
    common_name: string;
    scientific_name: string;
    origin: string[],
    watering: string;
    sunlight: string[];
    pruning_month: string[];
    growth_rate: string;
    description: string
    default_image : {original_url: string};

}