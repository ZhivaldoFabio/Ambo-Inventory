<!-- ProgressPendapatan.vue -->

<script setup>
import { ref, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import axios from 'axios';

// Import core echarts modules required for bar charts
import { BarChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([BarChart, TooltipComponent, TitleComponent, CanvasRenderer]);

const dates = ref([]);
const prices = ref([]);
const profits = ref([]);
const filteredDates = ref([]);
const filteredPrices = ref([]);
const filteredProfits = ref([]);
const viewType = ref('revenue'); // 'revenue' or 'profit'

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
    text: viewType.value === 'revenue' ? 'Revenue' : 'Profit',
    subtext: 'To see if we are growing or loosing.',
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
      name: viewType.value === 'revenue' ? 'Total Harga' : 'Profit',
      type: 'line',
      data: [],
      smooth: true,
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
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

    // Process and update chart
    dates.value = dataEntries.map((entry) =>
      formatTimestamp(entry.tanggal_penjualan)
    );
    prices.value = dataEntries.map((entry) => entry.total_harga);
    profits.value = dataEntries.map((entry) => entry.profit); // Include the profit

    // Set initial filtered data
    filteredDates.value = [...dates.value];
    filteredPrices.value = [...prices.value];
    filteredProfits.value = [...profits.value];

    // Update chart option
    updateChart(
      filteredDates.value,
      filteredPrices.value,
      filteredProfits.value
    );
  } catch (error) {
    console.error('Error fetching invoice data:', error);
  }
}

// Update chart data based on viewType
function updateChart(dates, prices, profits) {
  option.value.xAxis.data = dates;
  if (viewType.value === 'revenue') {
    option.value.series[0].data = prices;
  } else if (viewType.value === 'profit') {
    option.value.series[0].data = profits; // Directly use profits here
  }
}

// Apply filters
function applyFilter() {
  if (filterType.value === 'all') {
    // Show all data
    filteredDates.value = [...dates.value];
    filteredPrices.value = [...prices.value];
    filteredProfits.value = [...profits.value];
  } else if (filterType.value.startsWith('month-')) {
    // Filter by month
    const month = filterType.value.split('-')[1];
    const monthData = dates.value
      .map((date, index) => ({
        date,
        price: prices.value[index],
        profit: profits.value[index],
      }))
      .filter((entry) => entry.date.startsWith(`${month}/`)); // Match month

    // No aggregation, just filter by month and retain multiple data points per day
    filteredDates.value = monthData.map((entry) => entry.date);
    filteredPrices.value = monthData.map((entry) => entry.price);
    filteredProfits.value = monthData.map((entry) => entry.profit);
  } else if (filterType.value.startsWith('year-')) {
    // Filter by year
    const year = filterType.value.split('-')[1];
    const yearData = dates.value
      .map((date, index) => ({
        date,
        price: prices.value[index],
        profit: profits.value[index],
      }))
      .filter((entry) => entry.date.endsWith(`/${year}`));

    // No aggregation, just filter by year and retain multiple data points per day
    filteredDates.value = yearData.map((entry) => entry.date);
    filteredPrices.value = yearData.map((entry) => entry.price);
    filteredProfits.value = yearData.map((entry) => entry.profit);
  }

  // Update the chart with filtered data
  updateChart(filteredDates.value, filteredPrices.value, filteredProfits.value);
}

// Watch filter type for changes
watch(filterType, applyFilter);
// Watch for changes in viewType
watch(viewType, () => {
  updateChart(filteredDates.value, filteredPrices.value, filteredProfits.value);
});

// Watch for changes in viewType
watch(viewType, () => {
  // Update the title text dynamically
  option.value.title.text = viewType.value === 'revenue' ? 'Revenue' : 'Profit';
  // Update the series name dynamically
  option.value.series[0].name =
    viewType.value === 'revenue' ? 'Total Harga' : 'Profit';

  // Refresh the chart data
  updateChart(filteredDates.value, filteredPrices.value, filteredProfits.value);
});

onMounted(async () => {
  await fetchInvoiceData();
});
</script>

<template>
  <div>
    <div class="flex justify-between">
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
      <div class="TOMBOLGANTI">
        <div class="mb-4 flex space-x-4">
          <button
            @click="viewType = 'revenue'"
            class="p-2 rounded bg-primary-500 shadow-md hover:bg-primary-400 active:shadow-inner"
            :class="{ 'bg-primary-500': viewType === 'revenue' }"
          >
            Revenue
          </button>
          <button
            @click="viewType = 'profit'"
            class="p-2 rounded bg-secondary-500 shadow-md hover:bg-secondary-400 active:shadow-inner"
            :class="{ 'bg-secondary-500': viewType === 'profit' }"
          >
            Profit
          </button>
        </div>
      </div>
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
