<!-- DetailDataStock.vue -->

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variable to store detail penjualan data
const detailpenjualan = ref([]); // Array to hold multiple detail rows
const loading = ref(true); // Loading state

// Access the route to get the ID
const route = useRoute();
const id = route.params.id; // Extract the 'id' from route params

onMounted(async () => {
  try {
    // Fetch detail penjualan data based on id_penjualan
    const response = await axios.get(`/api/penjualan/${id}/details`);
    console.log('Fetched detail penjualan:', response.data);

    if (response.data.success && Array.isArray(response.data.data)) {
      detailpenjualan.value = response.data.data; // Assign fetched data
    } else {
      detailpenjualan.value = [];
      toast.error('No detail penjualan found for this ID.');
    }
  } catch (error) {
    console.error('Error fetching detail penjualan:', error);
    toast.error('Failed to fetch detail penjualan.');
    detailpenjualan.value = [];
  } finally {
    loading.value = false; // End loading
  }
});

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
      <h2 class="text-2xl font-semibold mb-4">Detail Penjualan {{ id }}</h2>
      <RouterLink
        :to="{ name: 'data-penjualan' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        <i class="pi pi-angle-left text-white-50"></i>
      </RouterLink>
    </div>

    <!-- Show Loading State -->
    <p v-if="loading">Loading details...</p>

    <table
      v-else-if="detailpenjualan.length > 0"
      class="min-w-full border border-gray-300 rounded-lg overflow-hidden"
    >
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Jumlah Produk</th>
          <th class="px-4 py-2 border-b">Harga</th>
          <th class="px-4 py-2 border-b">Total Harga</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(detail, index) in detailpenjualan"
          :key="detail.id_detail_penjualan"
          class="hover:bg-gray-100"
        >
          <!-- Main Row -->
          <td class="px-4 py-2 border-b">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ detail.nama_produk }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ detail.jumlah_produk }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatCurrency(detail.harga) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatCurrency(detail.harga * detail.jumlah_produk) }}
          </td>
        </tr>
      </tbody>
    </table>
    <!-- No Data State -->
    <p v-else>No details available for this penjualan.</p>
  </div>
</template>
