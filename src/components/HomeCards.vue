<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import axios from 'axios';
import Card from '@/components/Card.vue';
import ProdukTerjual from '@/components/ProdukTerjual.vue';
import ProgressPendapatan from '@/components/ProgressPendapatan.vue';

const stocks = ref([]); // Array to hold the fetched stock data

onMounted(async () => {
  try {
    const response = await axios.get('/api/stocks');
    stocks.value = response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
});

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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 my-4 rounded-lg">
        <!-- 1 -->
        <Card bg="bg-primary-200">
          <div class="flex items-center space-x-2">
            <i class="pi pi-money-bill flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Pendapatan</h1>
          </div>

          <div class="text-3xl mt-14 font-bold place-self-center">
            <!-- Display total_harga here -->
            Rp. {{ formatCurrency(totalHargaSum) }}
          </div>
        </Card>
        <!-- 2 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-box flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Produk yang Terjual</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            {{ totalProdukSum }}
          </div>
        </Card>
        <!-- 3 -->
        <Card>
          <div class="flex items-center space-x-2">
            <i class="pi pi-receipt flex text-xl text-accent-500"></i>
            <h1 class="flex text-xl text-heading">Jumlah Transaksi</h1>
          </div>
          <div class="text-3xl mt-14 font-bold place-self-center">
            <!-- Display total docuement in collection "Invoice" -->
            {{ totalDocuments }}
          </div>
        </Card>

        <!-- 4 -->
        <Card class="col-span-2">
          <div>
            <ProgressPendapatan />
          </div>
        </Card>
        <!-- 5 -->
        <Card>
          <div>
            <ProdukTerjual />
          </div>
        </Card>
        <!-- 6 -->
        <Card class="col-span-3">
          <div class="flex items-center space-x-2">
            <i
              class="pi pi-exclamation-circle flex text-xl text-accent-500"
            ></i>
            <h1 class="flex text-xl text-heading">Stock Menipis</h1>
          </div>
          <div>
            <table
              class="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden"
            >
              <thead>
                <tr class="bg-gray-200 text-left">
                  <th class="px-4 py-2 border-b">No</th>
                  <th class="px-4 py-2 border-b">Nama Produk</th>
                  <th class="px-4 py-2 border-b">Kategori</th>
                  <th class="px-4 py-2 border-b">Supplier</th>
                  <th class="px-4 py-2 border-b">Stock Minimum</th>
                  <th class="px-4 py-2 border-b">Stock Sekarang</th>
                  <th class="px-4 py-2 border-b">Presentase</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stock, index) in stocks"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
                  <td class="px-4 py-2 border-b">{{ stock.nama_produk }}</td>
                  <td class="px-4 py-2 border-b">{{ stock.nama_kategori }}</td>
                  <td class="px-4 py-2 border-b">{{ stock.nama_supplier }}</td>
                  <td class="px-4 py-2 border-b">
                    {{ stock.stock_minimum || 'N/A' }}
                  </td>
                  <td class="px-4 py-2 border-b">{{ stock.jumlah_stock }}</td>
                  <td class="px-4 py-2 border-b">
                    {{
                      stock.stock_minimum > 0
                        ? (
                            (stock.jumlah_stock / stock.stock_minimum) *
                            100
                          ).toFixed(2)
                        : 'N/A'
                    }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <!-- 7 -->
      </div>
    </div>
  </section>
</template>
