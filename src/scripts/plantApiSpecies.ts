export const pingSpeciesAPI = async (name: string) =>{
    const url = `https://perenual.com/api/v2/species-list?key=sk-vXLh681cb4a7a39fe10310&q=${name}
`
    try {
        const response = await fetch(url, {
            method: 'GET', // oder 'POST', 'PUT', etc.
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Pingen der API: ${response.statusText}`);
        }

        const data = await response.json(); // falls die API JSON zurückgibt

        console.log(data);

        return data.data[0].id
    } catch (error) {
        console.error("API-Ping fehlgeschlagen:", error);
    }
};







// Beispielaufruf
/*
pingAPI("https://perenual.com/api/v2/species/details/1?key=sk-vXLh681cb4a7a39fe10310");
*/


/*
https://perenual.com/api/v2/species-list?key=sk-vXLh681cb4a7a39fe10310&q=monstera
*/
