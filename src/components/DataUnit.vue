<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// A ref to handle the confirmation logic
const confirmDelete = (id) => {
  const isConfirmed = window.confirm(
    'Are you sure you want to delete this unit?'
  );
  if (isConfirmed) {
    deleteUnit(id); // Proceed with deletion if confirmed
  }
};

// Function to handle deletion
const deleteUnit = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/units/${id}`); // Ensure the API path is correct
    // Remove unit from the local list
    units.value = units.value.filter((unit) => unit.id_unit !== id);
    // Display a success toast
    toast.success('Unit deleted successfully!');
  } catch (error) {
    toast.error('Error deleting unit.'); // Error toast
    console.error('Error deleting unit:', error);
  }
};

// Reactive variable to store units data
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
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Unit List</h2>
      <RouterLink :to="{ name: 'add-data-unit' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-text-500 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Unit Name</th>
          <th class="px-4 py-2 border-b">Unit ID</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(unit, index) in units"
          :key="unit.id_unit"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ unit.nama_unit }}</td>
          <td class="px-4 py-2 border-b">{{ unit.id_unit }}</td>
          <td class="px-4 py-4 border-b flex justify-between">
            <RouterLink
              :to="{ name: 'edit-data-unit', params: { id: unit.id_unit } }"
              class="pi pi-pen-to-square flex text-primary-500 hover:drop-shadow-lg"
            >
              Edit
            </RouterLink>

            <button
              @click="confirmDelete(unit.id_unit)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
