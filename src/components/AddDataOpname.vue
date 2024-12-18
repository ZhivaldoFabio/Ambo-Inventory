<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Table rows state
const invoiceItems = ref([
  { id_produk: '', quantity: 1, loss: false, lost: false, reason: '' },
]);

// Product options for dropdown
const products = ref([]);

// Fetch product data for dropdown
onMounted(async () => {
  try {
    const response = await axios.get('/api/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to load products.');
  }
});

// Add a new empty row
const addItem = () => {
  invoiceItems.value.push({
    id_produk: '',
    quantity: 1,
    loss: false,
    lost: false,
    reason: '',
  });
};

// Remove a specific row
const removeItem = (index) => {
  invoiceItems.value.splice(index, 1);
};

// Submit the form
const submitOpname = async () => {
  try {
    // Validation: Ensure all rows are filled
    for (const item of invoiceItems.value) {
      if (!item.id_produk || item.quantity <= 0) {
        toast.error('Please fill all fields before submitting.');
        return;
      }
    }

    // Get the user role from localStorage or from your app state
    const userRole = localStorage.getItem('userRole'); // Assuming userRole is stored after login

    if (!userRole) {
      toast.error('User role not found. Please log in again.');
      return;
    }

    // Send the role along with the request
    const payload = {
      details: invoiceItems.value.map((item) => ({
        id_produk: item.id_produk,
        physical_stock: item.quantity, // Assuming quantity represents physical stock
        jumlah_stock: 0, // Or fetch this from the backend if necessary
        loss: item.loss, // Include loss as a boolean
        lost: item.lost, // Include lost as a boolean
        remarks: item.reason || null,
      })),
    };

    await axios.post('/api/stock-opname', payload, {
      headers: {
        userrole: userRole, // Send the role as part of the header
      },
    });

    toast.success('Stock Opname submitted successfully!');

    // Reset the form
    invoiceItems.value = [
      { id_produk: '', quantity: 1, loss: false, lost: false, reason: '' },
    ];
  } catch (error) {
    console.error('Error submitting opname:', error);
    toast.error('Failed to submit stock opname.');
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Title -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center mb-4 space-x-2">
        <i class="pi pi-file-check text-2xl"></i>
        <h2 class="text-2xl font-heading">Stock Opname</h2>
      </div>
      <RouterLink
        :to="{ name: 'data-opname' }"
        class="text-center content-center w-10 h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
        ><i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i
      ></RouterLink>
    </div>

    <!-- Table -->
    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="px-4 py-2 border-b">Product Name</th>
          <th class="px-4 py-2 border-b">Quantity</th>
          <th class="px-4 py-2 border-b">Loss</th>
          <th class="px-4 py-2 border-b">Reason</th>
          <th class="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in invoiceItems"
          :key="index"
          class="hover:bg-gray-50"
        >
          <!-- Product Dropdown -->
          <td class="px-4 py-2 border-b">
            <select
              v-model="item.id_produk"
              class="border rounded p-1 w-full"
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
          </td>

          <!-- Quantity Input -->
          <td class="px-4 py-2 border-b">
            <input
              v-model.number="item.quantity"
              type="number"
              class="border rounded p-1 w-full"
              min="1"
              placeholder="0"
              required
            />
          </td>

          <!-- Loss Checkbox -->
          <td class="px-4 py-2 border-b text-center">
            <input
              v-model="item.loss"
              type="checkbox"
              class="w-6 h-6 accent-red-500"
            />
          </td>

          <!-- Reason Input -->
          <td class="px-4 py-2 border-b">
            <input
              v-model="item.reason"
              type="text"
              class="border rounded p-1 w-full"
              placeholder="Reason for loss"
              :disabled="!(item.loss || item.lost)"
            />
          </td>

          <!-- Delete Button -->
          <td class="px-4 py-2 border-b text-center">
            <button
              @click="removeItem(index)"
              class="text-red-500 hover:text-red-700"
            >
              <i class="pi pi-trash"></i> Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add Row Button -->
    <div class="flex justify-end mt-4">
      <button
        @click="addItem"
        class="px-4 py-2 bg-secondary-500 text-white rounded"
      >
        Add Item
      </button>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button
        @click="submitOpname"
        class="px-6 py-2 bg-primary-500 text-white rounded"
      >
        Submit Opname
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
