<script setup>

</script>

<template>
  <!-- Add Stock Form -->
  <div>
    <h3 class="text-xl font-semibold mt-6 mb-4">Add New Stock</h3>
    <form @submit.prevent="addStock">
      <label>
        Produk:
        <select v-model="newStock.id_produk">
          <option
            v-for="product in products"
            :key="product.id_produk"
            :value="product.id_produk"
          >
            {{ product.nama_produk }}
          </option>
        </select>
      </label>
      <label>
        Supplier:
        <select v-model="newStock.id_supplier">
          <option
            v-for="supplier in suppliers"
            :key="supplier.id_supplier"
            :value="supplier.id_supplier"
          >
            {{ supplier.nama_supplier }}
          </option>
        </select>
      </label>
      <label>
        Unit:
        <select v-model="newStock.id_unit">
          <option
            v-for="unit in units"
            :key="unit.id_unit"
            :value="unit.id_unit"
          >
            {{ unit.nama_unit }}
          </option>
        </select>
      </label>
      <label>
        Kategori:
        <select v-model="newStock.id_kategori">
          <option
            v-for="category in categories"
            :key="category.id_kategori"
            :value="category.id_kategori"
          >
            {{ category.nama_kategori }}
          </option>
        </select>
      </label>
      <label>
        Jumlah Stock:
        <input type="number" v-model="newStock.jumlah_stock" />
      </label>
      <label>
        Tanggal Masuk:
        <input type="date" v-model="newStock.tgl_masuk" />
      </label>
      <label>
        Tanggal Expired:
        <input type="date" v-model="newStock.tgl_exp" />
      </label>
      <button
        type="submit"
        class="mt-4 text-white bg-blue-500 py-2 px-4 rounded"
      >
        Add Stock
      </button>
    </form>
  </div>
</template>
