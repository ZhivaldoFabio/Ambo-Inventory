<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Card from '@/components/Card.vue';
import ProdukTerjual from '@/components/ProdukTerjual.vue';
import ProgressPendapatan from '@/components/ProgressPendapatan.vue';

const totalHargaSum = ref(0);
const totalDocuments = ref(0);
const totalProdukSum = ref(0);

async function fetchTotalHargaSum() {
  try {
    // Replace with your collection name and document ID
    const invoiceCollectioRef = collection(db, 'Invoice');
    const snapshot = await getDocs(invoiceCollectioRef);

    // Calculate the sum of total_harga from each document
    totalHargaSum.value = snapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.total_harga || 0); // Add total_harga if it exists, otherwise add 0
    }, 0);

    // Set the document count
    totalDocuments.value = snapshot.size; // Number of documents in the collection
  } catch (error) {
    console.error('Error fetching document:', error);
  }
}

async function fetchTotalProdukSum() {
  try {
    // Replace with your collection name and document ID
    const detailInvoiceCollectioRef = collection(db, 'Detail_Invoice');
    const snapshot = await getDocs(detailInvoiceCollectioRef);

    // Calculate the sum of total_harga from each document
    totalProdukSum.value = snapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.jumlah_produk || 0); // Add jumlah_produk if it exists, otherwise add 0
    }, 0);
  } catch (error) {
    console.error('Error fetching document:', error);
  }
}

// Function to format numbers with thousands separator
function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Fetch data when the component is mounted
onMounted(fetchTotalHargaSum);
onMounted(fetchTotalProdukSum);
</script>

<template>
  <!-- Developers and Employers -->
  <section class="py-4 font-body">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5 p-4 my-1 rounded-lg">
        <Card class="col-span-2">
          <ProdukTerjual />
        </Card>

        <Card class="col-span-2">
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
      </div>
    </div>
  </section>
</template>
