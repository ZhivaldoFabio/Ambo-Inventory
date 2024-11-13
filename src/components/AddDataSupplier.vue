<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

const toast = useToast();

// Form state
const newSupplier = ref({
  nama_supplier: '',
  alamat: '',
  email: '',
  no_hp: '',
});

// Form validation errors
const errors = ref({});

// Loader state
const isSubmitting = ref(false);

// Handle form submission
const addSupplier = async () => {
  if (isSubmitting.value) return;

  // Clear previous errors
  errors.value = {};

  // Validation
  if (!newSupplier.value.nama_supplier)
    errors.value.nama_supplier = 'Name is required.';
  if (!newSupplier.value.alamat) errors.value.alamat = 'Address is required.';
  if (!newSupplier.value.email) errors.value.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSupplier.value.email))
    errors.value.email = 'Email format is invalid.';
  if (!newSupplier.value.no_hp)
    errors.value.no_hp = 'Phone number is required.';

  // Show validation errors if any
  if (Object.keys(errors.value).length > 0) {
    Object.values(errors.value).forEach((error) => toast.error(error));
    return;
  }

  // Submit data
  isSubmitting.value = true;
  try {
    await axios.post('http://localhost:3000/api/suppliers', newSupplier.value);
    toast.success('Supplier added successfully!');
    resetForm();
  } catch (error) {
    toast.error('Error adding supplier.');
    console.error('Error adding supplier:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form fields
const resetForm = () => {
  newSupplier.value = {
    nama_supplier: '',
    alamat: '',
    email: '',
    no_hp: '',
  };
  toast.info('Form has been reset.');
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-file-plus text-2xl"></i>
        <h2 class="text-2xl font-heading">Add Supplier</h2>
      </div>
      <RouterLink
        :to="{ name: 'supplier' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i
          class="pi pi-angle-left text-primary-700"
          style="font-size: 1.3rem"
        ></i>
      </RouterLink>
    </div>

    <form @submit.prevent="addSupplier">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Name -->
          <div>
            <label for="nama_supplier">New Supplier</label>
            <input
              class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
              type="text"
              v-model="newSupplier.nama_supplier"
              id="nama_supplier"
            />
            <p v-if="errors.nama_supplier" class="text-red-500 text-sm">
              {{ errors.nama_supplier }}
            </p>
          </div>

          <!-- Address -->
          <div>
            <label for="alamat">Address</label>
            <input
              class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
              type="text"
              v-model="newSupplier.alamat"
              id="alamat"
            />
            <p v-if="errors.alamat" class="text-red-500 text-sm">
              {{ errors.alamat }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email">Email</label>
            <input
              class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
              type="email"
              v-model="newSupplier.email"
              id="email"
            />
            <p v-if="errors.email" class="text-red-500 text-sm">
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone Number -->
          <div>
            <label for="no_hp">Phone Number</label>
            <input
              class="w-full p-2 border rounded shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent-500"
              type="tel"
              v-model="newSupplier.no_hp"
              id="no_hp"
            />
            <p v-if="errors.no_hp" class="text-red-500 text-sm">
              {{ errors.no_hp }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              :disabled="isSubmitting"
              class="w-96 px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="pi pi-plus self-center"></i>
              Add Supplier
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
