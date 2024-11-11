<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';


// Reactive variable to store Produk data
const units = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/units');
    units.value = response.data;
  } catch (error) {
    console.error('Error fetching units data:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Unit List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Unit</th>
          <th class="px-4 py-2 border-b">ID Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(unit, index) in units"
          :key="unit.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ unit.nama_unit }}</td>
          <td class="px-4 py-2 border-b">{{ unit.id_unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
