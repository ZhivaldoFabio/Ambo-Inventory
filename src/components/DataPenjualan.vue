<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const penjualans = ref([]);
const startDate = ref(''); // Tanggal awal
const endDate = ref(''); // Tanggal akhir
const grand_total = ref(0); // Total revenue

// Fetch data on mounted
onMounted(() => {
  fetchPenjualanAndTotal();
});

// Function to fetch penjualan and grand total
async function fetchPenjualanAndTotal() {
  try {
    // Fetch the list of penjualans
    const response = await axios.get('api/all-penjualan');
    penjualans.value = response.data;

    // Fetch the grand total with date filters
    const totalResponse = await axios.get('api/penjualan/total', {
      params: {
        startDate: startDate.value || null, // Pass null if empty
        endDate: endDate.value || null, // Pass null if empty
      },
    });
    grand_total.value = totalResponse.data.grand_total || 0;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to fetch data.');
  }
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

// Filtered penjualans based on date range
const filteredPenjualans = computed(() => {
  if (!startDate.value && !endDate.value) {
    return penjualans.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  return penjualans.value.filter((penjualan) => {
    const penjualanDate = new Date(penjualan.tanggal_penjualan);
    return penjualanDate >= start && penjualanDate <= end;
  });
});

// Watcher for date range changes
watch([startDate, endDate], () => {
  fetchPenjualanAndTotal();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-heading">Sales List</h2>
      <RouterLink
        :to="{ name: 'home' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <!-- Navigation Bar -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4 mb-4">
        <input
          v-model="startDate"
          type="date"
          class="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Start Date"
        />
        <input
          v-model="endDate"
          type="date"
          class="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="End Date"
        />
      </div>
      <!-- Display Total Harga -->
      <div class="font-heading text-xl">
        <h3 class="">
          Total Revenue:
          <span class="text-primary-500">{{
            formatCurrency(grand_total)
          }}</span>
        </h3>
      </div>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Date</th>
          <th class="px-4 py-2 border-b">Total Price</th>
          <th class="px-4 py-2 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(penjualan, index) in filteredPenjualans"
          :key="penjualan.id_penjualan"
          class="hover:bg-gray-50"
        >
          <!-- Main Row -->
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(penjualan.tanggal_penjualan) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatCurrency(penjualan.total_harga) }}
          </td>
          <td class="px-4 py-2 border-b">
            <RouterLink
              :to="{
                name: 'detail-data-penjualan',
                params: { id: penjualan.id_penjualan },
              }"
              class="p-2 px-4 bg-primary-500 text-white-50 rounded-md hover:shadow-md"
            >
              View
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
