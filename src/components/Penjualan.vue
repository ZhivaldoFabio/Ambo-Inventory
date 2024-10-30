<script setup>
import { ref } from 'vue';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust path as needed
import { computed } from 'vue';

// Initialize reactive invoice items array
const invoiceItems = ref([{ id_produk: '', jumlah_produk: 1, harga: 0 }]);

// Computed property for total price
const totalPrice = computed(() =>
  invoiceItems.value.reduce(
    (sum, item) => sum + item.harga * item.jumlah_produk,
    0
  )
);

// Add a new empty item to the table
function addItem() {
  invoiceItems.value.push({ id_produk: '', jumlah_produk: 1, harga: 0 });
}

// Remove an item from the table
function removeItem(index) {
  invoiceItems.value.splice(index, 1);
}

// Format currency for display
function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
}

// Submit invoice to Firestore
async function submitInvoice() {
  try {
    const detailInvoiceIds = []; // Array to store id_detail_invoice for each detail

    // Add invoice details to "Detail_Invoice" collection
    for (let item of invoiceItems.value) {
      const detailInvoiceId = Math.floor(Math.random() * 1000000); // Generate a unique ID
      await addDoc(collection(db, 'Detail_Invoice'), {
        id_detail_invoice: detailInvoiceId,
        id_produk: item.id_produk,
        jumlah_produk: item.jumlah_produk,
        harga: item.harga,
        no_invoice: Math.floor(Math.random() * 1000000), // Example invoice number, replace with your logic
      });

      detailInvoiceIds.push(detailInvoiceId); // Store the generated id_detail_invoice
    }

    // Add main invoice to "Invoice" collection, including related detail IDs
    await addDoc(collection(db, 'Invoice'), {
      id_invoice: Math.floor(Math.random() * 1000000), // Generate unique invoice ID
      tanggal: Timestamp.now(),
      total_harga: totalPrice.value,
      id_detail_invoice: detailInvoiceIds, // Array of related detail IDs
    });

    alert('Invoice submitted successfully!');
  } catch (error) {
    console.error('Error submitting invoice:', error);
    alert('Failed to submit invoice.');
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">POS System</h2>
    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b">Product ID</th>
          <th class="px-4 py-2 border-b">Quantity</th>
          <th class="px-4 py-2 border-b">Price</th>
          <th class="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in invoiceItems"
          :key="index"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">
            <input
              v-model="item.id_produk"
              class="border rounded p-1 w-full"
              placeholder="Product ID"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <input
              v-model.number="item.jumlah_produk"
              type="number"
              class="border rounded p-1 w-full"
              placeholder="Quantity"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <input
              v-model.number="item.harga"
              type="number"
              class="border rounded p-1 w-full"
              placeholder="Price"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <button
              @click="removeItem(index)"
              class="text-red-500 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      @click="addItem"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Add Item
    </button>

    <div class="mt-6">
      <h3 class="text-xl font-semibold">
        Total: {{ formatCurrency(totalPrice) }}
      </h3>
      <button
        @click="submitInvoice"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Submit Invoice
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}
th,
td {
  text-align: left;
  padding: 8px;
}
</style>
