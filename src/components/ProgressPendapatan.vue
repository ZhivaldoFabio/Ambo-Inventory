<!-- ProgressPendapatan.vue -->

<script setup>
import { ref, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import axios from 'axios';
import { toRaw } from 'vue';

// Import core echarts modules required for bar charts
import { BarChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([BarChart, TooltipComponent, TitleComponent, CanvasRenderer]);

const dates = ref([]);
const prices = ref([]);
const filteredDates = ref([]);
const filteredPrices = ref([]);

// Dropdown options for filters
const filterType = ref('all'); // Default to "all"
const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const years = ref([]); // Populate dynamically based on data

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

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) {
    console.error(`Missing or invalid timestamp: ${timestamp}`);
    return 'Invalid Date'; // Handle missing timestamp
  }
  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date)) {
    console.error(`Invalid timestamp: ${timestamp}`);
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US');
}

// Fetch and prepare invoice data
async function fetchInvoiceData() {
  try {
    const response = await axios.get('/api/progress-pendapatan');
    const dataEntries = response.data;

    // Sort entries by date
    dataEntries.sort(
      (a, b) => new Date(a.tanggal_penjualan) - new Date(b.tanggal_penjualan)
    );

    // Extract unique years for filtering
    years.value = [
      ...new Set(
        dataEntries
          .map((entry) => {
            const formattedDate = formatTimestamp(entry.tanggal_penjualan); // Use the formatTimestamp function
            const date = new Date(formattedDate);

            return isNaN(date) ? null : date.getFullYear(); // Return null for invalid dates
          })
          .filter((year) => year !== null) // Remove invalid years (null)
      ),
    ];

    // Extract dates and prices
    dates.value = dataEntries.map((entry) =>
      formatTimestamp(entry.tanggal_penjualan)
    );
    prices.value = dataEntries.map((entry) => entry.total_harga);

    // Set initial filtered data
    filteredDates.value = [...dates.value];
    filteredPrices.value = [...prices.value];

    // Update chart option
    updateChart(filteredDates.value, filteredPrices.value);
  } catch (error) {
    console.error('Error fetching invoice data:', error);
  }
}

// Update chart dynamically
function updateChart(dates, prices) {
  option.value.xAxis.data = dates;
  option.value.series[0].data = prices;
}

// Apply filters
function applyFilter() {
  if (filterType.value === 'all') {
    // Show all data
    filteredDates.value = [...dates.value];
    filteredPrices.value = [...prices.value];
  } else if (filterType.value.startsWith('month-')) {
    // Filter by month
    const month = filterType.value.split('-')[1];
    filteredDates.value = dates.value.filter((date, index) =>
      date.startsWith(`${month}/`)
    );
    filteredPrices.value = filteredDates.value.map(
      (date) => prices.value[dates.value.indexOf(date)]
    );
  } else if (filterType.value.startsWith('year-')) {
    // Filter by year
    const year = filterType.value.split('-')[1];
    filteredDates.value = dates.value.filter((date, index) =>
      date.endsWith(`/${year}`)
    );
    filteredPrices.value = filteredDates.value.map(
      (date) => prices.value[dates.value.indexOf(date)]
    );
  }

  // Update the chart with filtered data
  updateChart(filteredDates.value, filteredPrices.value);
}

// Watch filter type for changes
watch(filterType, applyFilter);

onMounted(async () => {
  await fetchInvoiceData();
});
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="mb-4 flex space-x-4">
      <select v-model="filterType" class="p-2 border rounded">
        <option value="all">All</option>
        <optgroup label="Monthly">
          <option
            v-for="month in months"
            :key="month.value"
            :value="'month-' + month.value"
          >
            {{ month.label }}
          </option>
        </optgroup>
        <optgroup label="Yearly">
          <option
            v-for="year in years"
            :key="year || 'default-key'"
            :value="'year-' + year"
          >
            {{ year }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Chart -->
    <div v-if="filteredDates.length === 0" class="text-center text-gray-500">
      No data available for the selected filter.
    </div>
    <v-chart v-else :option="option" style="min-height: 32rem; width: 100%" />
    <button @click="filterType = 'all'" class="p-2 border rounded bg-gray-100">
      Clear Filters
    </button>
  </div>
</template>
