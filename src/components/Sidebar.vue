<script setup>
import { ref } from 'vue';

const isSidebarClosed = ref(false);
const activeSubMenu = ref(null); // To track the currently active sub-menu

// Toggle the sidebar open/close state
function toggleSidebar() {
  isSidebarClosed.value = !isSidebarClosed.value;
}

// Toggle the sub-menu
function toggleSubMenu(index) {
  if (activeSubMenu.value === index) {
    activeSubMenu.value = null; // Close the currently active sub-menu
  } else {
    activeSubMenu.value = index; // Set the clicked menu as active
  }
}
</script>

<template>
  <nav
    :class="[
      
      'flex',
      'min-h-screen',
      isSidebarClosed ? 'w-16' : '',
      'transition-all',
      'duration-300',
      'h-full',
    ]"
    class="m-2"
  >
    <ul class="p-4 rounded-md">
      <!-- SIDEBAR TITLE -->
      <li class="text-primary-300 flex items-center space-x-2">
        <i class="pi pi-user"></i>
        <span class="text-background-300"> Admin </span>
      </li>

      <li class="p-1 ml-5">
        <RouterLink to="/home" class="flex items-center space-x-2">
          <span>Dashboard</span>
        </RouterLink>
      </li>
      <li class="p-1 ml-5">
        <RouterLink to="/laporanpembelian" class="flex items-center space-x-2">
          <span>Laporan Pembelian</span>
        </RouterLink>
      </li>
      <li class="p-1 ml-5">
        <RouterLink to="/laporanpenjualan" class="flex items-center space-x-2">
          <span>Laporan Penjualan</span>
        </RouterLink>
      </li>

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
  </nav>
</template>

<style scoped>
/* Add your sidebar styles here */
.close {
  width: 60px;
  /* Any other styles to make the sidebar "closed" */
}

/* Active submenu styling */
.sub-menu {
  display: none;
}

.sub-menu.show {
  display: block;
}
</style>
