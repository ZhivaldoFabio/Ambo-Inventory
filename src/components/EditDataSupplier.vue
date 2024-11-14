<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const supplierId = route.params.id; // Get the ID from the route

// Reactive object for supplier data
const supplierData = ref({
  nama_supplier: '',
  alamat: '',
  email: '',
  no_hp: '',
});

// Fetch the current supplier data
onMounted(async () => {
  try {
    const supplierResponse = await axios.get(
      `http://localhost:3000/api/suppliers/${supplierId}`
    );

    const supplier = supplierResponse.data;
    supplierData.value = supplier;
  } catch (error) {
    console.error('Error fetching supplier data:', error);
    toast.error('Failed to load supplier details.');
  }
});

// Update the supplier data
const updateSupplier = async () => {
  try {
    const formattedSupplierData = {
      ...supplierData.value,
    };

    await axios.put(
      `http://localhost:3000/api/suppliers/${supplierId}`,
      formattedSupplierData
    );
    toast.success('Supplier updated successfully!');
    router.push({ name: 'supplier' }); // Navigate back to the categories page
  } catch (error) {
    console.error('Error updating supplier:', error);
    toast.error('Failed to update supplier.');
  }
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-pen-to-square text-2xl"></i>
        <h2 class="text-2xl font-heading">Edit Supplier</h2>
      </div>

      <RouterLink
        :to="{ name: 'supplier' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i class="pi pi-angle-left text-primary-700" style="font-size: 1.3rem"></i>
      </RouterLink>
    </div>

    <form @submit.prevent="updateSupplier">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Supplier Name Input -->
          <div class="mb-4">
            <label for="nama_supplier" class="block font-medium mb-1">Supplier Name</label>
            <input
              id="nama_supplier"
              type="text"
              v-model="supplierData.nama_supplier"
              class="w-full p-2 border rounded"
            />
          </div>

           <!-- Address Input -->
           <div class="mb-4">
            <label for="alamat" class="block font-medium mb-1">Address</label>
            <input
              id="alamat"
              type="text"
              v-model="supplierData.alamat"
              class="w-full p-2 border rounded"
            />
          </div>

           <!-- Email Input -->
           <div class="mb-4">
            <label for="email" class="block font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              v-model="supplierData.email"
              class="w-full p-2 border rounded"
            />
          </div>

           <!-- Phone number Input -->
           <div class="mb-4">
            <label for="no_hp" class="block font-medium mb-1">Phone Number</label>
            <input
              id="no_hp"
              type="text"
              v-model="supplierData.no_hp"
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
              Update Supplier
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
