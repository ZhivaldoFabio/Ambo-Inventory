<script setup>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

// Reactive variables
const categories = ref([]); // Data kategori
const searchQuery = ref(''); // Query pencarian

// Fetch data categories on mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/categories');
    categories.value = response.data; // Data kategori
  } catch (error) {
    console.error('Error fetching categories data:', error);
    toast.error('Failed to load categories.');
  }
});

// Computed property untuk memfilter kategori berdasarkan searchQuery
const filteredCategories = computed(() =>
  categories.value.filter((category) =>
    category.nama_kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// A ref to handle the confirmation logic
const confirmDelete = (id) => {
  const isConfirmed = window.confirm(
    'Are you sure you want to delete this category?'
  );
  if (isConfirmed) {
    deleteCategory(id); // Proceed with deletion if confirmed
  }
};

// Function to handle deletion
const deleteCategory = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/categories/${id}`); // Ensure the API path is correct
    // Remove category from the local list
    categories.value = categories.value.filter(
      (category) => category.id_kategori !== id
    );
    // Display a success toast
    toast.success('Category deleted successfully!');
  } catch (error) {
    toast.error('Error deleting category.'); // Error toast
    console.error('Error deleting category:', error);
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Category List</h2>
      <RouterLink
        :to="{ name: 'add-data-kategori' }"
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
        placeholder="Search by category name..."
      />
    </div>

    <!-- Table Section -->
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Category Name</th>
          <th class="px-4 py-2 border-b">Category ID</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Filtered Categories -->
        <tr
          v-for="(category, index) in filteredCategories"
          :key="category.id_kategori"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ category.nama_kategori }}</td>
          <td class="px-4 py-2 border-b">{{ category.id_kategori }}</td>
          <td class="px-4 py-4 border-b flex justify-center space-x-4">
            <RouterLink
              :to="{
                name: 'edit-data-kategori',
                params: { id: category.id_kategori },
              }"
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white-50 hover:drop-shadow-lg hover:bg-secondary-500"
            ></RouterLink>

            <button
              @click="confirmDelete(category.id_kategori)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>

        <!-- No Data Message -->
        <tr v-if="filteredCategories.length === 0">
          <td colspan="4" class="text-center py-4 text-gray-500">
            No categories found with the given name.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
