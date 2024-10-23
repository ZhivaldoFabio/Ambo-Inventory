<script setup>
import { RouterLink, useRoute } from 'vue-router';
import logo from '@/assets/logo.png';
import { auth } from '@/firebase';
import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const username = ref('');
const email = ref('');

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      email.value = user.email; // Get email from Firebase Authentication

      // Option 1: If using `displayName` from Firebase Auth
      if (user.displayName) {
        username.value = user.displayName; // Get username from Firebase Auth
      }
    } else {
      // If user is not logged in, reset values
      username.value = '';
      email.value = '';

      // Option 2: If using Firestore to store username
      // const userDoc = await getDoc(doc(db, 'users', user.uid));
      // if (userDoc.exists()) {
      //   username.value = userDoc.data().username; // Get username from Firestore
      // }
    }
  });
});
</script>

<template>
  <nav class="bg-background-50 sticky top-0">
    <div class="mx-auto max-w-screen px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/home">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span
              class="hidden md:block text-primaryBright text-2xl font-bold ml-2"
              >Depot Es Ambo</span
            >
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <div class="rounded-lg p-2">
                <i class="pi pi-search"></i>
              </div>
              <div class="rounded-lg p-2">
                <button class="">
                  <i class="pi pi-bell"></i>
                </button>
              </div>

              <div>
                <RouterLink to="/useredit">
                  <p>{{ username }}</p>
                  <p>{{ email }}</p>
                </RouterLink>
              </div>

              <!-- <RouterLink
                to="/home"
                :class="[
                  isActiveLink('/home')
                    ? 'bg-accent-500'
                    : 'hover:bg-text-800 hover:text-text-50',
                  'text-text-50',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Home
              </RouterLink> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
