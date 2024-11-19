<template>
  <div ref="chart" style="width: 100%; min-height: 32rem; z-index: 2;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios'; // Import axios for API requests

const chart = ref(null);

onMounted(async () => {
  // Initialize the chart
  const myChart = echarts.init(chart.value);

  // Fetch sales data from the API
  try {
    const response = await axios.get('/api/sales-data');
    const salesData = response.data;

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
        orient: 'vertical',
        bottom: '0%',
        type: 'plain',
        textStyle: {
          fontFamily: 'LXGW WenKai TC, sans-serif',
        },
        height: '25%',
      },
      series: [
        {
          name: 'Sales Quantity',
          type: 'pie',
          radius: '50%',
          data: salesData,
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
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
});
</script>
