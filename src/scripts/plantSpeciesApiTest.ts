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
        const results = []
        let plant
        for (const item in data.data) {
            plant = data.data[item]
            results.push(plant)
        }
        console.log(results);
        return results
    } catch (error) {
        console.error("API-Ping fehlgeschlagen:", error);
    }
};







