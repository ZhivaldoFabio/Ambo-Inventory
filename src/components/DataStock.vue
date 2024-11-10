<!-- DataStock.vue -->

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

// Reactive variable to store suppliers data
const stocks = ref([]);
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);
const products = ref([]);
const newStock = ref({
  id_produk: '',
  id_supplier: '',
  id_unit: '',
  id_kategori: '',
  jumlah_stock: 0,
  tgl_masuk: '',
  tgl_exp: '',
});

onMounted(async () => {
  try {
    const stockResponse = await axios.get(
      'http://localhost:3000/api/all-stocks'
    );
    const supplierResponse = await axios.get(
      'http://localhost:3000/api/suppliers'
    );
    const unitResponse = await axios.get('http://localhost:3000/api/units');
    const categoryResponse = await axios.get(
      'http://localhost:3000/api/categories'
    );
    const productResponse = await axios.get(
      'http://localhost:3000/api/products'
    );

    stocks.value = stockResponse.data;
    suppliers.value = supplierResponse.data;
    units.value = unitResponse.data;
    categories.value = categoryResponse.data;
    products.value = productResponse.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Function to delete stock
async function deleteStock(stockId) {
  try {
    await axios.delete(`http://localhost:3000/api/all-stocks/${stockId}`);
    stocks.value = stocks.value.filter((stock) => stock.id_stock !== stockId); // Remove stock from list
    alert('Stock deleted successfully');
  } catch (error) {
    console.error('Error deleting stock:', error);
  }
}

// Function to update stock
async function updateStock(stockId, updatedStock) {
  try {
    await axios.put(
      `http://localhost:3000/api/all-stocks/${stockId}`,
      updatedStock
    );
    // Update the stock in the list or re-fetch data
    alert('Stock updated successfully');
  } catch (error) {
    console.error('Error updating stock:', error);
  }
}

// Helper function to get the supplier name by ID
function getSupplierName(supplierId) {
  const supplier = suppliers.value.find((s) => s.id_supplier === supplierId);
  return supplier ? supplier.nama_supplier : 'Unknown Supplier';
}

// Helper function to get the product name by ID
function getProductName(productId) {
  const product = products.value.find((p) => p.id_produk === productId);
  return product ? product.nama_produk : 'Unknown Product';
}

// Helper function to get the unit name by ID
function getUnitName(unitId) {
  const unit = units.value.find((u) => u.id_unit === unitId);
  return unit ? unit.nama_unit : 'Unknown Unit';
}

// Helper function to get the category name by ID
function getCategoryName(categoryId) {
  const category = categories.value.find((c) => c.id_kategori === categoryId);
  return category ? category.nama_kategori : 'Unknown Category';
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

// Function to reset the new stock form
function resetForm() {
  newStock.value = {
    id_produk: '',
    id_supplier: '',
    id_unit: '',
    id_kategori: '',
    jumlah_stock: 0,
    tgl_masuk: '',
    tgl_exp: '',
  };
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
          :key="stock.id_stock"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
          <!-- Directly use nama_supplier -->
          <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
          <!-- Directly use nama_produk -->
          <td class="px-4 py-2 border-b">{{ stock.nama_unit }}</td>
          <!-- Directly use nama_unit -->
          <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
          <!-- Directly use nama_kategori -->
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_masuk) }}
          </td>
          <td class="px-4 py-2 border-b">
            {{ formatTimestamp(stock.tgl_exp) }}
          </td>
          <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
          <td class="px-4 py-2 border-b">
            <button
              @click="updateStock(stock.id_stock, newStock)"
              class="text-accent-500 hover:underline"
            >
              Edit
            </button>
            <button
              @click="deleteStock(stock.id_stock)"
              class="text-red-500 hover:underline ml-2"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
