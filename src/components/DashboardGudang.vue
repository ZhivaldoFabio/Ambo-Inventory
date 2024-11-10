<!-- DashboardGudang.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stocks = ref([]); // Array to hold the fetched stock data

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/stocks');
    stocks.value = response.data;
    console.log('Fetched stock data:', response.data);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
});
</script>

<template>
  <!-- Stock Table -->
  <div class="container mx-auto p-4">
    <div class="flex items-center space-x-2">
      <i class="pi pi-exclamation-circle flex text-xl text-accent-500"></i>
      <h1 class="flex text-2xl text-heading">Stock Menipis</h1>
    </div>
    <div>
      <table
        class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden"
      >
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="px-4 py-2 border-b">No</th>
            <th class="px-4 py-2 border-b">Nama Produk</th>
            <th class="px-4 py-2 border-b">Kategori</th>
            <th class="px-4 py-2 border-b">Supplier</th>
            <th class="px-4 py-2 border-b">Stock Minimum</th>
            <th class="px-4 py-2 border-b">Stock Sekarang</th>
            <th class="px-4 py-2 border-b">Presentase</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(stock, index) in stocks"
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
                  ? ((stock.jumlah_stock / stock.stock_minimum) * 100).toFixed(
                      2
                    )
                  : 'N/A'
              }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
