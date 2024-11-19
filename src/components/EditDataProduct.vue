<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const productId = route.params.id; // Get the ID from the route

// Reactive object for stock data
const productData = ref({
  nama_produk: '',
  id_supplier: '',
  id_unit: '',
  id_kategori: '',
  harga_beli: '',
  harga_jual: '',
});

// Dropdown options for the form
const suppliers = ref([]);
const units = ref([]);
const categories = ref([]);

// Fetch the current stock data and dropdown options
onMounted(async () => {
  try {
    // Fetch stock details
    const productResponse = await axios.get(
      `http://localhost:3000/api/products/${productId}`
    );

    // Assign formatted stock data
    productData.value = productResponse.data;

    // Fetch options for dropdowns
    const [supplierRes, unitRes, categoryRes] = await Promise.all([
      axios.get('http://localhost:3000/api/suppliers'),
      axios.get('http://localhost:3000/api/units'),
      axios.get('http://localhost:3000/api/categories'),
    ]);

    suppliers.value = supplierRes.data;
    units.value = unitRes.data;
    categories.value = categoryRes.data;
  } catch (error) {
    console.error('Error fetching product or dropdown data:', error);
    toast.error('Failed to load product details or options.');
  }
});

// Update the stock data
const updateProduct = async () => {
  // Validate the price fields
  if (isNaN(productData.value.harga_beli) || isNaN(productData.value.harga_jual)) {
    toast.error('Please enter valid numbers for the prices.');
    return;
  }

  try {
    // Revert the date format back to ISO before sending it to the server if necessary
    const formattedProductData = {
      ...productData.value,
    };

    await axios.put(
      `http://localhost:3000/api/products/${productId}`,
      formattedProductData
    );
    toast.success('Product updated successfully!');
    router.push({ name: 'produk' }); // Navigate back to the Stock page
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product.');
  }
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-pen-to-square text-2xl"></i>
        <h2 class="text-2xl font-heading">Edit Product</h2>
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

    <form @submit.prevent="updateProduct">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Product Name -->
          <div class="mb-4">
            <label for="nama_produk" class="block font-medium mb-1"
              >Product Name</label
            >
            <input
              id="nama_produk"
              type="text"
              v-model="productData.nama_produk"
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Supplier Dropdown -->
          <div class="mb-4">
            <label for="id_supplier" class="block font-medium mb-1"
              >Supplier</label
            >
            <select
              id="id_supplier"
              v-model="productData.id_supplier"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!productData.id_supplier">
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
              v-model="productData.id_unit"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!productData.id_unit">
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
              v-model="productData.id_kategori"
              required
              class="w-full p-2 border rounded"
            >
              <option value="" disabled v-if="!productData.id_kategori">
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

          <!-- Buying Price -->
          <div class="mb-4">
            <label for="harga_beli" class="block font-medium mb-1"
              >Purchase Price</label
            >
            <input
              id="harga_beli"
              type="text"
              v-model="productData.harga_beli"
              class="w-full p-2 border rounded"
            />
          </div>

          <!-- Selling Price -->
          <div class="mb-4">
            <label for="harga_jual" class="block font-medium mb-1"
              >Selling Price</label
            >
            <input
              id="harga_jual"
              type="text"
              v-model="productData.harga_jual"
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
              Update Product
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px
}
</style>
