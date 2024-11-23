<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

// Reactive variables
const products = ref([]); // Daftar produk
const searchQuery = ref(''); // Query pencarian

// Fetch products on mount
onMounted(async () => {
  try {
    const response = await axios.get('/api/all-products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products data:', error);
    toast.error('Failed to fetch products. Please try again later.');
  }
});

const filteredProducts = computed(() =>
  products.value.filter((product) => {
    const query = searchQuery.value.toLowerCase();
    return product.nama_produk.toLowerCase().includes(query);
  })
);

// Delete confirmation and delete function
const confirmDelete = (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(productId);
  }
};

const deleteProduct = async (productId) => {
  try {
    await axios.delete(`/api/products/${productId}`);
    products.value = products.value.filter(
      (product) => product.id_produk !== productId
    );
    toast.success('Product deleted successfully.');
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete the product. Please try again.');
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Product List</h2>
      <RouterLink
        :to="{ name: 'add-data-produk' }"
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
        placeholder="Search by..."
      />
    </div>

    <!-- Table Section -->
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Product Name</th>
          <th class="px-4 py-2 border-b">Supplier</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Category</th>
          <th class="px-4 py-2 border-b">Purchase price</th>
          <th class="px-4 py-2 border-b">Selling Price</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Products List -->
        <tr
          v-for="(produk, index) in filteredProducts"
          :key="produk.id_produk"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ produk.nama_produk }}</td>
          <td class="px-4 py-2 border-b">{{ produk.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ produk.nama_unit }}</td>
          <td class="px-4 py-2 border-b">{{ produk.nama_kategori }}</td>
          <td class="px-4 py-2 border-b">{{ produk.harga_beli }}</td>
          <td class="px-4 py-2 border-b">{{ produk.harga_jual }}</td>
          <td class="px-4 py-4 border-b flex justify-center space-x-4">
            <RouterLink
              :to="{
                name: 'edit-data-produk',
                params: { id: produk.id_produk },
              }"
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white hover:drop-shadow-lg hover:bg-secondary-500"
            ></RouterLink>

            <button
              @click="confirmDelete(produk.id_produk)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
        <!-- Message if no products match -->
        <tr v-if="filteredProducts.length === 0">
          <td colspan="8" class="text-center py-4 text-gray-500">
            No products found with the given name.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
