<template>
  <div ref="chart" style="width: 100%; min-height: 32rem"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust the import based on your firebase configuration

const chart = ref(null);

onMounted(async () => {
  // Initialize the chart
  const myChart = echarts.init(chart.value);

  // Fetch products and detail invoice data
  const productCollection = collection(db, 'Produk');
  const detailInvoiceCollection = collection(db, 'Detail_Invoice');

  // Fetch all products
  const productSnapshot = await getDocs(productCollection);
  const products = {};

  productSnapshot.forEach((doc) => {
    const data = doc.data();
    products[data.id_produk] = data.nama_produk; // Store product name by id_produk
  });

  // Fetch all detail invoices and calculate totals
  const detailSnapshot = await getDocs(detailInvoiceCollection);
  const salesData = {};

  detailSnapshot.forEach((doc) => {
    const data = doc.data();
    const productId = data.id_produk;
    const quantity = data.jumlah_produk;

    if (products[productId]) {
      // Check if the product exists
      if (!salesData[productId]) {
        salesData[productId] = { name: products[productId], quantity: 0 };
      }
      salesData[productId].quantity += quantity; // Accumulate quantity
    }
  });

  // Prepare data for the pie chart
  const pieData = Object.values(salesData)
    .sort((a, b) => b.quantity - a.quantity) // Sort by quantity
    .slice(0, 10) // Get top 10
    .map((product) => ({
      value: product.quantity,
      name: product.name,
    }));

  // Set up the chart options
  const option = {
    title: {
      text: 'Best Selling Products',
      subtext: 'Top 10 Best Selling Products',
      left: 'center',
      textStyle: {
        fontFamily: 'LXGW WenKai TC, sans-serif',
      },
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'LXGW WenKai TC, sans-serif',
      },
    },
    legend: {
      orient: 'horizontal',
      left: 'left',
      bottom: '0',
      type: 'scroll',
      // height: 32rem,
      textStyle: {
        fontFamily: 'LXGW WenKai TC, sans-serif',
      },
    },
    series: [
      {
        name: 'Sales Quantity',
        type: 'pie',
        radius: '50%',
        data: pieData,
        label: {
          show: true,
          formatter: '({d}%)',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(9, 214, 246, 0.5)',
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#edf7f1',
          borderWidth: 2,
        },
      },
    ],
  };

  // Use the specified configurations
  myChart.setOption(option);

  // Handle window resize
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});
</script>
