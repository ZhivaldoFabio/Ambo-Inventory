<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const unitId = route.params.id; // Get the ID from the route

// Reactive object for unit data
const unitData = ref({
  nama_unit: '',
});

// Fetch the current unit data and dropdown options
onMounted(async () => {
  try {
    // Fetch unit details
    const unitResponse = await axios.get(
      `http://localhost:3000/api/units/${unitId}`
    );

    const unit = unitResponse.data;
    unitData.value = unit;

    // Optionally fetch more options for dropdowns if needed
    const [unitRes] = await Promise.all([
      axios.get('http://localhost:3000/api/units'),
    ]);

  } catch (error) {
    console.error('Error fetching unit or dropdown data:', error);
    toast.error('Failed to load unit details or options.');
  }
});

// Update the unit data
const updateUnit = async () => {
  try {
    const formattedUnitData = {
      ...unitData.value,
    };

    await axios.put(
      `http://localhost:3000/api/units/${unitId}`,
      formattedUnitData
    );
    toast.success('Unit updated successfully!');
    router.push({ name: 'unit' }); // Navigate back to the Unit page
  } catch (error) {
    console.error('Error updating unit:', error);
    toast.error('Failed to update unit.');
  }
};
</script>

<template>
  <div class="min-w-[50rem] max-w-full mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <i class="pi pi-pen-to-square text-2xl"></i>
        <h2 class="text-2xl font-heading">Edit Unit</h2>
      </div>

      <RouterLink
        :to="{ name: 'unit' }"
        class="text-center place-content-center min-w-10 min-h-10 bg-primary-500 rounded-md shadow-md hover:bg-primary-400 hover:shadow-2xl active:bg-primary-600"
      >
        <i class="pi pi-angle-left text-primary-700" style="font-size: 1.3rem"></i>
      </RouterLink>
    </div>

    <form @submit.prevent="updateUnit">
      <div class="font-body w-full">
        <div class="space-y-5">
          <!-- Unit Name Input -->
          <div class="mb-4">
            <label for="nama_unit" class="block font-medium mb-1">Unit Name</label>
            <input
              id="nama_unit"
              type="text"
              v-model="unitData.nama_unit"
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
              Update Unit
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
