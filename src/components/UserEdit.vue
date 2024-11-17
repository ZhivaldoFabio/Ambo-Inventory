<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const email = ref('');
const newUsername = ref('');
const newEmail = ref('');
const error = ref(null);
const router = useRouter();

// SIGN OUT FUNCTION
const logout = async () => {
  try {
    console.log('Logging Out');

    // Clear the auth token from localStorage
    localStorage.removeItem('authToken', 'userRole');

    // Optionally, make an API call to invalidate the session on the server if applicable
    await axios.post('/api/logout'); // assuming you have a logout API endpoint

    // Redirect the user to the login page
    router.push('/'); // Redirect to the login page or home page
  } catch (err) {
    error.value = 'Error logging out: ' + err.message;
    console.error('Logout error:', err);
  }
};

// Save the updated profile data
const saveProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found. Please log in again.');
    }

    // Send updated user data to the backend
    await axios.put(
      '/api/user',
      {
        username: newUsername.value,
        email: newEmail.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update the local UI state
    username.value = newUsername.value;
    email.value = newEmail.value;
    alert('Profile updated successfully!');
  } catch (err) {
    error.value = 'Error saving profile: ' + err.message;
    console.error('Save profile error:', err);
  }
};

// Fetch user data on mount
onMounted(async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found. Redirecting to login.');
    }

    // Fetch the current user data from the backend
    const response = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Populate form fields with the fetched user data
    const userData = response.data;
    username.value = userData.username || 'Anonymous';
    email.value = userData.email || '';
    newUsername.value = username.value;
    newEmail.value = email.value;
  } catch (err) {
    console.error('Error fetching user data:', err);
    router.push('/'); // Redirect to login page on error
  }
});
</script>

<template>
  <form class="mx-auto overscroll-contain">
    <div class="space-y-12">
      <div class="border-b border-text-800 pb-12">
        <h2 class="text-base font-semibold leading-7 text-text-700">Profile</h2>
        <p class="mt-1 text-sm leading-6 text-text-600">
          This information will be displayed publicly so be careful what you
          share.
        </p>

        <div class="col-span-full">
          <label
            for="photo"
            class="block text-sm font-medium leading-6 text-text-700"
            >Photo</label
          >
          <div class="mt-2 flex items-center gap-x-3">
            <i
              class="pi pi-user h-12 w-12 text-black-500 border border-solid rounded-full text-center content-center"
            />
            <button
              type="button"
              class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-text-700 shadow-sm ring-1 ring-inset ring-accent-600 hover:bg-background-200"
            >
              Change
            </button>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label
              for="username"
              class="block text-sm font-medium leading-6 text-text-700"
              >Username</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="username"
                  id="username"
                  v-model="newUsername"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  :placeholder="username"
                />
              </div>
            </div>
          </div>

          <div class="sm:col-span-4">
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-text-700"
              >Email address</label
            >
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                v-model="newEmail"
                class="block w-full rounded-md border-0 py-1.5 pl-1 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 focus:ring-inset focus:ring-accent-600 sm:text-sm sm:leading-6"
                :placeholder="email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          @click="logout"
          type="button"
          class="rounded-md text-sm font-semibold leading-6 text-text-700 hover:bg-red-200 p-2 px-3"
        >
          Log Out
        </button>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          class="rounded-md text-sm font-semibold leading-6 text-text-700 bg-background-100 hover:bg-background-200 p-2 px-3"
        >
          Cancel
        </button>
        <button
          @click="saveProfile"
          type="button"
          class="rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-white-50 shadow-sm hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
        >
          Save
        </button>
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </form>
</template>

<style scoped></style>
