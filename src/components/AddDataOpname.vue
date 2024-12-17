<!-- AddDataOpname.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

const toast = useToast();

// Form state
const newStockOpname = ref({
  id_produk: '',
  physical_stock: 0,
  good_item: 0,
  bad_item: 0,
  jumlah_loss: 0,
  timestamp_created: '',
});

// Options for dropdowns
const products = ref([]);

// Fetch product data for dropdown
onMounted(async () => {
  try {
    const productResponse = await axios.get('/api/products');
    products.value = productResponse.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

// Calculate loss dynamically
const calculateLoss = () => {
  newStockOpname.value.jumlah_loss =
    newStockOpname.value.physical_stock - newStockOpname.value.good_item;
};

// Handle form submission
const addStockOpname = async () => {
  try {
    // Prepare payload
    const payload = {
      id_produk: newStockOpname.value.id_produk,
      physical_stock: newStockOpname.value.physical_stock,
      good_item: newStockOpname.value.good_item,
      bad_item: newStockOpname.value.bad_item,
      jumlah_loss: newStockOpname.value.jumlah_loss,
      timestamp_created: new Date().toISOString(),
    };

    // Send data to the backend
    await axios.post('/api/opname', payload);

    toast.success('Stock opname added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding stock opname.');
    console.error('Error:', error);
  }
};

// Reset form fields
const resetForm = () => {
  newStockOpname.value = {
    id_produk: '',
    physical_stock: 0,
    good_item: 0,
    bad_item: 0,
    jumlah_loss: 0,
    timestamp_created: '',
  };
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-file-plus text-2xl"></i>
        <h2 class="text-2xl font-heading">Add Stock Opname</h2>
      </div>
      <RouterLink
        :to="{ name: 'stock' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i>
      </RouterLink>
    </div>

    <form @submit.prevent="addStockOpname">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Product Dropdown -->
          <div>
            <label for="id_produk">Product</label>
            <div class="mt-2">
              <select
                v-model="newStockOpname.id_produk"
                id="id_produk"
                class="w-full p-2 border rounded shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-accent-500"
                required
              >
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
          </div>

          <!-- Physical Stock -->
          <div>
            <label for="physical_stock">Physical Stock Amount</label>
            <input
              v-model.number="newStockOpname.physical_stock"
              @input="calculateLoss"
              id="physical_stock"
              type="number"
              min="0"
              class="w-full p-2 border rounded shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          <!-- Good Item -->
          <div>
            <label for="good_item">Good Item Amount</label>
            <input
              v-model.number="newStockOpname.good_item"
              @input="calculateLoss"
              id="good_item"
              type="number"
              min="0"
              class="w-full p-2 border rounded shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          <!-- Bad Item -->
          <div>
            <label for="bad_item">Bad Item Amount</label>
            <input
              v-model.number="newStockOpname.bad_item"
              id="bad_item"
              type="number"
              min="0"
              class="w-full p-2 border rounded shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          <!-- Loss Amount (Read-Only) -->
          <div>
            <label for="jumlah_loss">Loss Amount</label>
            <input
              v-model="newStockOpname.jumlah_loss"
              id="jumlah_loss"
              type="number"
              class="w-full p-2 border rounded shadow-sm bg-gray-100"
              readonly
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-plus"></i>
              Add Stock Opname
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
