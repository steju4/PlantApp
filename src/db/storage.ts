import { Storage } from '@ionic/storage';
import { UserData, Dilemma } from "../interfaces";

const store = new Storage();
store.create();

const initializeStore = async () => {
    const storedUser = await store.get('user') as UserData | null;

    // Prüfe, ob gespeicherte Daten existieren und setze sie nur zurück, wenn sie leer sind
    if (!storedUser || !storedUser.dilemmata || storedUser.dilemmata.length === 0) {
        const defaultDilemma: Dilemma = {
            id: 1,
            name: 'Mein erstes Dilemma',
            pro: [{description:"Mein erstes Pro Argument", ID:1, importance:5}],
            contra: [{description:"Mein erstes Contra Argument", ID:1, importance:5}],
            lastEdit: new Date().toLocaleDateString(),
        };
        const initialUser: UserData = {
            id: 0,
            dilemmata: [defaultDilemma],
        };
        await store.set('user', initialUser);
    }
};

initializeStore();

export default store;
