<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const suppliers = ref([]); // Daftar suppliers
const searchQuery = ref(''); // Query pencarian

// Fetch data suppliers on mounted
onMounted(async () => {
  try {
    const response = await axios.get('/api/suppliers');
    suppliers.value = response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
  }
});

// Computed property untuk memfilter suppliers berdasarkan searchQuery
const filteredSuppliers = computed(() =>
  suppliers.value.filter((supplier) =>
    supplier.nama_supplier.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// A ref to handle the confirmation logic
const confirmDelete = (id) => {
  const isConfirmed = window.confirm(
    'Are you sure you want to delete this supplier?'
  );
  if (isConfirmed) {
    deleteSupplier(id); // Proceed with deletion if confirmed
  }
};

// Function to handle deletion
const deleteSupplier = async (id) => {
  try {
    await axios.delete(`/api/suppliers/${id}`); // Ensure the API path is correct
    // Remove supplier from the local list
    suppliers.value = suppliers.value.filter(
      (supplier) => supplier.id_supplier !== id
    );
    // Display a success toast
    toast.success('Supplier deleted successfully!');
  } catch (error) {
    toast.error('Error deleting supplier.'); // Error toast
    console.error('Error deleting supplier:', error);
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Supplier List</h2>
      <RouterLink
        :to="{ name: 'add-data-supplier' }"
        class="max-h-10 py-2 px-3 rounded-md text-white bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        class="w-64 h-12 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500"
        placeholder="Search by supplier name..."
      />
    </div>

    <!-- Table Section -->
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Supplier Name</th>
          <th class="px-4 py-2 border-b">Address</th>
          <th class="px-4 py-2 border-b">Phone Number</th>
          <th class="px-4 py-2 border-b">Email</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- List Suppliers -->
        <tr
          v-for="(supplier, index) in filteredSuppliers"
          :key="supplier.id_supplier"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.alamat }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.no_hp }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.email }}</td>
          <td class="px-4 py-4 border-b flex justify-center space-x-4">
            <RouterLink
              :to="{
                name: 'edit-data-supplier',
                params: { id: supplier.id_supplier },
              }"
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white-50 hover:drop-shadow-lg hover:bg-secondary-500"
            ></RouterLink>

            <button
              @click="confirmDelete(supplier.id_supplier)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
        <!-- No Data Message -->
        <tr v-if="filteredSuppliers.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">
            No suppliers found with the given name.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
