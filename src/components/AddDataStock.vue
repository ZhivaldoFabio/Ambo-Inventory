<!-- AddDataStock.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Form state
const newStock = ref({
  id_produk: '',
  id_supplier: '',
  id_unit: '',
  id_kategori: '',
  jumlah_stock: 0,
  tgl_masuk: '',
  tgl_exp: '',
});

// Options for dropdowns, fetched from the API
const products = ref([]);
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);

// Fetch data for dropdowns on component mount
onMounted(async () => {
  try {
    const productResponse = await axios.get(
      'http://localhost:3000/api/products'
    );
    const supplierResponse = await axios.get(
      'http://localhost:3000/api/suppliers'
    );
    const unitResponse = await axios.get('http://localhost:3000/api/units');
    const categoryResponse = await axios.get(
      'http://localhost:3000/api/categories'
    );

    products.value = productResponse.data;
    suppliers.value = supplierResponse.data;
    units.value = unitResponse.data;
    categories.value = categoryResponse.data;
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
});

// Handle form submission
const addStock = async () => {
  try {
    await axios.post('http://localhost:3000/api/stocks', newStock.value);
    toast.success('Stock added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding stock.');
    console.error('Error adding stock:', error);
  }
};

// Reset form fields
const resetForm = () => {
  newStock.value = {
    id_produk: '',
    id_supplier: '',
    id_unit: '',
    id_kategori: '',
    jumlah_stock: 0,
    tgl_masuk: '',
    tgl_exp: '',
  };
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Add New Stock</h2>
    <form @submit.prevent="addStock" class="space-y-4">
      <!-- Product Dropdown -->
      <div>
        <label for="id_produk">Product:</label>
        <select v-model="newStock.id_produk" id="id_produk" required>
          <option value="" disabled>Select Product</option>
          <option
            v-for="product in products"
            :key="product.id_produk"
            :value="product.id_produk"
          >
            {{ product.nama_produk }}
          </option>
        </select>
      </div>

      <!-- Supplier Dropdown -->
      <div>
        <label for="id_supplier">Supplier:</label>
        <select v-model="newStock.id_supplier" id="id_supplier" required>
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

      <!-- Unit Dropdown -->
      <div>
        <label for="id_unit">Unit:</label>
        <select v-model="newStock.id_unit" id="id_unit" required>
          <option value="" disabled>Select Unit</option>
          <option
            v-for="unit in units"
            :key="unit.id_unit"
            :value="unit.id_unit"
          >
            {{ unit.nama_unit }}
          </option>
        </select>
      </div>

      <!-- Category Dropdown -->
      <div>
        <label for="id_kategori">Category:</label>
        <select v-model="newStock.id_kategori" id="id_kategori" required>
          <option value="" disabled>Select Category</option>
          <option
            v-for="category in categories"
            :key="category.id_kategori"
            :value="category.id_kategori"
          >
            {{ category.nama_kategori }}
          </option>
        </select>
      </div>

      <!-- Stock Amount -->
      <div>
        <label for="jumlah_stock">Stock Amount:</label>
        <input
          type="number"
          v-model="newStock.jumlah_stock"
          id="jumlah_stock"
          required
          min="1"
        />
      </div>

      <!-- Entry Date -->
      <div>
        <label for="tgl_masuk">Entry Date:</label>
        <input
          type="date"
          v-model="newStock.tgl_masuk"
          id="tgl_masuk"
          required
        />
      </div>

      <!-- Expiry Date -->
      <div>
        <label for="tgl_exp">Expiry Date:</label>
        <input type="date" v-model="newStock.tgl_exp" id="tgl_exp" />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Stock
      </button>
    </form>
  </div>
</template>
