<!-- AddDataProduct.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';
import { toRaw } from 'vue';

const toast = useToast();

// Form state
const newProduct = ref({
  nama_produk: '',
  id_supplier: '',
  id_unit: '',
  id_kategori: '',
  harga_beli: '',
  harga_jual: '',
  stock_minimum: '',
});

// Options for dropdowns, fetched from the API
const products = ref([]); // Already existing products to check for duplicates
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);

// Fetch data for dropdowns and existing products on component mount
onMounted(async () => {
  try {
    const productResponse = await axios.get('/api/products');
    const supplierResponse = await axios.get('/api/suppliers');
    const unitResponse = await axios.get('/api/units');
    const categoryResponse = await axios.get('/api/categories');

    products.value = productResponse.data; // List of existing products to check against
    suppliers.value = supplierResponse.data;
    units.value = unitResponse.data;
    categories.value = categoryResponse.data;
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
});

// Check if a product already exists in the database
const checkDuplicateProduct = (product) => {
  return products.value.some((existingProduct) => {
    const rawExistingProduct = toRaw(existingProduct); // Unwrap the reactive proxy

    // Ensure correct type comparison and check each property individually
    return (
      rawExistingProduct.nama_produk === product.nama_produk &&
      rawExistingProduct.harga_beli === product.harga_beli &&
      rawExistingProduct.harga_jual === product.harga_jual &&
      rawExistingProduct.id_kategori === product.id_kategori &&
      rawExistingProduct.id_unit === product.id_unit &&
      rawExistingProduct.id_supplier === product.id_supplier &&
      rawExistingProduct.stock_minimum === product.stock_minimum
    );
  });
};

// Handle adding the product
const handleAddProduct = async () => {
  if (checkDuplicateProduct(newProduct.value)) {
    toast.error('Product already exists with the same details.');
    return; // Don't submit the form if it's a duplicate
  }

  try {
    // Ensure stock_minimum is a valid number
    if (
      isNaN(Number(newProduct.value.stock_minimum)) ||
      newProduct.value.stock_minimum < 0
    ) {
      toast.error('Minimum stock must be a non-negative number.');
      return;
    }

    await axios.post('/api/products', newProduct.value);
    toast.success('Product added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding product.');
    console.error('Error adding product:', error);
  }
};

// Reset form fields
const resetForm = () => {
  newProduct.value = {
    nama_produk: '',
    id_supplier: '',
    id_unit: '',
    id_kategori: '',
    harga_beli: '',
    harga_jual: '',
    stock_minimum: '',
  };
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-file-plus text-2xl"></i>
        <h2 class="text-2xl font-heading">Add Product</h2>
      </div>
      <RouterLink
        :to="{ name: 'produk' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
        ><i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i
      ></RouterLink>
    </div>

    <form @submit.prevent="handleAddProduct">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- New Product  -->
          <div>
            <label class="" for="nama_produk">New Product</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="text"
                v-model="newProduct.nama_produk"
                id="nama_produk"
              />
            </div>
          </div>

          <!-- Supplier Dropdown -->
          <div>
            <label for="id_supplier">Supplier</label>
            <div class="mt-2">
              <select
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                v-model="newProduct.id_supplier"
                id="id_supplier"
                required
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
          </div>

          <!-- Unit Dropdown -->
          <div>
            <label for="id_unit">Unit</label>
            <div class="mt-2">
              <select
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                v-model="newProduct.id_unit"
                id="id_unit"
                required
              >
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
          </div>

          <!-- Category Dropdown -->
          <div>
            <label for="id_kategori">Category</label>
            <div class="mt-2">
              <select
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                v-model="newProduct.id_kategori"
                id="id_kategori"
                required
              >
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
          </div>

          <!-- Harga Beli -->
          <div>
            <label class="" for="harga_beli">Buying Price</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newProduct.harga_beli"
                id="harga_beli"
              />
            </div>
          </div>
          <!-- Harga Jual -->
          <div>
            <label class="" for="harga_jual">Selling Price</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newProduct.harga_jual"
                id="harga_jual"
              />
            </div>
          </div>

          <!-- Minimum Stock -->
          <div>
            <label class="" for="harga_jual">Jumlah Minimum Stock</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newProduct.stock_minimum"
                id="harga_jual"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-plus self-center"></i>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.background-primary {
  background-color: hsla(144, 46%, 53%, 0.2);
}
</style>
