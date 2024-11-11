<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

// Reactive variable to store Produk data
const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/all-products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products data:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Produk List</h2>
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
        </tr>
      </tbody>
    </table>
  </div>
</template>
