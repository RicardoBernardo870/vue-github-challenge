import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import AuthTemplatePage from './templates/AuthTemplatePage.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCnDj3sEJq7UN1PdKQ38jfYI3orB9Ewww",
  authDomain: "vue-challenge-5f9dd.firebaseapp.com",
  projectId: "vue-challenge-5f9dd",
  storageBucket: "vue-challenge-5f9dd.appspot.com",
  messagingSenderId: "956531831653",
  appId: "1:956531831653:web:de06ad81a33ff652b1678c"
};

initializeApp(firebaseConfig);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)
const pinia = createPinia();

app.use(vuetify)
app.use(pinia)
app.use(router)

app.component('AuthTemplatePage', AuthTemplatePage)

app.mount('#app')
