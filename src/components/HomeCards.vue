<!-- HomeCards.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from '@/components/Card.vue';
import ProdukTerjual from '@/components/ProdukTerjual.vue';
import ProgressPendapatan from '@/components/ProgressPendapatan.vue';

const stocks = ref([]); // Array to hold the fetched stock data
const totalHargaSum = ref(0);
const totalPenjualan = ref(0);
const totalProdukSum = ref(0);

// Fetch stocks from the backend (MySQL)
onMounted(async () => {
  try {
    const response = await axios.get('/api/stocks');
    stocks.value = response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
});

// Fetch the total Harga sum from the backend
onMounted(async () => {
  try {
    const response = await axios.get('/api/total-harga-sum');
    totalHargaSum.value = response.data.total_harga_sum; // Assuming the response contains a `total_harga_sum`
  } catch (error) {
    console.error('Error fetching totalHargaSum:', error);
  }
});

// Fetch the total Produk sum from the backend
onMounted(async () => {
  try {
    const response = await axios.get('/api/total-produk-sum');
    totalProdukSum.value = response.data.total_produk_sum; // Assuming the response contains a `total_produk_sum`
  } catch (error) {
    console.error('Error fetching totalProdukSum:', error);
  }
});

// Fetch total penjualan (transaction count)
onMounted(async () => {
  try {
    const response = await axios.get('/api/total-penjualan');
    totalPenjualan.value = response.data.total_penjualan;
  } catch (error) {
    console.error('Error fetching totalPenjualan:', error);
  }
});

// Function to format numbers with thousands separator
function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
</script>

<template>
  <!-- Developers and Employers -->
  <section class="py-4 font-body">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 my-4 rounded-lg">
        <!-- 1 -->
        <Card bg="bg-primary-200">
          <div class="flex items-center space-x-2">
            <i class="pi pi-money-bill flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Pendapatan</h1>
          </div>

          <div class="text-3xl mt-14 font-bold place-self-center">
            <!-- Display total_harga here -->
            Rp. {{ formatCurrency(totalHargaSum) }}
          </div>
        </Card>
        <!-- 2 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-box flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Produk yang Terjual</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            {{ totalProdukSum }}
          </div>
        </Card>
        <!-- 3 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-receipt flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Jumlah Transaksi</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            <!-- Display total penjualan -->
            {{ totalPenjualan }}
          </div>
        </Card>

        <!-- 4 -->
        <Card class="col-span-2">
          <div>
            <ProgressPendapatan />
          </div>
        </Card>
        <!-- 5 -->
        <Card>
          <div>
            <ProdukTerjual class="overflow-hidden z-10" />
          </div>
        </Card>

        <!-- 6 -->
        <Card class="col-span-3">
          <div class="flex items-center space-x-2">
            <i
              class="pi pi-exclamation-circle flex text-xl text-accent-500"
            ></i>
            <h1 class="flex text-xl text-heading">Stock Menipis</h1>
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
        </Card>
        <!-- 7 -->
      </div>
    </div>
  </section>
</template>
