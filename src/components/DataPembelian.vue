<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this path if needed

// Reactive variable to store Pembelian data
const pembelians = ref([]);

onMounted(async () => {
  try {
    // Reference to the "Kategori" collection in Firestore
    const PembelianCollection = collection(db, 'Pembelian');

    // Fetch documents from Firestore
    const snapshot = await getDocs(PembelianCollection);

    // Map each document data to Pembelian array
    kategoris.value = snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching pembelians:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Pembelian List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">Kode Pemesanan</th>
          <th class="px-4 py-2 border-b">Tanggal</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">Kategori</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Qty</th>
          <th class="px-4 py-2 border-b">Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pembelian in pembelians"
          :key="pembelian.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ pembelian.kode_pemesanan }}</td>
          <td class="px-4 py-2 border-b">{{ pembelian.tanggal }}</td>
          <td class="px-4 py-2 border-b">{{ pembelian.tanggal }}</td>
          <td class="px-4 py-2 border-b">{{ pembelian.tanggal }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
