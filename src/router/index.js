// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import UserEditView from '@/views/UserEditView.vue';
import LaporanPembelianView from '@/views/LaporanPembelianView.vue';
import LaporanPenjualanView from '@/views/LaporanPenjualanView.vue';
import DataPenjualan from '@/components/DataPenjualan.vue';
import DataProduk from '@/components/DataProduk.vue';
import AddDataProduct from '@/components/AddDataProduct.vue';
import DataUnit from '@/components/DataUnit.vue';
import AddDataUnit from '@/components/AddDataUnit.vue';
import DataKategori from '@/components/DataKategori.vue';
import AddDataCategory from '@/components/AddDataCategory.vue';
// import EditDataCategory from '@/components/EditDataCategory.vue';
import EditDataProduct from '@/components/EditDataProduct.vue';
import EditDataUnit from '@/components/EditDataUnit.vue';
import EditDataCategory from '@/components/EditDataCategory.vue';
import EditDataSupplier from '@/components/EditDataSupplier.vue';
import DataPembelian from '@/components/DataPembelian.vue';
import DataSupplier from '@/components/DataSupplier.vue';
import AddDataSupplier from '@/components/AddDataSupplier.vue';
import DataStock from '@/components/DataStock.vue';
import AddDataStock from '@/components/AddDataStock.vue';
import EditDataStock from '@/components/EditDataStock.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/useredit',
      name: 'user-edit',
      component: UserEditView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/laporanpembelian',
      name: 'laporan-pembelian',
      component: LaporanPembelianView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    // -------------------- BAGIAN GUDANG --------------------
    {
      path: '/supplier',
      name: 'supplier',
      component: DataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/add-supplier',
      name: 'add-data-supplier',
      component: AddDataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-supplier/:id',
      name: 'edit-data-supplier',
      component: EditDataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/stock',
      name: 'stock',
      component: DataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/penjualan',
      name: 'penjualan',
      component: DataPenjualan,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/add-stock',
      name: 'add-data-stock',
      component: AddDataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-stock/:id',
      name: 'edit-data-stock',
      component: EditDataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/produk',
      name: 'produk',
      component: DataProduk,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/add-produk',
      name: 'add-data-produk',
      component: AddDataProduct,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-produk/:id',
      name: 'edit-data-produk',
      component: EditDataProduct,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/unit',
      name: 'unit',
      component: DataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/add-unit',
      name: 'add-data-unit',
      component: AddDataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-unit/:id',
      name: 'edit-data-unit',
      component: EditDataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: DataKategori,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/add-kategori',
      name: 'add-data-kategori',
      component: AddDataCategory,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-kategori/:id',
      name: 'edit-data-kategori',
      component: EditDataCategory,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/edit-kategori/:id',
      name: 'edit-data-kategori',
      component: EditDataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/pembelian',
      name: 'pembelian',
      component: DataPembelian,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    // -------------------- BAGIAN KARYAWAN --------------------

    // {
    //   path: '/home',
    //   name: 'tambah-unit',
    //   component: TambahUnitView,
    //   meta: { requiresAuth: true },
    // },

    // -------------------- BAGIAN Belom --------------------

    
    {
      path: '/laporanpenjualan',
      name: 'laporan-penjualan',
      component: LaporanPenjualanView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },

    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Wait for Firebase to check auth state
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // If the user is already logged in and tries to access the login page ('/'), redirect to '/home'
      if (to.path === '/') {
        next('/home');
      } else {
        // If authenticated and not accessing '/', allow access to the requested route
        next();
      }
    } else {
      // If the route requires authentication and the user is not logged in, redirect to login ('/')
      if (requiresAuth) {
        next('/');
      } else {
        // For routes that don't require authentication, allow access
        next();
      }
    }
    unsubscribe(); // Stop the listener once we get the auth state
  });
});

export default router;
