<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this path if needed

// Reactive variable to store suppliers data
const stocks = ref([]);
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);
const products = ref([]);

onMounted(async () => {
  try {
    // Fetch documents from each Firestore collection
    const stockSnapshot = await getDocs(collection(db, 'Stock'));
    const supplierSnapshot = await getDocs(collection(db, 'Supplier'));
    const unitSnapshot = await getDocs(collection(db, 'unit'));
    const categorySnapshot = await getDocs(collection(db, 'Kategori'));
    const productSnapshot = await getDocs(collection(db, 'Produk'));

    // Map each document data to the respective arrays
    stocks.value = stockSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    suppliers.value = supplierSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    units.value = unitSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    categories.value = categorySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    products.value = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Helper function to get related data by ID
function getSupplierName(id) {
  const supplier = suppliers.value.find((s) => s.id_supplier === id);
  return supplier ? supplier.nama_supplier : 'N/A';
}

function getProductName(id) {
  const product = products.value.find((p) => p.id_produk === id);
  return product ? product.nama_produk : 'N/A';
}

function getUnitName(id) {
  const unit = units.value.find((u) => u.id_unit === id);
  return unit ? unit.nama_unit : 'N/A';
}

function getCategoryName(id) {
  const category = categories.value.find((c) => c.id_kategori === id);
  return category ? category.nama_kategori : 'N/A';
}

// Format timestamp for display
function formatTimestamp(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleDateString() : 'N/A';
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Stock List</h2>
    <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="px-4 py-2 border-b">No</th>
          <th class="px-4 py-2 border-b">Nama Supplier</th>
          <th class="px-4 py-2 border-b">Nama Produk</th>
          <th class="px-4 py-2 border-b">Unit</th>
          <th class="px-4 py-2 border-b">Kategori</th>
          <th class="px-4 py-2 border-b">Masuk</th>
          <th class="px-4 py-2 border-b">Expired</th>
          <th class="px-4 py-2 border-b">Stock</th>
          <th class="px-4 py-2 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(stock, index) in stocks"
          :key="stock.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">
            {{ getSupplierName(stock.id_supplier) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ getProductName(stock.id_produk) }}
          </td>
          <td class="px-4 py-2 border-b">{{ getUnitName(stock.id_unit) }}</td>
          <td class="px-4 py-2 border-b">
            {{ getCategoryName(stock.id_kategori) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_masuk) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_exp) }}
          </td>
          <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
          <td class="px-4 py-2 border-b">
            <button class="text-blue-500 hover:underline">Edit</button>
            <button class="text-red-500 hover:underline ml-2">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
