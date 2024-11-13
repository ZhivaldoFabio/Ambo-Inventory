<!-- AddDataCategory.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

const toast = useToast();

// Form state
const newCategory = ref({
  id_kategori: '',
  nama_kategori: '',
  
});

// Options for dropdowns, fetched from the API
const categories = ref([]);

// Fetch data for dropdowns on component mount
onMounted(async () => {
  try {
    const categoryResponse = await axios.get(
      'http://localhost:3000/api/categories'
    );

    categories.value = categoryResponse.data;
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
});

// Handle form submission
const addCategory = async () => {
  try {
    await axios.post('http://localhost:3000/api/categories', newCategory.value);
    toast.success('Category added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding category.');
    console.error('Error adding category:', error);
  }
};

// Reset form fields
const resetForm = () => {
  newCategory.value = {
    id_kategori: '',
    nama_kategori: '',
  };
};
</script>

<template>
  <h1>Hello</h1>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-file-plus text-2xl"></i>
        <h2 class="text-2xl font-heading">Add Category</h2>
      </div>
      <RouterLink
        :to="{ name: 'kategori' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
        ><i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i
      ></RouterLink>
    </div>

    <form @submit.prevent="addCategory">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Category Dropdown -->
          <div>
            <label for="id_kategori">Category</label>
            <div class="mt-2">
              <select
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                v-model="newCategory.id_kategori"
                id="id_kategori"
                required
              >
                <option value="" disabled>Select Category</option>
                <option
                  v-for="category in categories"
                  :key="category.id_kategori"
                  :value="category.id_ketegori"
                >
                  {{ category.nama_kategori }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-center">
            <!-- Submit Button -->
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-plus self-center"></i>
              Add Category
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.background-primary {
  background-color: hsla(144, 46%, 53%, 0.2);
}
</style>
