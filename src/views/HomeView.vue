<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import HomeCards from '@/components/HomeCards.vue';
import DashboardGudang from '@/components/DashboardGudang.vue';
import Penjualan from '@/components/Penjualan.vue';

const isAdmin = ref(false);
const isGudang = ref(false);
const isKaryawan = ref(false);
const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // Fetch user doc from firestore
      try {
        const userDoc = await getDoc(doc(db, 'user', currentUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          isAdmin.value = userData.role === 'Admin'; // Check if the user's role is Admin
          isGudang.value = userData.role === 'Gudang';
          isKaryawan.value = userData.role === 'Karyawan';
          user.value = userData; // Store user data if needed
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
      }
    } else {
      console.log('No user is logged in.');
    }
  });
  //   const currentUser = auth.currentUser;

  //   if (currentUser) {
  //     // Fetch user doc from firestore
  //     const userDoc = await getDoc(doc(db, 'user', currentUser.uid));

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       isAdmin.value = userData.role === 'Admin'; // Check if the user's role is Admin
  //       isGudang.value = userData.role === 'Gudang';
  //       isKaryawan.value = userData.role === 'Karyawan';
  //       user.value = userData; // Store user data if needed
  //     } else {
  //       console.log('No Such Document!');
  //     }
  //   } else {
  //     console.log('No user is logged in.');
  //   }
});
</script>

<template>
  <div class="flex-1 p-4">
    <HomeCards v-if="isAdmin" />
    <DashboardGudang v-if="isGudang" />
    <Penjualan v-if="isKaryawan" />
  </div>
</template>
