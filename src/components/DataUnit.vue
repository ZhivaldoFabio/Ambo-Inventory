<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const units = ref([]);
const searchQuery = ref(''); // Untuk menyimpan query pencarian

const confirmDelete = (id) => {
  const isConfirmed = window.confirm(
    'Are you sure you want to delete this unit?'
  );
  if (isConfirmed) {
    deleteUnit(id);
  }
};

const deleteUnit = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/units/${id}`);
    units.value = units.value.filter((unit) => unit.id_unit !== id);
    toast.success('Unit deleted successfully!');
  } catch (error) {
    toast.error('Error deleting unit.');
    console.error('Error deleting unit:', error);
  }
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/units');
    units.value = response.data;
  } catch (error) {
    console.error('Error fetching units data:', error);
  }
});

// Filtered units based on search query
const filteredUnits = computed(() =>
  units.value.filter((unit) =>
    unit.nama_unit.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Unit List</h2>
      <RouterLink
        :to="{ name: 'add-data-unit' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="w-64 h-12 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500"
        placeholder="Search by unit name..."
      />
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
          v-for="(unit, index) in filteredUnits"
          :key="unit.id_unit"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ unit.nama_unit }}</td>
          <td class="px-4 py-2 border-b">{{ unit.id_unit }}</td>
          <td class="px-4 py-4 border-b flex justify-center space-x-4">
            <RouterLink
              :to="{ name: 'edit-data-unit', params: { id: unit.id_unit } }"
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white-50 hover:drop-shadow-lg hover:bg-secondary-500"
            ></RouterLink>
            <button
              @click="confirmDelete(unit.id_unit)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
