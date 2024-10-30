<script setup>
import Card from '@/components/Card.vue';
</script>

<template>
  <Card class="flex">
    <div class="flex items-center space-x-2">
      <i class="pi pi-exclamation-circle flex text-xl text-accent-500"></i>
      <h1 class="flex text-xl text-heading">Data Unit</h1>
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
            <th>Presentase</th>
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
</template>
