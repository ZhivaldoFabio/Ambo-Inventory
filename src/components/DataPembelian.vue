<!-- DataPembelian.vue -->

<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variable to store Pembelian data
const pembelians = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/api/all-pembelian');
    pembelians.value = response.data;
  } catch (error) {
    console.error('Error fetching pembelian data:', error);
    toast.error('Failed to fetch pembelian data.');
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
      <h2 class="text-2xl font-heading mb-4">Pembelian List</h2>
      <RouterLink
        :to="{ name: 'add-data-pembelian' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">No Pembelian</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">Tanggal</th>
          <th class="px-4 py-2 border-b">Total Harga</th>
          <th class="px-4 py-2 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(pembelian, index) in pembelians"
          :key="pembelian.id_pembelian"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ pembelian.id_pembelian }}</td>
          <td class="px-4 py-2 border-b">{{ pembelian.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(pembelian.tanggal_pembelian) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatCurrency(pembelian.total_harga) }}
          </td>
          <td class="px-4 py-2 border-b">
            <RouterLink
              :to="{
                name: 'detail-data-pembelian',
                params: { id: pembelian.id_pembelian },
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
