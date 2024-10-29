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
    {
      path: '/tambah-supplier',
      name: 'tambah-supplier',
      component: TambahSupplierView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-unit',
      name: 'tambah-unit',
      component: TambahUnitView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-kategori',
      name: 'tambah-kategori',
      component: TambahKategoriView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-stock',
      name: 'tambah-stock',
      component: TambahStockView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-produk',
      name: 'tambah-produk',
      component: TambahProdukView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-pembelian',
      name: 'tambah-pembelian',
      component: TambahPembelianView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tambah-penjualan',
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
