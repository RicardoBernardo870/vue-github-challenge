import { defineStore } from 'pinia'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  
} from 'firebase/auth'
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore'


const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async signOut() {
      try {
        const auth = getAuth()

        await signOut(auth)
        this.user = null
        localStorage.removeItem('username')
        localStorage.removeItem('user')

      } catch (error) {
        console.error('Error signing out:', error.code, error.message)
        throw error
      }
    },

    async createUserWithEmail(email, password, username) {
      try {
        const auth = getAuth()
        const db = getFirestore()
        const userCollection = collection(db, 'users')

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        const userDocRef = doc(userCollection, userCredential.user.uid)

        await setDoc(userDocRef, {
          username: username,
          uid: userCredential.user.uid,
          data: [],
          bookmarks: [],
        })
        this.user = userCredential.user
        localStorage.setItem('username', username)
      } catch (error) {
        console.error('Error creating user:', error.code, error.message)
        throw error
      }
    },

    async signInWithEmail(email, password) {
      try {
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
      } catch (error) {
        console.error('Error signing in:', error.code, error.message)
        throw error
      }
    },

    async initAuth() {
      return new Promise((resolve) => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user
          }
          resolve()
          unsubscribe()
        })
      })
    }
  }
})

export default useAuthStore
