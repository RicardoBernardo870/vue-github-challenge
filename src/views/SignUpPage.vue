<script setup>
import { ref, onMounted } from 'vue'
import useAuthStore from '../store/authentication'
import { useRouter } from 'vue-router'

const userEmail = ref('')
const userName = ref('')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const errors = ref('')

const formRef = ref(null)

const userEmailRules = [
  (v) => !!v || 'Required.',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
]
const passwordRules = [(v) => !!v || 'Required.', (v) => (v && v.length >= 6) || 'Min 6 characters']
const usernameRules = [(v) => !!v || 'Required.', (v) => (v && v.length >= 3) || 'Min 6 characters']

const signUp = async () => {
  try {
    const isValid = await formRef.value.validate()

    if (!isValid.valid) {
      return
    }
    loading.value = true

    await authStore.createUserWithEmail(userEmail.value, password.value, userName.value)
    router.push('/discovery')

  } catch (error) {
    errors.value = error.message

  } finally {
    loading.value = false
    setTimeout(() => {
      errors.value = ''
    }, 3000)
  }
}

onMounted(async () => {
  await authStore.initAuth()
})
</script>

<template>
  <AuthTemplatePage>
    <v-alert v-if="errors" :text="errors" type="error" closable class="error"></v-alert>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="signUp" class="mt-2 form-size">
      <v-text-field v-model="userName" :rules="usernameRules" label="Username" />
      <v-text-field v-model="userEmail" :rules="userEmailRules" label="Email" type="email" />

      <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password" />

      <v-btn :loading="loading" type="submit" block class="mt-2" text="Sign Up" color="black" />
    </v-form>

    <v-btn to="/" color="white" class="mt-2" text="Go Back" />
  </AuthTemplatePage>
</template>

<style scoped>
.form-size {
  width: 350px;
}
.v-btn {
  width: 350px;
}
.error {
  position: absolute;
  top: 100px;
}
</style>
