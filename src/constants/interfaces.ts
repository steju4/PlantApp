// Daten des eingeloggten Benutzers und seine Garden Spots
export interface UserData {
    id: number;                 // Interne DB-ID
    garden_spots: Spot[];       // Liste der Garden Spots des Nutzers
    email_adress: string;       // Login-E-Mail
    first_name: string;         // Vorname
    last_name: string;          // Nachname
    postal_code: string;        // PLZ
    city: string;               // Stadt
    password: string;           // (nicht unbedingt im Frontend erforderlich)
}

// Details einer Pflanze aus der externen API
export interface PlantDetails {
    id: number;                 // Externe Pflanzen-ID
    common_name: string;        // Geläufiger Name
    scientific_name: string[];  // Wissenschaftlicher Name(n)
    origin: string[];           // Herkunftsländer
    watering: string;           // Bewässerungshinweis
    sunlight: string[];         // Lichtbedarf
    pruning_month: string[];    // Monate für Rückschnitt
    growth_rate: string;        // Wachstumsgeschwindigkeit
    description: string;        // Beschreibungstext
    default_image: {             // Bild-URLs
        thumbnail: string;      
    };
    quantity?: number;          // (optional) Menge im Spot
    care_level?: string;        // (optional) Pflegeaufwand
    cycle?: string;             // (optional) Lebenszyklus
    drought_tolerant?: boolean; // (optional) Trockenheitstoleranz
    indoor?: boolean;           // (optional) Innenbereich geeignet
    medicinal?: boolean;        // (optional) Medizinische Nutzung
}

// Struktur einer Pflanze, wie sie in der DB und im Frontend gespeichert wird
export interface StoredGardenPlant {
    id: number;                 // DB-ID
    externalPlantId: number;    // API-ID
    commonName: string;         // Pflanzenname
    thumbnail: string | null;   // Bild-URL oder null
    amount: number;             // Anzahl im Spot
    gardenSpotId?: number;      // (optional) zugehöriger Spot
    sunlight: string | null;    // Lichtbedarf
    watering: string | null;    // Bewässerung
    careLevel: string | null;   // Pflegeaufwand
    pruningMonth: string | null;// Rückschnittmonat
    cycle: string | null;       // Lebenszyklus
    growthRate: string | null;  // Wachstumsgeschwindigkeit
    droughtTolerant: boolean;   // Trockenheitstolerant?
    indoor: boolean;            // Innenbereich geeignet?
    medicinal: boolean;         // Medizinische Pflanze?
    description: string | null; // Beschreibung
    origin: string | null;      // Herkunft
}

// Definition eines Garden Spots im Frontend
export interface Spot {
    id: number;                 // Spot-ID
    name: string;               // Bezeichnung
    postalCode: string;         // PLZ
    street: string;             // Straße
    streetNumber: string;       // Hausnummer
    city: string;               // Stadt
    plants: StoredGardenPlant[];// Pflanzen im Spot
    logo: string;               // Pfad oder URL zum Logo/Bild
}

// Vereinfachtes Pflanzen-Modell für Auswahllisten 
export interface Plant {
    id: number;                 // Pflanzen-ID
    name: string;               // Name
    value: number;              // Wert oder Menge
    thumbnail: string;          // Vorschaubild
}