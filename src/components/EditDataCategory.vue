<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const categoryId = route.params.id; // Get the ID from the route

// Reactive object for category data
const categoryData = ref({
  nama_kategori: '',
});

// Fetch the current category data
onMounted(async () => {
  try {
    const categoryResponse = await axios.get(
      `http://localhost:3000/api/categories/${categoryId}`
    );

    const category = categoryResponse.data;
    categoryData.value = category;
  } catch (error) {
    console.error('Error fetching category data:', error);
    toast.error('Failed to load category details.');
  }
});

// Update the category data
const updateCategory = async () => {
  try {
    const formattedCategoryData = {
      ...categoryData.value,
    };

    await axios.put(
      `http://localhost:3000/api/categories/${categoryId}`,
      formattedCategoryData
    );
    toast.success('Category updated successfully!');
    router.push({ name: 'kategori' }); // Navigate back to the categories page
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category.');
  }
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-pen-to-square text-2xl"></i>
        <h2 class="text-2xl font-heading">Edit Category</h2>
      </div>

      <RouterLink
        :to="{ name: 'kategori' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i class="pi pi-angle-left text-primary-700" style="font-size: 1.3rem"></i>
      </RouterLink>
    </div>

    <form @submit.prevent="updateCategory">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Category Name Input -->
          <div class="mb-4">
            <label for="nama_kategori" class="block font-medium mb-1">Category Name</label>
            <input
              id="nama_kategori"
              type="text"
              v-model="categoryData.nama_kategori"
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="flex justify-center">
            <!-- Submit Button -->
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-pencil self-center"></i>
              Update Category
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
