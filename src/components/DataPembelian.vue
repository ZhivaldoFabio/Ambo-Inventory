<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Reactive variable to store Pembelian data
const pembelians = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/all-pembelian");
    pembelians.value = response.data;
  } catch (error) {
    console.error("Error fetching products data:", error);
  }
});

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Pembelian List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Tanggal</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Qty</th>
          <th class="px-4 py-2 border-b">Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(pembelian, index) in pembelians"
          :key="pembelian.id"
          class="hover:bg-gray-50 text-left"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <th class="px-4 py-2 border-b">{{ formatTimestamp(pembelian.tanggal_pembelian) }}</th>
          <th class="px-4 py-2 border-b">{{ pembelian.nama_supplier }}</th>
          <th class="px-4 py-2 border-b">{{ pembelian.nama_produk }}</th>
          <th class="px-4 py-2 border-b">{{ pembelian.jumlah_produk }}</th>
          <th class="px-4 py-2 border-b">{{ pembelian.nama_unit }}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
