<!-- DataOpname.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// State variables to store API data
const opnameData = ref([]); // For Stock Opname table
const lossData = ref([]); // For Stock Loss table

// Function to fetch data for stock opname
const fetchOpnameData = async () => {
  try {
    const response = await axios.get('/api/opname');
    opnameData.value = response.data;
  } catch (error) {
    console.error('Error fetching opname data:', error);
  }
};

// Function to fetch data for stock loss
const fetchLossData = async () => {
  try {
    const response = await axios.get('/api/loss');
    lossData.value = response.data;
  } catch (error) {
    console.error('Error fetching loss data:', error);
  }
};

// Format date to DD/MM/YYYY
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB');
};

// Fetch data on component mount
onMounted(() => {
  fetchOpnameData();
  fetchLossData();
});
</script>

<template>
  <div class="biarsamaHomeView flex-1 p-4">
    <!-- Low Stock Table -->
    <div class="container mx-auto p-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-circle flex text-xl text-accent-500"></i>
        <h1 class="flex text-2xl text-heading">Stock Opname</h1>
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
              <th class="px-4 py-2 border-b">Status</th>
              <th class="px-4 py-2 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in opnameData"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
              <td class="px-4 py-2 border-b">{{ item.nama_produk }}</td>
              <td class="px-4 py-2 border-b">{{ item.stock_system }}</td>
              <td class="px-4 py-2 border-b">{{ item.phisycal_stock }}</td>
              <td class="px-4 py-2 border-b">
                {{ item.phisycal_stock - item.stock_system }}
              </td>
              <td class="px-4 py-2 border-b">
                <span
                  v-if="item.phisycal_stock === item.stock_system"
                  class="text-green-500"
                  >Match</span
                >
                <span v-else class="text-red-500">Discrepancy</span>
              </td>
              <td class="px-4 py-2 border-b">
                {{ formatDate(item.timestamp_created) }}
              </td>
            </tr>
            <tr v-if="opnameData.length === 0">
              <td colspan="7" class="text-center py-4">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Expired Stock Table -->
    <div class="container mx-auto p-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-triangle flex text-xl text-accent-500"></i>
        <h1 class="flex text-2xl text-heading">Stock Loss</h1>
      </div>
      <div>
        <table
          class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden"
        >
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="px-4 py-2 border-b">No</th>
              <th class="px-4 py-2 border-b">Product Name</th>
              <th class="px-4 py-2 border-b">Loss QTY</th>
              <th class="px-4 py-2 border-b">Reason</th>
              <th class="px-4 py-2 border-b">Report Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lossData" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
              <td class="px-4 py-2 border-b">{{ item.nama_produk }}</td>
              <td class="px-4 py-2 border-b">{{ item.loss_qty }}</td>
              <td class="px-4 py-2 border-b">{{ item.reason }}</td>
              <td class="px-4 py-2 border-b">
                {{ formatDate(item.report_time) }}
              </td>
            </tr>
            <tr v-if="lossData.length === 0">
              <td colspan="5" class="text-center py-4">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
