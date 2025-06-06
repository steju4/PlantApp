// scripts/plantSpeciesDetails.ts
import { PlantDetails } from '../constants/interfaces';

const API_KEY = 'sk-vXLh681cb4a7a39fe10310'; // besser später in .env auslagern

export const fetchPlantDetailsById = async (id: number): Promise<PlantDetails | null> => {
    try {
        const response = await fetch(`https://perenual.com/api/v2/species/details/${id}?key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API-Fehler: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📥 Detaildaten geladen:', data);
        return data;
    } catch (error) {
        console.error("Fehler beim Laden der Pflanzendetails:", error);
        return null;
    }
};
