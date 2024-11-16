<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive variable to store Produk data
const products = ref([]);

// Fetch products on mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/all-products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products data:', error);
  }
});

// Delete confirmation and delete function
const confirmDelete = (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(productId);
  }
};

const deleteProduct = async (productId) => {
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}`);
    products.value = products.value.filter(
      (product) => product.id_produk !== productId
    );
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold mb-4">Product List</h2>
      <RouterLink
        :to="{ name: 'add-data-produk' }"
        class="max-h-10 py-2 px-3 rounded-md self-center text-white-50 bg-primary-500 hover:shadow-lg shadow-primary-500 active:scale-90"
      >
        Add New
      </RouterLink>
    </div>

    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Supplier</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Kategori</th>
          <th class="px-4 py-2 border-b">Harga Beli</th>
          <th class="px-4 py-2 border-b">Harga Jual</th>
          <th class="px-4 py-2 border-b text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(produk, index) in products"
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
              class="bg-primary-500 p-2 rounded-md pi pi-pen-to-square flex text-white-50 hover:drop-shadow-lg hover:bg-secondary-500"
            >
            </RouterLink>

            <button
              @click="confirmDelete(produk.id_produk)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
