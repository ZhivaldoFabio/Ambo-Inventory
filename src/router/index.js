import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import UserEditView from '@/views/UserEditView.vue';
import LaporanPembelianView from '@/views/LaporanPembelianView.vue';
import LaporanPenjualanView from '@/views/LaporanPenjualanView.vue';
import TambahSupplierView from '@/components/TambahSupplierView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {hideNavbar: true},
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/useredit',
      name: 'user-edit',
      component: UserEditView,
      meta: { requiresAuth: true },
    },
    {
      path: '/laporanpembelian',
      name: 'laporan-pembelian',
      component: LaporanPembelianView,
      meta: { requiresAuth: true },
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
      path: '/laporanpenjualan',
      name: 'laporan-penjualan',
      component: LaporanPenjualanView,
      meta: { requiresAuth: true },
    },

    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;
