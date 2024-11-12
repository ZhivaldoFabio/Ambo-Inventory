<template>
  <div
    class="full-page flex items-center justify-center min-h-screen min-w-full bg-background-50"
  >
    <div
      class="login-card w-full max-w-md p-8 space-y-6 bg-black-500 rounded-lg shadow-lg"
    >
      <h2 class="text-heading text-2xl text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-text-700"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-text-700"
              >Password</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div class="items-center justify-between mt-6">
          <button
            @click="login"
            type="submit"
            class="button-color w-full px-4 py-2 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          <p v-if="errorMessage" class="error opacity-90">{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

//Defining the Router
const router = useRouter();

// Define reactive properties for email, password, and error message
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Method for handling login with Firebase Authentication
const login = async () => {
  try {
    // Attempt to sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log('Logged in user:', userCredential.user);

    // Set authentication state in localStorage (or manage it in a better way like Vuex/pinia)
    localStorage.setItem('auth', 'true');

    // Clear any error message
    errorMessage.value = '';

    // Redirect to the home page after successful login
    router.push({ name: 'home' });
  } catch (error) {
    // Handle errors and show an error message
    console.error('Login error:', error);
    errorMessage.value = 'Invalid email or password. Please try again.';
  }
};

// // Define the user's credentials (in a real app, credentials would be validated through a backend)
// const validEmail = 'email@email.com';
// const validPassword = 'password';

// // Method for handling login (Local)
//const login = () => {
//   console.log(`Email: ${email.value}, Password: ${password.value}`);
//   if (email.value === validEmail && password.value === validPassword) {
//     // Successful login, set authentication in localStorage
//     localStorage.setItem('auth', 'true');
//     errorMessage.value = '';

//     // Redirect to the home page
//     router.push({ name: 'home' });
//   } else {
//     // If credentials are incorrect, display an error message
//     errorMessage.value = 'Invalid email or password. Please try again.';
//   }
// };
//
</script>

<style scoped>
/* Additional styles if needed */
.full-page {
  background-color: #ebf4ef;
}

.login-card {
  background-color: hsla(144, 46%, 53%, 0.2);
}
.button-color {
  background-color: hsl(144, 46%, 53%);
}
.error {
  color: red;
}
</style>
