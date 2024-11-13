<!-- DataSupplier.vue -->

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

// Reactive variable to store suppliers data
const suppliers = ref([]);

onMounted(async () => {
  try {
    // Fetch data from the API
    const response = await axios.get("http://localhost:3000/api/suppliers");
    suppliers.value = response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Supplier List</h2>
      <RouterLink :to="{ name: 'add-data-supplier' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">ID Supplier</th>
          <th class="px-4 py-2 border-b">Alamat</th>
          <th class="px-4 py-2 border-b">No HP</th>
          <th class="px-4 py-2 border-b">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(supplier, index) in suppliers"
          :key="supplier.id_supplier"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.id_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.alamat }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.no_hp }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
