<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Topbar.vue';
import Sidebar from '@/components/Sidebar.vue';
// import Navigation from '@/components/Navigation.vue';
// Michelle Update
</script>

<template>
  <div class="flex flex-col space-y-4 bg-background-50 min-h-screen">
    <!-- <Navigation v-if="!$route.meta.hideNavbar" /> -->
    <Navbar v-if="!$route.meta.hideNavbar" />
    <div class="flex flex-row">
      <Sidebar v-if="!$route.meta.hideNavbar" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
</style>
