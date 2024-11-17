// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
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
import DetailDataPenjualan from '@/components/DetailDataPenjualan.vue';

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
        allowedRoles: ['Admin', 'Gudang', 'Kasir'],
      },
    },
    {
      path: '/useredit',
      name: 'user-edit',
      component: UserEditView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Admin', 'Gudang', 'Kasir'],
      },
    },
    {
      path: '/laporanpembelian',
      name: 'laporan-pembelian',
      component: LaporanPembelianView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Admin'],
      },
    },
    {
      path: '/laporanpenjualan',
      name: 'laporan-penjualan',
      component: LaporanPenjualanView,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Admin'],
      },
    },
    // -------------------- BAGIAN GUDANG --------------------
    {
      path: '/supplier',
      name: 'supplier',
      component: DataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/add-supplier',
      name: 'add-data-supplier',
      component: AddDataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/edit-supplier/:id',
      name: 'edit-data-supplier',
      component: EditDataSupplier,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/stock',
      name: 'stock',
      component: DataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },

    {
      path: '/add-stock',
      name: 'add-data-stock',
      component: AddDataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/edit-stock/:id',
      name: 'edit-data-stock',
      component: EditDataStock,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/produk',
      name: 'produk',
      component: DataProduk,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/add-produk',
      name: 'add-data-produk',
      component: AddDataProduct,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/edit-produk/:id',
      name: 'edit-data-produk',
      component: EditDataProduct,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/unit',
      name: 'unit',
      component: DataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/add-unit',
      name: 'add-data-unit',
      component: AddDataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/edit-unit/:id',
      name: 'edit-data-unit',
      component: EditDataUnit,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: DataKategori,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/add-kategori',
      name: 'add-data-kategori',
      component: AddDataCategory,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/edit-kategori/:id',
      name: 'edit-data-kategori',
      component: EditDataCategory,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    {
      path: '/pembelian',
      name: 'pembelian',
      component: DataPembelian,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Gudang'],
      },
    },
    // -------------------- BAGIAN Kasir --------------------

    {
      path: '/data-penjualan',
      name: 'data-penjualan',
      component: DataPenjualan,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Kasir'],
      },
    },
    {
      path: '/detail-data-penjualan/:id',
      name: 'detail-data-penjualan',
      component: DetailDataPenjualan,
      meta: {
        requiresAuth: true, // This metadata marks the route as requiring authentication
        allowedRoles: ['Kasir'],
      },
    },

    // -------------------- BAGIAN Belom --------------------

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  setTimeout(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const requiresAuth = to.meta.requiresAuth;
    const allowedRoles = to.meta.allowedRoles;

    if (requiresAuth && !token) {
      return next('/'); // Redirect to login if no token
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return next('/unauthorized'); // Redirect if role is not allowed
    }

    next();
  }, 100); // Adding a small delay to ensure `localStorage` is available
});

export default router;
