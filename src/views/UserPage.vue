<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
import { ref } from 'vue'
import useFireBaseStore from '../store/firestore'

const userName = ref('')
const userEmail = ref('')
const loading = ref(false)
const firebaseStore = useFireBaseStore()
const errors = ref('')
const successMessage = ref('')

const formRef = ref(null)

const save = async () => {
  try {
    const isValid = await formRef.value.validate()

    if (!isValid.valid) {
      return
    }

    loading.value = true
    await firebaseStore.changeUsername(userName.value)

    successMessage.value = 'Username changed successfully'

    loading.value = false
  } catch (error) {
    errors.value = error.message
  } finally {
    setTimeout(() => {
      errors.value = ''
      successMessage.value = ''
    }, 3000)
  }
}

const usernameRules = [
  (v) => !!v || 'Username is required',
  (v) => (v && v.length >= 3) || 'Username must be less than 20 characters'
]

const userEmailRules = [(v) => !v || /.+@.+/.test(v) || 'E-mail must be valid']
</script>

<template>
  <HeaderComponent></HeaderComponent>
  <div class="form-container">
    <h3 class="mb-5">My Account</h3>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="save" class="mt-2 form">
      <v-text-field
        v-model="userName"
        :rules="usernameRules"
        label="Username*"
        :error-messages="errors"
        type="text"
      />

      <v-text-field v-model="userEmail" :rules="userEmailRules" label="Email" type="email" />

      <v-btn :loading="loading" type="submit" class="mt-2" text="Save" color="black" />
    </v-form>
    <v-alert
      v-if="successMessage"
      :text="successMessage"
      type="success"
      closable
      class="success"
    ></v-alert>
  </div>
</template>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 1.25rem;
}
.form {
  width: 21.875rem;
}
.success {
  position: absolute;
  top: 25rem;
}
</style>
