<!-- DataStock.vue -->

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import DetailDataPenjualan from './DetailDataPenjualan.vue';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variable to store suppliers data
const penjualans = ref([]);

// Fetch the penjualan list from the API
onMounted(async () => {
  try {
    const response = await axios.get('api/all-penjualan');
    penjualans.value = response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    toast.error('Failed to fetch penjualan data.');
  }
});

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Penjualan List</h2>
      <RouterLink
        :to="{ name: 'home' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">No Penjualan</th>
          <th class="px-4 py-2 border-b">Total Harga</th>
          <th class="px-4 py-2 border-b">Tanggal</th>
          <th class="px-4 py-2 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(penjualan, index) in penjualans"
          :key="penjualan.id_penjualan"
          class="hover:bg-gray-50"
        >
          <!-- Main Row -->
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ penjualan.id_penjualan }}</td>
          <td class="px-4 py-2 border-b">{{ formatCurrency(penjualan.total_harga) }}</td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(penjualan.tanggal_penjualan) }}
          </td>
          <td class="px-4 py-2 border-b">
            <RouterLink
              :to="{
                name: 'detail-data-penjualan',
                params: { id: penjualan.id_penjualan },
              }"
              class=" p-2 px-4 bg-primary-500 text-white-50 rounded-md hover:shadow-md"
            >
              View
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
