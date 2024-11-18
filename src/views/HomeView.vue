<!-- HomeView.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import HomeCards from '@/components/HomeCards.vue';
import DashboardGudang from '@/components/DashboardGudang.vue';
import Penjualan from '@/components/Penjualan.vue';

const router = useRouter();
const loading = ref(true); // Track loading state

const isAdmin = ref(false); // Track if user is Admin
const isGudang = ref(false); // Track if user is Gudang
const isKasir = ref(false); // Track if user is Kasir
const user = ref(null); // Store user data

onMounted(async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found. Redirecting to login.');
      router.push('/'); // Redirect to login if no token
      return;
    }

    const response = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    user.value = response.data;

    // Set role-based flags
    isAdmin.value = user.value.role === 'Admin';
    isGudang.value = user.value.role === 'Gudang';
    isKasir.value = user.value.role === 'Kasir';
  } catch (error) {
    console.error('Error fetching user data:', error);
    router.push('/'); // Redirect to login page on error
  } finally {
    loading.value = false; // Stop loading once user data is fetched
  }
});
</script>

<template>
  <div class="flex-1 p-4">
    <!-- Display loading message until data is fetched -->
    <div v-if="loading">Loading...</div>

    <!-- Conditionally render components based on user role -->
    <div v-if="!loading">
      <HomeCards v-if="isAdmin" />
      <DashboardGudang v-if="isGudang" />
      <Penjualan v-if="isKasir" />
    </div>
  </div>
</template>
