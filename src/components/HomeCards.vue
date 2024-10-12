<script setup>
import { RouterLink } from 'vue-router';
import Card from '@/components/Card.vue';
</script>

<template>
  <!-- Developers and Employers -->
  <section class="py-4 font-body">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 my-4 rounded-lg">
        <!-- 1 -->
        <Card bg="bg-primary-200">
          <div class="flex items-center space-x-2">
            <i class="pi pi-money-bill flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Pendapatan</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            Rp. 20.000.000
          </div>
        </Card>
        <!-- 2 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-wallet flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Pengeluaran</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            Rp. 20.000.000
          </div>
        </Card>
        <!-- 3 -->
        <Card class="row-span-3">
          <div class="flex items-center space-x-2">
            <i class="pi pi-chart-bar flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Top 10 Produk Terjual</h1>
          </div>
          <div class="flex">
            <div class="grow">
              <div
                class="max-w-full my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 1
              </div>
              <div
                class="max-w-80 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 2
              </div>
              <div
                class="max-w-64 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 3
              </div>
              <div
                class="max-w-48 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 4
              </div>
              <div
                class="max-w-40 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 5
              </div>
              <div
                class="max-w-32 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 6
              </div>
              <div
                class="max-w-32 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 7
              </div>
              <div
                class="max-w-28 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 8
              </div>
              <div
                class="max-w-24 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 9
              </div>
              <div
                class="max-w-20 my-4 p-1 rounded-lg bg-accent-500 text-text-950"
              >
                Item 10
              </div>
            </div>
            <div>
              <div class="max-w-full my-4 p-1 rounded-lg text-text-950">
                XX %
              </div>
              <div class="max-w-80 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-64 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-48 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-40 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-32 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-32 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-28 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-24 my-4 p-1 rounded-lg text-text-950">XX %</div>
              <div class="max-w-20 my-4 p-1 rounded-lg text-text-950">XX %</div>
            </div>
          </div>
        </Card>
        <!-- 4 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-receipt flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Jumlah Transaksi</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            Rp. 20.000.000
          </div>
        </Card>
        <!-- 5 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-shopping-cart flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Jumlah Pesanan</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">147</div>
        </Card>
        <!-- 6 -->
        <Card class="col-span-2 row-span-2">
          <div class="flex items-center space-x-2">
            <i
              class="pi pi-exclamation-circle flex text-xl text-accent-500"
            ></i>
            <h1 class="flex text-xl text-heading">Stock Menipis</h1>
          </div>
          <div>
            <table class="table-auto border-collapse w-full text-left">
              <thead class="border-b-2 mb-2">
                <tr>
                  <th>Checkbox</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Supplier</th>
                  <th>Stock Minimum</th>
                  <th>QTY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Checkbox</td>
                  <td>Sunsilk</td>
                  <td>Shampoo</td>
                  <td>Pabrik</td>
                  <td>20</td>
                  <td>120</td>
                </tr>
                <tr>
                  <td>Checkbox</td>
                  <td>Sunsilk</td>
                  <td>Shampoo</td>
                  <td>Pabrik</td>
                  <td>20</td>
                  <td>120</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <!-- 7 -->
        <Card class="max-h-40">
          <div class="flex items-center space-x-2">
            <i class="pi pi-user flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Customer</h1>
          </div>
          <div class="text-2xl mt-5 font-bold text-right">1.453.415</div>
        </Card>
      </div>
    </div>
  </section>
</template>
