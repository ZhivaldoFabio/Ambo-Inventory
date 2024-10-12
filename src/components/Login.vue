<template>
  <div
    class="full-page flex items-center justify-center min-h-screen bg-background-50"
  >
    <div
      class="login-card w-full max-w-md p-8 space-y-6 bg-green-100 rounded-lg shadow-lg"
    >
      <h2 class="text-2xl font-bold text-center text-text-1000">Login</h2>
      <form @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
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
              class="block text-sm font-medium text-gray-700"
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
        <div class="flex items-center justify-between mt-6">
          <button
            @click="login"
            type="submit"
            class="button-color w-full px-4 py-2 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Define the user's credentials (in a real app, credentials would be validated through a backend)
const validEmail = 'email@email.com';
const validPassword = 'password';

// Define reactive properties for email and password
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

// Method for handling login
const login = () => {
  console.log(`Email: ${email.value}, Password: ${password.value}`);
  if (email.value === validEmail && password.value === validPassword) {
    // Successful login, set authentication in localStorage
    localStorage.setItem('auth', 'true');
    errorMessage.value = '';

    // Redirect to the home page
    router.push({ name: 'home' });
  } else {
    // If credentials are incorrect, display an error message
    errorMessage.value = 'Invalid email or password. Please try again.';
  }
};
</script>

<style scoped>
/* Additional styles if needed */
.full-page {
  background-color: #ebf4ef;
}

.login-card {
  background-color: #50be7c33;
}
.button-color {
  background-color: #50be7c;
}
.error {
  color: red;
}
</style>
