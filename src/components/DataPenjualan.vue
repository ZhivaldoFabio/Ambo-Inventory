<!-- DataStock.vue -->

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Props or data passed to the component
const props = defineProps({
  stock: Object, // Assuming stock is passed as a prop
});

// A ref to handle the confirmation logic
const confirmDelete = (id) => {
  const isConfirmed = window.confirm(
    'Are you sure you want to delete this penjualan?'
  );
  if (isConfirmed) {
    deletePenjualan(id); // Proceed with deletion if confirmed
  }
};

// Function to handle deletion
const deletePenjualan = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/stocks/${id}`); // Ensure the API path is correct
    // Remove stock from the local list
    stocks.value = stocks.value.filter((stock) => stock.id_stock !== id);
    // Display a success toast
    toast.success('Stock deleted successfully!');
  } catch (error) {
    toast.error('Error deleting stock.'); // Error toast
    console.error('Error deleting stock:', error);
  }
};

// Reactive variable to store suppliers data
const stocks = ref([]);

// Fetch the stock list from the API
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/all-stocks');
    stocks.value = response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
});

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Penjualan List</h2>
      <RouterLink :to="{ name: 'add-data-penjualan' }"
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
          <th class="px-4 py-2 border-b">Tanggal</th>
          <th class="px-4 py-2 border-b">Total Harga</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(penjualan, index) in penjualans"
          :key="penjualan.id_penjualan"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ penjualan.id_penjualan }}</td>
          <!-- Directly use nama_supplier -->
          <td class="px-4 py-2 border-b">{{ penjualan.total_harga }}</td>
          <!-- Directly use nama_produk -->
          <td class="px-4 py-2 border-b">{{ formatTimestamp(penjualan.tanggal_penjualan) }}</td>
          <td class="px-4 py-4 border-b flex justify-between"></td>
          </tr>
      </tbody>
    </table>
  </div>
</template>
