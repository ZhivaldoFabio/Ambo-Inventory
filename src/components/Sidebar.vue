<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const currentUser = ref(null); // Track the current logged-in User.

// On mount, fetch the logged-in user's info
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user || null;
  });
});
</script>

<template>
  <nav
    :class="[
      'flex',
      'min-h-screen',

      'transition-all',
      'duration-300',
      'h-full',
    ]"
    class="m-2"
  >
    <div>
      <ul
        v-if="currentUser && currentUser.uid === 'RNE0WPnwrUcSH1m3vOmN3EVJ2ks2'"
        class="p-4 rounded-md"
      >
        <!-- SIDEBAR TITLE -->
        <li class="text-primary-300 flex items-center space-x-2">
          <i class="pi pi-user"></i>
          <span class="text-background-300"> Admin </span>
        </li>

        <li
          class="p-1 ml-5 hover:shadow-lg hover:shadow-background-200 rounded-lg"
        >
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink
            to="/laporanpembelian"
            class="flex items-center space-x-2"
          >
            <span>Laporan Pembelian</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink
            to="/laporanpenjualan"
            class="flex items-center space-x-2"
          >
            <span>Laporan Penjualan</span>
          </RouterLink>
        </li>
      </ul>
      <ul class="p-4 rounded-md">
        <!-- SIDEBAR TITLE -->
        <li class="text-primary-300 flex items-center space-x-2 mt-5">
          <i class="pi pi-warehouse"></i>
          <span class="text-background-300"> Gudang </span>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Produk</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Unit</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Kategori</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Pembelian</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>
