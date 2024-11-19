<!-- DetailDataPembelian.vue -->

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

// Initialize Vue Toastification
const toast = useToast();

// Reactive variables
const detailpembelian = ref([]);
const loading = ref(true);

// Get the route parameter ID
const route = useRoute();
const id = route.params.id;

onMounted(async () => {
  try {
    // Fetch detail pembelian data
    const response = await axios.get(`/api/pembelian/${id}/details`);
    if (response.data.success && Array.isArray(response.data.data)) {
      detailpembelian.value = response.data.data;
    } else {
      toast.error('No detail pembelian found for this ID.');
    }
  } catch (error) {
    console.error('Error fetching detail pembelian:', error);
    toast.error('Failed to fetch detail pembelian.');
  } finally {
    loading.value = false;
  }
});

// Currency formatter
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
      <h2 class="text-2xl font-semibold mb-4">Purchase Detail {{ id }}</h2>
      <RouterLink
        :to="{ name: 'data-pembelian' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        <i class="pi pi-angle-left text-white-50"></i>
      </RouterLink>
    </div>

    <!-- Loading Indicator -->
    <p v-if="loading">Loading details...</p>

    <!-- Data Table -->
    <table
      v-else-if="detailpembelian.length > 0"
      class="min-w-full border border-gray-300 rounded-lg overflow-hidden"
    >
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Supplier Name</th>
          <th class="px-4 py-2 border-b">Product Name</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Product Quantity</th>
          <th class="px-4 py-2 border-b">Price</th>
          <th class="px-4 py-2 border-b">Total Price</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(detail, index) in detailpembelian"
          :key="detail.id_detail_pembelian"
          class="hover:bg-gray-100"
        >
          <td class="px-4 py-2 border-b">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ detail.nama_produk }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ detail.nama_unit }}
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

    <!-- No Data -->
    <p v-else>No details available for this Purchase.</p>
  </div>
</template>
