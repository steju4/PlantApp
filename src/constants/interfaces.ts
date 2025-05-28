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
    scientific_name: string[];
    origin: string[],
    watering: string;
    sunlight: string[];
    pruning_month: string[];
    growth_rate: string;
    description: string
    default_image : {thumbnail: string};
    //Frontend-erweitert
    quantity?: number; 
    care_level?: string; 
    cycle?: string;
    drought_tolerant?: boolean;
    indoor?: boolean;
    medicinal?: boolean;
}

export interface StoredGardenPlant {
    id: number; // Die ID in DB
    externalPlantId: number;
    commonName: string;
    thumbnail: string | null;
    amount: number;
    gardenSpotId?: number;
    sunlight: string | null; // war string[]
    watering: string | null;
    careLevel: string | null; // im Backend careLevel, im Frontend PlantDetails care_level
    pruningMonth: string | null; // war string[]
    cycle: string | null;
    growthRate: string | null;
    droughtTolerant: boolean;
    indoor: boolean;
    medicinal: boolean;
    description: string | null;
    origin: string | null; // war string[] 
}

export interface Spot{
    id: number;
    name: string, 
    postalCode: string,
    street: string,
    streetNumber: string,
    city: string,
    plants: StoredGardenPlant[],
    logo: string
}

export interface Plant {
    id: number,
    name: string, 
    value: number,
    thumbnail: string
}