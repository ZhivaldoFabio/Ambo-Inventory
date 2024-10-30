<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this path if needed

// Reactive variable to store suppliers data
const suppliers = ref([]);

onMounted(async () => {
  try {
    // Reference to the "Supplier" collection in Firestore
    const supplierCollection = collection(db, 'Supplier');

    // Fetch documents from Firestore
    const snapshot = await getDocs(supplierCollection);

    // Map each document data to suppliers array
    suppliers.value = snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching suppliers:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Supplier List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">ID Supplier</th>
          <th class="px-4 py-2 border-b">Alamat Kantor</th>
          <th class="px-4 py-2 border-b">No HP</th>
          <th class="px-4 py-2 border-b">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="supplier in suppliers"
          :key="supplier.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ supplier.nama_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.id_supplier }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.alamat_kantor }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.no_hp }}</td>
          <td class="px-4 py-2 border-b">{{ supplier.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
