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
    'Are you sure you want to delete this stock?'
  );
  if (isConfirmed) {
    deleteStock(id); // Proceed with deletion if confirmed
  }
};

// Function to handle deletion
const deleteStock = async (id) => {
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
      <h2 class="text-2xl font-semibold mb-4">Stock List</h2>
      <RouterLink
        :to="{ name: 'add-data-stock' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Kategori</th>
          <th class="px-4 py-2 border-b">Masuk</th>
          <th class="px-4 py-2 border-b">Expired</th>
          <th class="px-4 py-2 border-b">Stock</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(stock, index) in stocks"
          :key="stock.id_stock"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
          <!-- Directly use nama_supplier -->
          <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
          <!-- Directly use nama_produk -->
          <td class="px-4 py-2 border-b">{{ stock.nama_unit }}</td>
          <!-- Directly use nama_unit -->
          <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
          <!-- Directly use nama_kategori -->
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_masuk) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_exp) }}
          </td>
          <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
          <td class="px-4 py-4 border-b flex justify-center space-x-4">
            <RouterLink
              :to="{ name: 'edit-data-stock', params: { id: stock.id_stock } }"
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white-50 hover:drop-shadow-lg hover:bg-secondary-500"
            >
            </RouterLink>

            <button
              @click="confirmDelete(stock.id_stock)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
