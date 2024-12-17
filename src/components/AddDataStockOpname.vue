<!-- AddDataStock.vue -->

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";

const toast = useToast();

// Form state
const newStockOpname = ref({
  id_produk: "",
  physical_stock: "",
  jumlah_loss: "",
  timestamp_created: "",
});

// Options for dropdowns, fetched from the API
const products = ref([]);
const opname = ref([]);
const loss = ref([]);

// Fetch data for dropdowns on component mount
onMounted(async () => {
  try {
    const productResponse = await axios.get("/api/products");
    const supplierResponse = await axios.get("/api/suppliers");
    const unitResponse = await axios.get("/api/units");
    const categoryResponse = await axios.get("/api/categories");

    products.value = productResponse.data;
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
  }
});

// Handle form submission
const addStock = async () => {
  try {
    await axios.post("/api/stocks", newStock.value);
    toast.success("Stock added successfully!");
    resetForm();
  } catch (error) {
    toast.error("Error adding stock.");
    console.error("Error adding stock:", error);
  }
};

// Reset form fields
const resetForm = () => {
  newStockOpname.value = {
    id_produk: "",
    physical_stock: "",
    jumlah_loss: "",
    timestamp_created: "",
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
        ><i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i
      ></RouterLink>
    </div>

    <form @submit.prevent="addStock">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Product Dropdown -->
          <div>
            <label for="id_produk">Product</label>
            <div class="mt-2">
              <select
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
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

          <div>
            <label class="" for="jumlah_stock">Physical Stock Amount</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newStock.physical_stock"
                id="physical_stock"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label class="" for="jumlah_stock">Good Item Amount</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newStock.physical_stock"
                id="physical_stock"
                required
                min="1"
              />
            </div>
          </div>
      
          <!-- Stock Amount -->
          <div>
            <label class="" for="jumlah_stock">Bad Item Amount</label>
            <div class="mt-2">
              <input
                class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
                type="number"
                v-model="newStock.jumlah_stock"
                id="jumlah_stock"
                required
                min="1"
              />
            </div>
          </div>

          <div class="flex justify-center">
            <!-- Submit Button -->
            <button
              type="submit"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
            >
              <i class="pi pi-plus self-center"></i>
              Add Stock Opname
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
