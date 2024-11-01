<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this path if needed

// Reactive variable to store Produk data
const kategoris = ref([]);

onMounted(async () => {
  try {
    // Reference to the "Kategori" collection in Firestore
    const KategoriCollection = collection(db, 'Kategori');

    // Fetch documents from Firestore
    const snapshot = await getDocs(KategoriCollection);

    // Map each document data to Unit array
    kategoris.value = snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching kategoris:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Kategori List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">Nama Kategori</th>
          <th class="px-4 py-2 border-b">ID Kategori</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="kategori in kategoris"
          :key="kategori.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ kategori.nama_kategori }}</td>
          <td class="px-4 py-2 border-b">{{ kategori.id_kategori }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
