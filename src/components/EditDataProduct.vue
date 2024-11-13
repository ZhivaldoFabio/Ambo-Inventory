<!-- EditDataStock.vue -->

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const stockId = route.params.id; // Get the ID from the route

// Reactive object for stock data
const stockData = ref({
  id_produk: '',
  id_supplier: '',
  id_unit: '',
  id_kategori: '',
  jumlah_stock: 0,
  tgl_masuk: '',
  tgl_exp: '',
});

// Dropdown options for the form
const products = ref([]);
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);

// Fetch the current stock data and dropdown options
onMounted(async () => {
  try {
    // Fetch stock details
    const stockResponse = await axios.get(
      `http://localhost:3000/api/stocks/${stockId}`
    );

    // Format dates before setting them in the reactive stockData object
    const stock = stockResponse.data;
    stock.tgl_masuk = new Date(stock.tgl_masuk).toLocaleDateString('en-CA'); // Format as yyyy-MM-dd
    stock.tgl_exp = new Date(stock.tgl_exp).toLocaleDateString('en-CA'); // Format as yyyy-MM-dd

    // Assign formatted stock data
    stockData.value = stock;

    // Fetch options for dropdowns
    const [productRes, supplierRes, unitRes, categoryRes] = await Promise.all([
      axios.get('http://localhost:3000/api/products'),
      axios.get('http://localhost:3000/api/suppliers'),
      axios.get('http://localhost:3000/api/units'),
      axios.get('http://localhost:3000/api/categories'),
    ]);

    products.value = productRes.data;
    suppliers.value = supplierRes.data;
    units.value = unitRes.data;
    categories.value = categoryRes.data;
  } catch (error) {
    console.error('Error fetching stock or dropdown data:', error);
    toast.error('Failed to load stock details or options.');
  }
});

// Update the stock data
const updateStock = async () => {
  try {
    // Revert the date format back to ISO before sending it to the server if necessary
    const formattedStockData = {
      ...stockData.value,
      tgl_masuk: new Date(stockData.value.tgl_masuk).toISOString(),
      tgl_exp: new Date(stockData.value.tgl_exp).toISOString(),
    };

    await axios.put(
      `http://localhost:3000/api/stocks/${stockId}`,
      formattedStockData
    );
    toast.success('Stock updated successfully!');
    router.push({ name: 'stock' }); // Navigate back to the Stock page
  } catch (error) {
    console.error('Error updating stock:', error);
    toast.error('Failed to update stock.');
  }
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-pen-to-square text-2xl"></i>
        <h2 class="text-2xl font-heading">Edit Stock</h2>
      </div>

      <RouterLink
        :to="{ name: 'stock' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
        ><i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i
      ></RouterLink>
    </div>

    <form @submit.prevent="updateStock">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Product Dropdown -->
          <div>
            <label for="id_produk">Product</label>
            <div>
              <select
                id="id_produk"
                v-model="stockData.id_produk"
                required
                class="w-full p-2 border rounded"
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

          <!-- Supplier Dropdown -->
          <div class="mb-4">
            <label for="id_supplier" class="block font-medium mb-1"
              >Supplier</label
            >
            <select
              id="id_supplier"
              v-model="stockData.id_supplier"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!stockData.id_supplier">
                Select Supplier
              </option>
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
          <div class="mb-4">
            <label for="id_unit" class="block font-medium mb-1">Unit</label>
            <select
              id="id_unit"
              v-model="stockData.id_unit"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!stockData.id_unit">
                Select Unit
              </option>
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
          <div class="mb-4">
            <label for="id_kategori" class="block font-medium mb-1"
              >Category</label
            >
            <select
              id="id_kategori"
              v-model="stockData.id_kategori"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!stockData.id_kategori">
                Select Category
              </option>
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
          <div class="mb-4">
            <label for="jumlah_stock" class="block font-medium mb-1"
              >Stock Amount</label
            >
            <input
              id="jumlah_stock"
              type="number"
              v-model="stockData.jumlah_stock"
              required
              min="1"
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Entry Date -->
          <div class="mb-4">
            <label for="tgl_masuk" class="block font-medium mb-1"
              >Entry Date</label
            >
            <input
              id="tgl_masuk"
              type="date"
              v-model="stockData.tgl_masuk"
              required
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Expiry Date -->
          <div class="mb-4">
            <label for="tgl_exp" class="block font-medium mb-1"
              >Expiry Date</label
            >
            <input
              id="tgl_exp"
              type="date"
              v-model="stockData.tgl_exp"
              :min="stockData.tgl_masuk"
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="flex justify-center">
            <!-- Submit Button -->
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-pencil self-center"></i>
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
