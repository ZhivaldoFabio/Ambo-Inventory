<!-- DetailDataOpname.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

// State variable to store the fetched data for stock opname
const opnameDetails = ref([]);

// Access the route to get the ID
const route = useRoute();
const id = route.params.id; // Extract the 'id' from route params

// Function to fetch data for a specific stock opname by ID
const fetchOpnameDetails = async () => {
  try {
    const response = await axios.get(`/api/opname/${id}`);
    opnameDetails.value = response.data;
  } catch (error) {
    console.error('Error fetching opname details:', error);
  }
};

// Format date to DD/MM/YYYY
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB');
};

// Fetch data on component mount
onMounted(() => {
  fetchOpnameDetails();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Stock Opname Details Table -->
    <div class="flex justify-between">
      <h2 class="text-2xl font-heading mb-4">Stock Opname Details</h2>
      <RouterLink
        :to="{ name: 'data-opname' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        <i class="pi pi-angle-left text-white-50"></i>
      </RouterLink>
    </div>
    <div>
      <table
        class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden"
      >
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="px-4 py-2 border-b">No</th>
            <th class="px-4 py-2 border-b">Product Name</th>
            <th class="px-4 py-2 border-b">Stock by System</th>
            <th class="px-4 py-2 border-b">Physical Stock</th>
            <th class="px-4 py-2 border-b">Discrepancy</th>
            <th class="px-4 py-2 border-b">Loss</th>
            <th class="px-4 py-2 border-b">Lost</th>
            <th class="px-4 py-2 border-b">Info</th>
            <th class="px-4 py-2 border-b">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in opnameDetails"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
            <td class="px-4 py-2 border-b">{{ item.nama_produk }}</td>
            <td class="px-4 py-2 border-b">{{ item.stock_system }}</td>
            <td class="px-4 py-2 border-b">{{ item.physical_stock }}</td>
            <td class="px-4 py-2 border-b">
              {{ item.physical_stock - item.stock_system }}
            </td>
            <td class="px-4 py-2 border-b">
              <i
                v-if="item.loss === true || item.loss === 'true'"
                class="pi pi-exclamation-circle text-xl text-red-500"
              ></i>
            </td>
            <td class="px-4 py-2 border-b">
              <i
                v-if="item.lost === true || item.lost === 'true'"
                class="pi pi-exclamation-circle text-xl text-red-500"
              ></i>
            </td>
            <td :class="{ 'text-gray-500 px-4 py-2 border-b': !item.remarks }">
              {{ item.remarks || 'NULL' }}
            </td>
            <td class="px-4 py-2 border-b">
              {{ formatDate(item.timestamp_created) }}
            </td>
          </tr>
          <tr v-if="opnameDetails.length === 0">
            <td colspan="7" class="text-center py-4">No data available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
