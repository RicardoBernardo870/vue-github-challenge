import { defineStore } from 'pinia'
import { getFirestore, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import useAuthStore from './authentication'

const authStore = useAuthStore()

const useFireBaseStore = defineStore({
  id: 'firestore',

  state: () => ({
    repos: [],
    bookmarks: [],
    uid: null,
    username: null
  }),

  actions: {
    async addStorageItems(language, sort = 'stars') {
      try {
        const db = getFirestore()
        const userCollection = collection(db, 'users')
        const userDocRef = doc(userCollection, authStore.user.uid)
        const userDoc = await getDoc(userDocRef)

        const existingData = userDoc.exists() ? userDoc.data().data : []

        const existingItem = existingData.find((item) => item.language === language)

        if (!existingItem) {
          existingData.push({
            language: language,
            sort: sort
          })
        } else {
          existingItem.sort = sort
        }
        await updateDoc(userDocRef, {
          data: existingData
        })
      } catch (error) {
        console.error('Error updating document:', error)
      }
    },

    async removeStorageItems(language) {
      try {
        const db = getFirestore()
        const userCollection = collection(db, 'users')
        const userDocRef = doc(userCollection, authStore.user.uid)
        const userDoc = await getDoc(userDocRef)

        const existingData = userDoc.exists() ? userDoc.data().data : []

        const existingItem = existingData.find((item) => item.language === language)

        if (existingItem) {
          existingData.splice(existingData.indexOf(existingItem), 1)
        }

        await updateDoc(userDocRef, {
          data: existingData
        })
      } catch (error) {
        console.error('Error updating document:', error)
      }
    },

    async addBookMarks(item) {
      try {
        const db = getFirestore()
        const userCollection = collection(db, 'users')
        const userDocRef = doc(userCollection, authStore.user.uid)
        const userDoc = await getDoc(userDocRef)

        const existingData = userDoc.exists() ? userDoc.data().bookmarks : []

        const existingItem = existingData.find((bookmark) => bookmark.id === item.id)

        if (!existingItem) {
          existingData.push(item)
        }

        await updateDoc(userDocRef, {
          bookmarks: existingData
        })
      } catch (error) {
        console.error('Error updating document:', error)
      }
    },

    async changeUsername(username) {
      try {
        const db = getFirestore()
        const userCollection = collection(db, 'users')
        const userDocRef = doc(userCollection, authStore.user.uid)

        await updateDoc(userDocRef, {
          username: username
        })
        this.fetchItems()
        localStorage.setItem('username', username)
      } catch (error) {
        console.error('Error updating document:', error)
      }
    },

    async removeBookMarks(item) {
      try {
        const db = getFirestore()
        const userCollection = collection(db, 'users')
        const userDocRef = doc(userCollection, authStore.user.uid)
        const userDoc = await getDoc(userDocRef)

        const existingData = userDoc.exists() ? userDoc.data().bookmarks : []

        const existingItem = existingData.find((bookmark) => bookmark.id === item.id)

        if (existingItem) {
          existingData.splice(existingData.indexOf(existingItem), 1)
        }

        await updateDoc(userDocRef, {
          bookmarks: existingData
        })
      } catch (error) {
        console.error('Error updating document:', error)
      }
    },

    async fetchItems() {
      const db = getFirestore()
      const userCollection = collection(db, 'users')

      try {
        const userDocRef = doc(userCollection, authStore.user.uid)
        const querySnapshot = await getDoc(userDocRef)

        const data = querySnapshot.data()

        this.bookmarks = data.bookmarks || []
        this.uid = data.uid
        this.repos = data.data || []
        this.username = data.username
      } catch (error) {
        console.error('Error fetching documents:', error)
      }
    }
  }
})

export default useFireBaseStore
