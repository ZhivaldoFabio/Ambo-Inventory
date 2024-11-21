<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const currentUser = ref(null); // Track the current logged-in User.
const userRole = ref(null); // Track the user's role
const isLoading = ref(true); // Track loading state

// Function to fetch user data
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    // Only fetch role if it is not set in localStorage
    if (!localStorage.getItem('userRole')) {
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.role) {
        userRole.value = response.data.role;
        localStorage.setItem('userRole', response.data.role); // Store role in localStorage
      } else {
        console.error('Role is missing in the response');
        localStorage.removeItem('userRole'); // Remove role if response is invalid
      }
    } else {
      // If the role is already in localStorage, use it
      userRole.value = localStorage.getItem('userRole');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    currentUser.value = null;
    userRole.value = null;
    localStorage.removeItem('userRole'); // Ensure role is removed if there's an error
  } finally {
    // Mark loading as finished after the role is fetched or error is handled
    isLoading.value = false;
  }
};

// Fetch user data only after user logs in (not immediately on page load)
onMounted(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    fetchUserData(); // Proceed to fetch user data only if token exists
  } else {
    isLoading.value = false; // No need to load anything if no token
  }
});
</script>

<template>
  <nav
    :class="['flex', 'min-h-full', 'transition-all', 'duration-300', 'h-full', 'font-body']"
    class="m-2 min-w-fit"
  >
    <div>
      <!-- Wait until userRole is fetched before rendering the sidebar -->
      <div v-if="isLoading">Loading...</div>

      <!-- Admin Role Sidebar -->
      <ul v-if="!isLoading && userRole === 'Admin'" class="p-4 rounded-md">
        <li class="text-primary-300 flex items-center space-x-2">
          <i class="pi pi-user"></i>
          <span class="text-background-300"> Admin </span>
        </li>

        <li
          class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md"
        >
          <RouterLink to="/home" class="flex items-center space-x-2 ">
            <span class="">Dashboard</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink
            to="/laporanpembelian"
            class="flex items-center space-x-2"
          >
            <span>Purchase Report</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink
            to="/laporanpenjualan"
            class="flex items-center space-x-2"
          >
            <span>Sales Report</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Gudang Role Sidebar -->
      <ul v-if="!isLoading && userRole === 'Gudang'" class="p-4 rounded-md">
        <li class="text-primary-300 flex items-center space-x-2 mt-5">
          <i class="pi pi-warehouse"></i>
          <span class="text-background-300"> Warehouse </span>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/supplier" class="flex items-center space-x-2">
            <span>Supplier</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/stock" class="flex items-center space-x-2">
            <span>Stock</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/produk" class="flex items-center space-x-2">
            <span>Product</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/unit" class="flex items-center space-x-2">
            <span>Unit</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/kategori" class="flex items-center space-x-2">
            <span>Category</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/pembelian" class="flex items-center space-x-2">
            <span>Purchase</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Kasir Role Sidebar -->
      <ul v-if="!isLoading && userRole === 'Kasir'" class="p-4 rounded-md">
        <li class="text-primary-300 flex items-center space-x-2 mt-5">
          <i class="pi pi-warehouse"></i>
          <span class="text-background-300"> Kasir </span>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Sales</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5 hover:translate-x-5 duration-300 active:drop-shadow-md">
          <RouterLink
            :to="{ name: 'data-penjualan' }"
            class="flex items-center space-x-2"
          >
            <span>Sales History</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
