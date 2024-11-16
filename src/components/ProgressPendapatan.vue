<template>
  <v-chart :option="option" style="min-height: 32rem; width: 100%" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { use } from 'echarts/core';

// Import core echarts modules required for bar charts
import { BarChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([BarChart, TooltipComponent, TitleComponent, CanvasRenderer]);

const dates = ref([]);
const prices = ref([]);

const option = ref({
  title: {
    text: 'Pendapatan',
    subtext: 'Progres Pendapatan',
    left: 'center',
    textStyle: {
      fontFamily: 'LXGW WenKai TC, sans-serif',
    },
  },
  tooltip: { trigger: 'axis' },
  textStyle: {
    fontFamily: 'LXGW WenKai TC, sans-serif',
  },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Total Harga',
      type: 'line',
      data: [],
      smooth: true,
      label: {
        show: true, // Enable labels
        position: 'top', // Position labels above the line points
        formatter: '{c}', // Display the value at each point
      },
    },
  ],
});

async function fetchInvoiceData() {
  const invoiceCollection = collection(db, 'Invoice');
  const snapshot = await getDocs(invoiceCollection);

  // Clear existing data
  const dataEntries = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    dataEntries.push({
      date: new Date(data.tanggal.seconds * 1000), // Convert to Date object for sorting
      total_harga: data.total_harga,
    });
  });

  // Sort the entries by date
  dataEntries.sort((a, b) => a.date - b.date);

  // Extract sorted dates and prices
  dates.value = dataEntries.map((entry) => entry.date.toLocaleDateString());
  prices.value = dataEntries.map((entry) => entry.total_harga);

  // Update chart option
  option.value.xAxis.data = dates.value;
  option.value.series[0].data = prices.value;
}

onMounted(fetchInvoiceData);
</script>
