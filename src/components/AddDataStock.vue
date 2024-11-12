<!-- AddDataStock.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

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
  <div
    class="background-primary container mx-auto px-4 justify-items-start max-w-prose max-h-fit rounded-lg"
  >
    <div class="min-w-full p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-heading">Add New Stock</h2>
        <RouterLink
          :to="{ name: 'stock' }"
          class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md active:ring-2 active:ring-inset active:ring-gray-100"
          ><i
            class="pi pi-angle-left text-primary-700"
            style="font-size: 1.3rem"
          ></i
        ></RouterLink>
      </div>

      <form @submit.prevent="addStock">
        <div class="flex font-body justify-between">
          <div class="space-y-5">
            <!-- Product Dropdown -->
            <div>
              <label for="id_produk">Product</label>
              <div class="mt-2">
                <select
                  class="px-2 max-w-40 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  v-model="newStock.id_produk"
                  id="id_produk"
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

            <!-- Supplier Dropdown -->
            <div>
              <label for="id_supplier">Supplier</label>
              <div class="mt-2">
                <select
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  v-model="newStock.id_supplier"
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
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  v-model="newStock.id_unit"
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
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  v-model="newStock.id_kategori"
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

            <!-- Stock Amount -->
            <div>
              <label class="" for="jumlah_stock">Stock Amount</label>
              <div class="mt-2">
                <input
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  type="number"
                  v-model="newStock.jumlah_stock"
                  id="jumlah_stock"
                  required
                  min="1"
                />
              </div>
            </div>

            <!-- Entry Date -->
            <div>
              <label for="tgl_masuk">Entry Date</label>
              <div class="mt-2">
                <input
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  type="date"
                  v-model="newStock.tgl_masuk"
                  id="tgl_masuk"
                  required
                />
              </div>
            </div>

            <!-- Expiry Date -->
            <div>
              <label for="tgl_exp">Expiry Date</label>
              <div class="mt-2">
                <input
                  class="px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                  type="date"
                  v-model="newStock.tgl_exp"
                  id="tgl_exp"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="max-h-min self-end px-4 py-2 bg-accent-500 text-white rounded-md shadow-md hover:bg-accent-600 hover:ring hover:ring-inset ring-black-800"
          >
            Add Stock
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.background-primary {
  background-color: hsla(144, 46%, 53%, 0.2);
}
</style>
