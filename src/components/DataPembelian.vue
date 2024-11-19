<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const pembelians = ref([]);
const startDate = ref(''); // Start date for filtering
const endDate = ref(''); // End date for filtering

// Fetch data from the API
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

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

// Computed property to filter pembelians based on the date range
const filteredPembelians = computed(() => {
  if (!startDate.value && !endDate.value) {
    return pembelians.value;
  }
  return pembelians.value.filter((pembelian) => {
    const pembelianDate = new Date(pembelian.tanggal_pembelian);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;
    return (!start || pembelianDate >= start) && (!end || pembelianDate <= end);
  });
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-heading">Purchase listt</h2>
      <div class="flex items-center gap-4">
        <!-- Input for start and end date -->
        <div class="flex gap-2">
          <input
            v-model="startDate"
            type="date"
            class="border rounded px-3 py-2"
            placeholder="Start date"
          />
          <input
            v-model="endDate"
            type="date"
            class="border rounded px-3 py-2"
            placeholder="End date"
          />
        </div>
        <RouterLink
          :to="{ name: 'add-data-pembelian' }"
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
          <th class="px-4 py-2 border-b">Purchase Number</th>
          <th class="px-4 py-2 border-b">Supplier Name</th>
          <th class="px-4 py-2 border-b">Date</th>
          <th class="px-4 py-2 border-b">Total Price</th>
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
        <!-- Show message if no data is found -->
        <tr v-if="filteredPembelians.length === 0">
          <td colspan="6" class="px-4 py-2 text-center text-gray-500">
            No data found for the selected date range.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
