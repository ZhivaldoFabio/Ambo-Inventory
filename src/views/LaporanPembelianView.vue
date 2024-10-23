<script setup></script>

<template>
  <section class="flex justify-around">
    <div class="col-span-2 row-span-2">
      <div class="flex justify-between items-center space-x-2">
        <div class="flex items-center space-x-2">
          <i class="pi pi-exclamation-circle flex text-xl text-accent-500"></i>
          <h1 class="flex text-xl text-heading">Data Laporan Pembelian</h1>
        </div>
        <div class="flex items-center space-x-2">
          <input
            class="p-2 rounded-lg shadow-inner"
            type="date"
            placeholder="Tanggal Awal"
          />
          <i class="pi pi-arrow-right"></i>
          <input
            class="p-2 rounded-lg shadow-inner"
            type="date"
            placeholder="Tanggal Akhir"
          />
          <button
            class="p-2 bg-accent-300 rounded-lg shadow-sm hover:shadow-lg hover:shadow-accent-200 hover:ring-2 hover:ring-accent-300"
          >
            <i class="pi pi-search pr-2"></i>Cari
          </button>
        </div>
      </div>
      <div class="">
        <table class="table-auto border-collapse w-full text-left">
          <thead class="border-b-2 mb-2">
            <tr>
              <th>No</th>
              <th>Kode Pemesanan</th>
              <th>Tanggal</th>
              <th>Nama Supplier</th>
              <th>Kategori</th>
              <th>Nama Produk</th>
              <th>QTY</th>
              <th>Unit</th>
              <th>Harga Unit</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
            </tr>
            <tr>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
              <td>Shampoo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
