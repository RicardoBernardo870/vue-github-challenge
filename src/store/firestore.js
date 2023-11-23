import { defineStore } from 'pinia';
import { getFirestore, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import useAuthStore from './authentication';


const useFireBaseStore = defineStore({
  id: 'firestore',

  state: () => ({
    repos: [],
    bookmarks: [],
    uid: null,
    username: null
  }),

  actions: {
    async getDocRef() {
      const db = getFirestore();
      const authStore = useAuthStore();
      const userCollection = collection(db, 'users');
      return doc(userCollection, authStore.user.uid);
    },

    async addStorageItems(language, sort = 'stars') {
      try {
        const docRef = await this.getDocRef();
        const userDoc = await getDoc(docRef);

        const existingData = userDoc.exists() ? userDoc.data().data : [];
        const existingItem = existingData.find((item) => item.language === language);

        if (!existingItem) {
          existingData.push({ language, sort });
        } else {
          existingItem.sort = sort;
        }

        await updateDoc(docRef, { data: existingData });
        this.fetchItems();
      } catch (error) {
        console.error('Error adding storage items:', error);
      }
    },

    async removeStorageItems(language) {
      try {
        const docRef = await this.getDocRef();
        const userDoc = await getDoc(docRef);

        const existingData = userDoc.exists() ? userDoc.data().data : [];
        const existingItem = existingData.find((item) => item.language === language);

        if (existingItem) {
          existingData.splice(existingData.indexOf(existingItem), 1);
        }

        await updateDoc(docRef, { data: existingData });
        this.fetchItems();
      } catch (error) {
        console.error('Error removing storage items:', error);
      }
    },

    async addBookMarks(item) {
      try {
        const docRef = await this.getDocRef();
        const userDoc = await getDoc(docRef);

        const existingData = userDoc.exists() ? userDoc.data().bookmarks : [];
        const existingItem = existingData.find((bookmark) => bookmark.id === item.id);

        if (!existingItem) {
          existingData.push(item);
        }

        await updateDoc(docRef, { bookmarks: existingData });
      } catch (error) {
        console.error('Error adding bookmarks:', error);
      }
    },

    async changeUsername(username) {
      try {
        const docRef = await this.getDocRef();
        await updateDoc(docRef, { username });
        this.fetchItems();
        localStorage.setItem('username', username);
      } catch (error) {
        console.error('Error changing username:', error);
      }
    },

    async removeBookMarks(item) {
      try {
        const docRef = await this.getDocRef();
        const userDoc = await getDoc(docRef);

        const existingData = userDoc.exists() ? userDoc.data().bookmarks : [];
        const existingItem = existingData.find((bookmark) => bookmark.id === item.id);

        if (existingItem) {
          existingData.splice(existingData.indexOf(existingItem), 1);
        }

        await updateDoc(docRef, { bookmarks: existingData });
      } catch (error) {
        console.error('Error removing bookmarks:', error);
      }
    },

    async fetchItems() {
      try {
        const docRef = await this.getDocRef();
        const querySnapshot = await getDoc(docRef);
        const data = querySnapshot.data();

        this.bookmarks = data.bookmarks || [];
        this.uid = data.uid;
        this.repos = data.data || [];
        this.username = data.username;
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },

    clearState() {
      this.bookmarks = [];
      this.repos = [];
      this.uid = null;
      this.username = null;
    },
  }
})

export default useFireBaseStore;