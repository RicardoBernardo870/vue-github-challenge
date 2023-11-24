<script setup>
import { ref } from "vue";
import useAuthStore from '../store/authentication';
import { useRouter } from 'vue-router';

const userEmail = ref("");
const password = ref("");
const formRef = ref(null);
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const errors = ref('');

const userEmailRules = [
  (v) => !!v || "Required.",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
const passwordRules = [
  (v) => !!v || "Required.",
  (v) => (v && v.length >= 6) || "Min 6 characters",
];


const onSubmit = async () => {
    loading.value = true;
  try {
      const isValid = await formRef.value.validate()

      if (!isValid.valid) {
        return
    }
      
      await authStore.signInWithEmail(userEmail.value, password.value);  
    } catch (error) {
      errors.value = error.message;

      setTimeout(() => {
          errors.value = '';
      }, 3000); 
        
    } finally {
      loading.value = false;
      router.push('/discovery');

  }

  
};

</script>

<template>
  <AuthTemplatePage>
    <v-alert v-if="errors" :text="errors" type="error" closable class="error"></v-alert>
     <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="onSubmit" class="mt-2 form-size"  >
          <v-text-field 
          v-model="userEmail" 
          :rules="userEmailRules" 
          label="Email"
          type="email"
          />

          <v-text-field 
          v-model="password" 
          :rules="passwordRules" 
          label="Password"
          type="password"
          />

          <v-btn 
          :loading="loading" 
          type="submit" 
          block 
          class="mt-2" 
          text="Login"
          color="black" 
          />
      </v-form>

      <div class="form-signup-container">
         <span>Don't have an account?</span>
         
         <RouterLink to="/signup">Click here to sign up</RouterLink>
        </div>
  </AuthTemplatePage>
</template>

<style lang="scss" scoped>
  .form-signup-container {
    display: flex;
    align-items: center;  
    justify-content: space-evenly;
    margin-top: 10px;
    gap: 10px;
  }
  .form-size {
      width: 350px;
    }
  .error {
    position: absolute;
    top: 100px;
  }
</style>
