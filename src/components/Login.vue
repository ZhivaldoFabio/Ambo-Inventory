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
            >
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 px-2 text-sm text-gray-500"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
        </div>
        <div class="items-center justify-between mt-6">
          <button
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
import axios from 'axios';

// Define the router
const router = useRouter();

// Define reactive properties for email, password, and error message
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Login method for sending credentials to the backend
const login = async () => {
  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    });

    console.log('Login response:', response.data); // Add this log to inspect the response

    const { token, role } = response.data;

    console.log('Token:', token);  // Check if the token is correctly received
    console.log('Role:', role);    // Check if the role is correctly received

    if (token && role) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role); // Store the user role
      console.log('Token saved:', localStorage.getItem('authToken'));
      console.log('Role saved:', localStorage.getItem('userRole')); // Log role

      router.push({ name: 'home' });
    } else {
      throw new Error('Invalid token received');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    errorMessage.value = 'Failed to login. Please check your credentials.';
  }
};

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
