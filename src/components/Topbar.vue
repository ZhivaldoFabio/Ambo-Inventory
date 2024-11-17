<script setup>
import { RouterLink, useRouter } from 'vue-router';
import logo from '@/assets/logo.png';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const username = ref('');
const email = ref('');
const token = localStorage.getItem('authToken'); // Get JWT token from localStorage
const router = useRouter();

// Fetch user data on mount, but avoid redirecting if token is missing initially
onMounted(async () => {
  if (token) {
    try {
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      username.value = response.data.username || 'Unknown User';
      email.value = response.data.email || 'No Email';
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Redirect to login if the token is invalid or expired
        localStorage.removeItem('authToken'); // Clear invalid token
        router.push('/'); // Redirect to login
      }
      username.value = '';
      email.value = '';
    }
  } else {
    username.value = 'Guest';
    email.value = 'Guest@email.com';
  }
});
</script>

<template>
  <nav class="bg-background-50 sticky top-0">
    <div class="mx-auto max-w-screen px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/home">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-primaryBright text-2xl font-bold ml-2">
              Depot Es Ambo
            </span>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <div>
                <RouterLink to="/useredit">
                  <p>{{ username }}</p>
                  <p>{{ email }}</p>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
