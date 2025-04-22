import { Storage } from '@ionic/storage';

const store = new Storage();
 store.create();
 store.set('user', {
 id: 0,
 name: "",
 pro: [],
 contra: [],
});
export default store;
