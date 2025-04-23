import { Storage } from '@ionic/storage';
import { UserData, Dilemma } from '../pages/Tab2';

const store = new Storage();
await store.create();

const initializeStore = async () => {
    const storedUser = await store.get('user') as UserData | null;

    // Prüfe, ob gespeicherte Daten existieren und setze sie nur zurück, wenn sie leer sind
    if (!storedUser || !storedUser.dilemmata || storedUser.dilemmata.length === 0) {
        const defaultDilemma: Dilemma = {
            id: Date.now(),
            name: 'Neues Dilemma',
            pro: [],
            contra: [],
            lastEdit: new Date().toLocaleDateString(),
        };
        const initialUser: UserData = {
            id: 0,
            dilemmata: [defaultDilemma],
        };
        await store.set('user', initialUser);
    }
};

await initializeStore();

export default store;
