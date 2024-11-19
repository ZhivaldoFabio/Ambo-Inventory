<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const stocks = ref([]); // Stock data
const searchQuery = ref(''); // Query for searching

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

// Function to confirm deletion
const confirmDelete = (id) => {
  const isConfirmed = window.confirm('Are you sure you want to delete this stock?');
  if (isConfirmed) {
    deleteStock(id);
  }
};

// Function to handle deletion
const deleteStock = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/stocks/${id}`);
    stocks.value = stocks.value.filter((stock) => stock.id_stock !== id);
    toast.success('Stock deleted successfully!');
  } catch (error) {
    toast.error('Error deleting stock.');
    console.error('Error deleting stock:', error);
  }
};

// Computed property to filter stocks based on search query
const filteredStocks = computed(() => {
  if (!searchQuery.value) return stocks.value;
  return stocks.value.filter((stock) =>
    stock.nama_produk.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Stock List</h2>
      <div class="flex items-center gap-4">
        <!-- Input for search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by product name"
          class="border rounded px-3 py-2"
        />
        <RouterLink
          :to="{ name: 'add-data-stock' }"
          class="max-h-10 py-2 px-3 rounded-md text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
        >
          Add New
        </RouterLink>
      </div>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Supplier Name</th>
          <th class="px-4 py-2 border-b">Product Name</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Category</th>
          <th class="px-4 py-2 border-b">Entry Dade</th>
          <th class="px-4 py-2 border-b">Expiry Date</th>
          <th class="px-4 py-2 border-b">Stock</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(stock, index) in filteredStocks"
          :key="stock.id_stock"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_unit }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
          <td class="px-4 py-2 border-b">{{ formatTimestamp(stock.tgl_masuk) }}</td>
          <td class="px-4 py-2 border-b">{{ formatTimestamp(stock.tgl_exp) }}</td>
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
        <!-- Show message if no data is found -->
        <tr v-if="filteredStocks.length === 0">
          <td colspan="9" class="px-4 py-2 text-center text-gray-500">
            No stock found with the given product name.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
