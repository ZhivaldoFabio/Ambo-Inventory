<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const pembelians = ref([]);
const startDate = ref(''); // Tanggal awal
const endDate = ref(''); // Tanggal akhir

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

// Filtered pembelians based on date range
const filteredPembelians = computed(() => {
  if (!startDate.value && !endDate.value) {
    return pembelians.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  return pembelians.value.filter((pembelian) => {
    const pembelianDate = new Date(pembelian.tanggal_pembelian);
    return pembelianDate >= start && pembelianDate <= end;
  });
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-heading">Pembelian List</h2>
      <RouterLink
        :to="{ name: 'home' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Home
      </RouterLink>
    </div>

    <!-- Search Bar -->
    <div class="flex items-center mb-4 space-x-4">
      <input
        v-model="startDate"
        type="date"
        class="border border-gray-300 rounded-lg px-4 py-2"
        placeholder="Start Date"
      />
      <input
        v-model="endDate"
        type="date"
        class="border border-gray-300 rounded-lg px-4 py-2"
        placeholder="End Date"
      />
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
          v-for="(pembelian, index) in filteredPembelians"
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
              :to="{ name: 'detail-laporan-pembelian', params: { id: pembelian.id_pembelian } }"
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
