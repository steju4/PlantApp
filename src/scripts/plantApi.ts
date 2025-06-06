import {PlantDetails} from "../constants/interfaces";

export const pingAPI = async (id: number): Promise<PlantDetails> => {
    const url = `https://perenual.com/api/v2/species/details/${id}?key=sk-vXLh681cb4a7a39fe10310`
    try {
        const response = await fetch(url, {
            method: 'GET', // oder 'POST', 'PUT', etc.
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Pingen der API: ${response.statusText}`);
        }

        // falls die API JSON zurückgibt
        return await response.json();
    } catch (error) {
        console.error("API-Ping fehlgeschlagen:", error);
    }
};

// Beispielaufruf
/*
pingAPI("https://perenual.com/api/v2/species/details/1?key=sk-vXLh681cb4a7a39fe10310");
*/
/*
pingAPI(await pingSpeciesAPI("tomato"));
*/

/*
https://perenual.com/api/v2/species-list?key=sk-vXLh681cb4a7a39fe10310&q=monstera
*/
