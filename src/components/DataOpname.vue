<!-- DashboardGudang.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const lowStock = ref([]); // Array to hold low stock data
const expiredItems = ref([]); // Array to hold expired items data

// Function to calculate the days left until expiration
const calculateDaysLeft = (expirationDate) => {
  const currentDate = new Date();
  const expDate = new Date(expirationDate);
  const timeDiff = expDate - currentDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

  return daysLeft < 0 ? 'Expired' : daysLeft;
};

// Function to format expiration date
function formatExpirationDate(expirationDate) {
  const date = new Date(expirationDate);
  return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/stocks');
    lowStock.value = response.data.lowStock;
    expiredItems.value = response.data.expiredItems;
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
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
              <th class="px-4 py-2 border-b">Category</th>
              <th class="px-4 py-2 border-b">Supplier</th>
              <th class="px-4 py-2 border-b">Stock Minimum</th>
              <th class="px-4 py-2 border-b">Available stock</th>
              <th class="px-4 py-2 border-b">Presentation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(stock, index) in lowStock"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
              <td class="px-4 py-2 border-b">
                {{ stock.stock_minimum || 'N/A' }}
              </td>
              <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
              <td class="px-4 py-2 border-b">
                {{
                  stock.stock_minimum > 0
                    ? (
                        (stock.jumlah_stock / stock.stock_minimum) *
                        100
                      ).toFixed(2)
                    : 'N/A'
                }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Expired Stock Table -->
    <div class="container mx-auto p-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-triangle flex text-xl text-accent-500"></i>
        <h1 class="flex text-2xl text-heading">Stock Rusak</h1>
      </div>
      <div>
        <table
          class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden"
        >
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="px-4 py-2 border-b">No</th>
              <th class="px-4 py-2 border-b">Product Name</th>
              <th class="px-4 py-2 border-b">Category</th>
              <th class="px-4 py-2 border-b">Supplier</th>
              <th class="px-4 py-2 border-b">QTY</th>
              <th class="px-4 py-2 border-b">Expiration Date</th>
              <th class="px-4 py-2 border-b">Days Left</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(stock, index) in expiredItems"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
              <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
              <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
              <td class="px-4 py-2 border-b">
                {{ formatExpirationDate(stock.tgl_exp) }}
              </td>
              <td class="px-4 py-2 border-b">
                <!-- Calculate days left based on expiration date -->
                {{ calculateDaysLeft(stock.tgl_exp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
