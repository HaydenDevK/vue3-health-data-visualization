<template>
  <!-- chart header -->
  <div class="wrapper-header">
    <p>차트</p>
  </div>

  <!-- chart tab -->
  <el-tabs
    v-model="activeName"
    type="card"
    class="wrapper-chart-tab"
    @tab-click="handleClick"
  >
    <el-tab-pane label="성별" name="gender">
      <PieChart :chartData="chartGender" />
    </el-tab-pane>

    <el-tab-pane label="인종별" name="race">
      <PieChart :chartData="chartRace" />
    </el-tab-pane>

    <el-tab-pane label="민족별" name="ethnicity">
      <PieChart :chartData="chartEthnicity" />
    </el-tab-pane>

    <el-tab-pane label="성별 + 인종별" name="GenderRace">
      <PieChart :chartData="chartGenderRace" />
    </el-tab-pane>

    <el-tab-pane label="성별 + 민족별" name="GenderEthnicity">
      <PieChart :chartData="chartGenderEthnicity" />
    </el-tab-pane>

    <el-tab-pane label="성별" name="gender">
      <PieChart :chartData="chartGender" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { ref } from 'vue';
import { PieChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import requestMixin from '@/mixins/requestMixin';
export default {
  name: 'ChartComp',
  components: { PieChart },
  mixins: [requestMixin],
  props: {},
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{ data: {} }]
      }
    };
  },
  created() {
    this.fetchChartData().then((res) => {
      this.chartData.datasets.data = this.getChartData(res, 'gender');
      this.chartData.datasets.labels = this.getChartLable(res);
    });
  },
  methods: {
    async fetchChartData() {
      const url = '/patient/stats';
      const result = await this.fetchData('get', url);
      return result.stats;
    },
    getChartData(res, type) {
      console.log(res, type);
    },
    getChartLable(res) {
      console.log(res);
    }
  },
  setup() {
    const options = ref({
      legend: {
        display: true
      },
      title: {
        display: true,
        text: '성별'
      },
      responsive: true,
      maintainAspectRatio: false
    });
    // const chartGender = {
    //   labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
    //   datasets: [
    //     {
    //       data: [30, 40, 60, 70, 5],
    //       backgroundColor: [
    //         '#77CEFF',
    //         '#0079AF',
    //         '#123E6B',
    //         '#97B0C4',
    //         '#A5C8ED'
    //       ]
    //     }
    //   ]
    // };

    return { options };
  }
};
</script>

<style lang="scss" scoped>
.wrapper-header {
  display: flex;
  justify-content: space-between;
  p {
    font-size: 2rem;
    font-weight: bold;
  }
}
.wrapper-chart-tab {
  margin: 0 2.4rem;
  padding: 1.6rem 0;
  .el-tabs__content {
    width: 80%;
    display: flex;
    justify-content: center;
  }
}
</style>
