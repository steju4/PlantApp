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
    garden_spots: Spot[];
    email_adress: string, 
    first_name: string,
    last_name: string,
    postal_code: string,
    city: string,
    password: string
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
    default_image : {thumbnail: string};

}
export interface Spot{
    id: number;
    name: string, 
    postal_code: string,
    street: string, 
    street_number: number, 
    city: string, 
    plants: Plant[]
    logo: string
}

export interface Plant {
    id: number,
    name: string, 
    value: number,
    thumbnail: string
}