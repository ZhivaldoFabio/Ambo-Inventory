<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

const currentUser = ref(null); // Track the current logged-in User.
const userRole = ref(null); // Track the user's role

// On mount, fetch the logged-in user's info
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user || null;
    if (user) {
      // Fetch user doc from Firestore here
      const userDoc = await getDoc(doc(db, 'user', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole.value = userData.role; // Get the user's role from Firestore
      }
    }
  });
});
</script>

<template>
  <nav
    :class="['flex', 'min-h-full', 'transition-all', 'duration-300', 'h-full']"
    class="m-2"
  >
    <div>
      <!-- ADMIN -->
      <ul v-if="currentUser && userRole === 'Admin'" class="p-4 rounded-md">
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

      <!-- GUDANG -->

      <ul v-if="currentUser && userRole === 'Gudang'" class="p-4 rounded-md">
        <!-- SIDEBAR TITLE -->
        <li class="text-primary-300 flex items-center space-x-2 mt-5">
          <i class="pi pi-warehouse"></i>
          <span class="text-background-300"> Gudang </span>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/supplier" class="flex items-center space-x-2">
            <span>Supplier</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/stock" class="flex items-center space-x-2">
            <span>Stock</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/produk" class="flex items-center space-x-2">
            <span>Produk</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/unit" class="flex items-center space-x-2">
            <span>Unit</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/kategori" class="flex items-center space-x-2">
            <span>Kategori</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/pembelian" class="flex items-center space-x-2">
            <span>Pembelian</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Karyawan -->

      <ul v-if="currentUser && userRole === 'Karyawan'" class="p-4 rounded-md">
        <!-- SIDEBAR TITLE -->
        <li class="text-primary-300 flex items-center space-x-2 mt-5">
          <i class="pi pi-warehouse"></i>
          <span class="text-background-300"> Karyawan </span>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/home" class="flex items-center space-x-2">
            <span>Penjualan</span>
          </RouterLink>
        </li>
        <li class="p-1 ml-5">
          <RouterLink to="/penjualan" class="flex items-center space-x-2">
            <span>History Penjualan</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>
