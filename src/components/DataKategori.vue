<script setup>
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast(); // Initialize Vue Toastification

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

// Reactive variable to store categories data
const categories = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/categories');
    categories.value = response.data; // Corrected variable name
  } catch (error) {
    console.error('Error fetching categories data:', error);
    toast.error('Failed to load categories.');
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Category List</h2>
      <RouterLink
        :to="{ name: 'add-data-kategori' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

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
        <tr
          v-for="(category, index) in categories"
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
            >
            </RouterLink>

            <button
              @click="confirmDelete(category.id_kategori)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
