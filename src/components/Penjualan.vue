<!-- Penjualan.vue -->

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

// Initialize reactive invoice items array
const invoiceItems = ref([{ id_produk: '', jumlah_produk: 1, harga: 0 }]);

// To store available products
const products = ref([]);

// Watch for changes in product selection and update price
watch(
  () => invoiceItems.value,
  () => {
    invoiceItems.value.forEach(async (item) => {
      if (item.id_produk) {
        const product = products.value.find(
          (p) => p.id_produk === item.id_produk
        );
        if (product) {
          item.harga = product.harga_jual || 0; // Set price from the selected product
        }
      }
    });
  },
  { deep: true }
);

// Computed property for total price of each item (harga * qty)
const itemTotalPrice = computed(() => {
  return invoiceItems.value.map((item) => ({
    ...item,
    total: item.harga * item.jumlah_produk,
  }));
});

// Computed property for total price
const totalPrice = computed(() =>
  invoiceItems.value.reduce(
    (sum, item) => sum + item.harga * item.jumlah_produk,
    0
  )
);

// Add a new empty item to the table
function addItem() {
  invoiceItems.value.push({ id_produk: '', jumlah_produk: 1, harga: 0 });
}

// Remove an item from the table
function removeItem(index) {
  invoiceItems.value.splice(index, 1);
}

// Format currency for display
function formatCurrency(value) {
  if (value == null || isNaN(value)) {
    return '-'; // Return a placeholder if value is invalid
  }
  return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
}

// Fetch products data from MySQL
async function fetchProducts() {
  try {
    const response = await axios.get('/api/products'); // Endpoint to fetch products
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Submit invoice to MySQL through the Express API
async function submitInvoice() {
  try {
    const invoiceData = {
      total_harga: totalPrice.value,
      tanggal: new Date().toISOString(), // Current timestamp
      items: invoiceItems.value.map((item) => ({
        id_produk: item.id_produk,
        jumlah_produk: item.jumlah_produk,
        harga: item.harga,
      })),
    };

    // Send invoice data to backend API
    const response = await axios.post('/api/penjualan', invoiceData);

    if (response.status === 201) {
      alert('Invoice submitted successfully!');
      resetForm();
    }
  } catch (error) {
    console.error('Error submitting invoice:', error);
    alert('Failed to submit invoice.');
  }
}

// Fetch products when the component is mounted
fetchProducts();

// Reset form fields
const resetForm = () => {
  invoiceItems.value = [{ id_produk: '', jumlah_produk: 1, harga: 0 }]; // Reset to initial state
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">POS System</h2>
    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b">Product ID</th>
          <th class="px-4 py-2 border-b">Quantity</th>
          <th class="px-4 py-2 border-b">Price</th>
          <th class="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in invoiceItems"
          :key="index"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">
            <select v-model="item.id_produk" class="border rounded p-1 w-full">
              <option value="" disabled>Select Product</option>
              <option
                v-for="product in products"
                :key="product.id_produk"
                :value="product.id_produk"
              >
                {{ product.nama_produk }}
              </option>
            </select>
          </td>
          <td class="px-4 py-2 border-b">
            <input
              v-model.number="item.jumlah_produk"
              type="number"
              class="border rounded p-1 w-full"
              placeholder="Quantity"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <!-- Display the price as non-editable -->
            <span class="border rounded p-1 w-full">{{
              formatCurrency(item.harga * item.jumlah_produk)
            }}</span>
          </td>
          <td class="px-4 py-2 border-b">
            <button
              @click="removeItem(index)"
              class="pi pi-trash flex text-red-800 hover:drop-shadow-lg hover:text-red-100"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex w-full justify-end">
      <button
        @click="addItem"
        class="mt-4 px-4 py-2 bg-secondary-500 text-white rounded"
      >
        Add Item
      </button>
    </div>

    <div class="mt-6">
      <h3 class="text-xl font-semibold">
        Total: {{ formatCurrency(totalPrice) }}
      </h3>
      <div class="flex justify-end w-full">
        <button
          @click="submitInvoice"
          class="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
        >
          Submit Invoice
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}
th,
td {
  text-align: left;
  padding: 8px;
}
</style>
