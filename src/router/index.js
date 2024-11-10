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
import TambahSupplierView from '@/views/TambahSupplierView.vue';
import TambahUnitView from '@/views/TambahUnitView.vue';
import TambahKategoriView from '@/views/TambahKategoriView.vue';
import TambahPembelianView from '@/views/TambahPembelianView.vue';
import TambahPenjualanView from '@/views/TambahPenjualanView.vue';
import TambahProdukView from '@/views/TambahProdukView.vue';
import TambahStockView from '@/views/TambahStockView.vue';
import DataProduk from '@/components/DataProduk.vue';
import DataUnit from '@/components/DataUnit.vue';
import DataKategori from '@/components/DataKategori.vue';
import DataPembelian from '@/components/DataPembelian.vue';
import DataSupplier from '@/components/DataSupplier.vue';
import DataStock from '@/components/DataStock.vue';

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
      path: '/stock',
      name: 'stock',
      component: DataStock,
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
      path: '/unit',
      name: 'unit',
      component: DataUnit,
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
      path: '/tambahunit',
      name: 'tambah-unit',
      component: TambahUnitView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambahkategori',
      name: 'tambah-kategori',
      component: TambahKategoriView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambahstock',
      name: 'tambah-stock',
      component: TambahStockView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambahproduk',
      name: 'tambah-produk',
      component: TambahProdukView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambahpembelian',
      name: 'tambah-pembelian',
      component: TambahPembelianView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambahpenjualan',
      name: 'tambah-penjualan',
      component: TambahPenjualanView,
      meta: { requiresAuth: true },
    },
    {
      path: '/laporanpenjualan',
      name: 'laporan-penjualan',
      component: LaporanPenjualanView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
      },
    },
    {
      path: '/tambahsupplier',
      name: 'tambah-supplier',
      component: TambahSupplierView,
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
