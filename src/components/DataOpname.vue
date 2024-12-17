<!-- DataOpname.vue -->

<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const startDate = ref(''); // Start Date
const endDate = ref(''); // End Date
const opname = ref([]); // List of stock opname records
const loading = ref(false); // Loading state

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

// Fetch Opname Data from Backend
const fetchOpnameData = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/stock-opname'); // Replace with your endpoint
    opname.value = response.data; // Store the fetched data
  } catch (error) {
    console.error('Error fetching opname data:', error);
    toast.error('Failed to fetch opname data. Please try again.');
  } finally {
    loading.value = false;
  }
};

// Filtered Opname Records Based on Date Range
const filteredOpnames = computed(() => {
  if (!startDate.value && !endDate.value) {
    return opname.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  return opname.value.filter((item) => {
    const opnameDate = new Date(item.tanggal_opname);
    return opnameDate >= start && opnameDate <= end;
  });
});

// Watch for Date Changes and Fetch Data
watch([startDate, endDate], fetchOpnameData);

// Fetch Data on Component Mount
onMounted(fetchOpnameData);
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-heading">Stock Opname</h2>
      <RouterLink
        :to="{ name: 'add-data-opname' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New Opname
      </RouterLink>
    </div>

    <!-- Date Filters -->
    <div class="flex items-center space-x-4 mb-4">
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

    <!-- Table -->
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Date</th>
          <th class="px-4 py-2 border-b">Time</th>
          <th class="px-4 py-2 border-b">Opnamer</th>
          <th class="px-4 py-2 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in filteredOpnames"
          :key="item.id_opname"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(item.tanggal_opname) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ new Date(item.tanggal_opname).toLocaleTimeString() }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ item.opnamer_name || 'Unknown' }}
          </td>
          <td class="px-4 py-2 border-b">
            <RouterLink
              :to="{
                name: 'detail-data-opname',
                params: { id: item.id_opname },
              }"
              class="p-2 px-4 bg-primary-500 text-white rounded-md hover:shadow-md"
            >
              View
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center my-4">Loading...</div>
    <div
      v-if="!loading && filteredOpnames.length === 0"
      class="text-center my-4"
    >
      No stock opname data found.
    </div>
  </div>
</template>
