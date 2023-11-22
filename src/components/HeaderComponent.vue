<script setup>
import useAuthStore from '../store/authentication'
import useFireBaseStore from '../store/firestore'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const firebaseStore = useFireBaseStore()
const router = useRouter()

const loading = ref(false);

const currentRouteName = computed(() => router.currentRoute.value.name)

const username = computed(() => firebaseStore.username ? firebaseStore.username : localStorage.getItem('username') )

const signOut = async () => {
  try {
    await authStore.signOut()
    await firebaseStore.clearStateWhenSignOut()
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <div class="header">
    <div class="header-left">
      <a href="#default" class="logo">Logo</a>
    <v-btn to="/discovery" :active="currentRouteName === 'discovery-page'"  color="white" >Discovery</v-btn>
    </div>

    <div class="header-right">
      <v-btn to="/user" :active="currentRouteName === 'user-page'" color="white" >{{ username }}</v-btn>
      <v-btn color="white"  @click="signOut" :loading="loading">Logout</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  overflow: hidden;
  background-color: lightgray;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.header a {
  color: black;
  text-align: center;
  text-decoration: none;
  font-size: 14px; 

}

.header a.logo {
  font-size: 25px;
  font-weight: bold;
}

.header-right {
  float: right;
}
</style>