<!-- Penjualan.vue -->

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Initialize reactive invoice items array
const invoiceItems = ref([{ id_produk: '', jumlah_produk: 1, harga: 0 }]);

// To store available products
const products = ref([]);
const units = ref([]); // For units
const suppliers = ref([]); // For suppliers
const selectedSupplier = ref(''); // For storing selected supplier ID

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

watch(
  () => selectedSupplier.value,
  (newValue) => {
  }
);

// Computed property for total price of each item (harga * qty)
// const itemTotalPrice = computed(() => {
//   return invoiceItems.value.map((item) => ({
//     ...item,
//     total: item.harga * item.jumlah_produk,
//   }));
// });

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
    toast.error('Failed to fetch product data. Please refresh the page.');
  }
}

// Fetch units
async function fetchUnits() {
  try {
    const response = await axios.get('/api/units'); // Replace with your endpoint
    units.value = response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    toast.error('Failed to fetch units. Please refresh the page.');
  }
}

// Fetch suppliers
async function fetchSuppliers() {
  try {
    const response = await axios.get('/api/suppliers'); // Replace with your endpoint
    suppliers.value = response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    toast.error('Failed to fetch suppliers. Please refresh the page.');
  }
}

// Submit invoice to MySQL through the Express API
async function submitInvoice() {
  if (invoiceItems.value.length === 0) {
    toast.error('Please add at least one item before submitting.');
    return;
  }

  if (
    invoiceItems.value.some(
      (item) => !item.id_produk || item.jumlah_produk <= 0
    )
  ) {
    toast.error('Ensure all items have valid products and quantities.');
    return;
  }

  try {
    const invoiceData = {
      id_supplier: selectedSupplier.value,
      total_harga: totalPrice.value,
      tanggal: new Date().toISOString(),
      items: invoiceItems.value.map((item) => ({
        id_produk: item.id_produk,
        id_unit: item.id_unit,
        jumlah_produk: item.jumlah_produk,
        harga: item.harga,
      })),
    };


    const response = await axios.post('/api/pembelian', invoiceData);

    if (response.status === 201) {
      toast.success('Invoice submitted successfully!');
      resetForm();
    }
  } catch (error) {
    console.error('Error submitting invoice:', error);
    toast.error('Failed to submit invoice. Please try again.');
  }
}

// Call fetch functions on mount
fetchProducts();
fetchUnits();
fetchSuppliers();

// Reset form fields
const resetForm = () => {
  selectedSupplier.value = ''; // Clear supplier selection
  invoiceItems.value = [
    { id_produk: '', id_unit: '', jumlah_produk: 1, harga: 0 },
  ]; // Reset to initial state
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Add Purchase Notes</h2>
    <!-- Supplier Dropdown -->
    <div class="mb-4 max-w-52">
      <label for="supplier" class="block text-sm font-body text-gray-800">
        Supplier
      </label>
      <select
        v-model="selectedSupplier"
        id="supplier"
        class="border rounded p-2 w-full"
      >
        <option value="" disabled>Select Supplier</option>
        <option
          v-for="supplier in suppliers"
          :key="supplier.id_supplier"
          :value="supplier.id_supplier"
        >
          {{ supplier.nama_supplier }}
        </option>
      </select>
    </div>
    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b">Product Name</th>
          <th class="px-4 py-2 border-b">Unit</th>
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
          <td class="px-4 py-2 border-b max-w-16">
            <select v-model="item.id_unit" class="border rounded p-1 w-full">
              <option value="" disabled>Select Unit</option>
              <option
                v-for="unit in units"
                :key="unit.id_unit"
                :value="unit.id_unit"
              >
                {{ unit.nama_unit }}
              </option>
            </select>
          </td>
          <td class="px-4 py-2 border-b max-w-20">
            <input
              v-model.number="item.jumlah_produk"
              type="number"
              class="border rounded p-1 w-full"
              placeholder="Quantity"
            />
          </td>
          <td class="px-4 py-2 border-b max-w-full">
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
