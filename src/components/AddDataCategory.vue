<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

const toast = useToast();

// Form state
const newCategory = ref({
  nama_kategori: '',
});

// Error messages
const errors = ref({});

// Loading state
const isSubmitting = ref(false);

// Options for dropdowns, fetched from the API
const categories = ref([]);

// Fetch data for dropdowns on component mount
onMounted(async () => {
  try {
    const categoryResponse = await axios.get(
      '/api/categories'
    );
    categories.value = categoryResponse.data;
  } catch (error) {
    toast.error('Failed to fetch categories.');
    console.error('Error fetching dropdown data:', error);
  }
});

// Handle form submission
const addCategory = async () => {
  errors.value = {};

  // Validation
  if (!newCategory.value.nama_kategori) {
    errors.value.nama_kategori = 'Category name is required.';
    toast.error('Please enter a category name.');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await axios.post('/api/categories', newCategory.value);
    toast.success('Category added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding category.');
    console.error('Error adding category:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form fields
const resetForm = () => {
  newCategory.value = {
    nama_kategori: '',
  };
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-file-plus text-2xl"></i>
        <h2 class="text-2xl font-heading">Add Category</h2>
      </div>
      <RouterLink
        :to="{ name: 'kategori' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i>
      </RouterLink>
    </div>

    <form @submit.prevent="addCategory">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Category Name -->
          <div>
            <label for="nama_kategori">New Category</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="text"
                v-model="newCategory.nama_kategori"
                id="nama_kategori"
              />
              <p v-if="errors.nama_kategori" class="text-red-500 text-sm">
                {{ errors.nama_kategori }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              :disabled="isSubmitting"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="!isSubmitting" class="pi pi-plus self-center"></i>
              <span v-else>Loading...</span>
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
