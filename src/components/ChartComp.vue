<template>
  <!-- chart header -->
  <div class="wrapper-header">
    <p>차트</p>
  </div>

  <!-- chart tab -->
  <el-tabs
    v-model="activeChart"
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
      <PieChart :chartData="chartGender" />
    </el-tab-pane>

    <el-tab-pane label="성별 + 인종별" name="GenderRace">
      <PieChart :chartData="chartGender" />
    </el-tab-pane>

    <el-tab-pane label="성별 + 민족별" name="GenderEthnicity">
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
      chartGender: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      },
      activeChart: 'gender',
      originData: []
    };
  },
  computed: {
    chartRace() {
      return this.getDataSets2(this.originData, 'race');
    }
  },
  created() {
    this.fetchChartData().then((res) => {
      this.getDataSets(res);
      console.log(res);
      this.originData = res;
    });
  },
  methods: {
    async fetchChartData() {
      const url = '/patient/stats';
      const result = await this.fetchData('get', url);
      return result.stats;
    },
    getDataSets2(origin, type) {
      console.log(origin);
      let labels = [];
      let data = [];
      let backgroundColor = [];

      for (const [index, value] of origin.entries()) {
        // 이미 ele 의 gender가 label에 있으면 같은 index 위치가 매칭되는 녀석이니까 data[index]
        const indexEle = labels.findIndex((ele) => {
          console.log(value[type]);
          return ele === value[type];
        });
        console.log(indexEle);
        // 이미 있으면
        if (indexEle > -1) {
          data[indexEle]++;
        } else {
          // 아직 없으면
          console.log(origin[index][type]);
          labels.push(origin[index][type]);
          data.push(1);
          backgroundColor.push(
            `rgba(${this.getRandomRgb()}, ${this.getRandomRgb()}, ${this.getRandomRgb()}, 0.5)`
          );
        }
      }
      return [data, labels, backgroundColor];
    },
    getDataSets(origin) {
      console.log(origin);
      let labels = [];
      let data = [];
      let backgroundColor = [];

      for (const [index, value] of origin.entries()) {
        // 이미 ele 의 gender가 label에 있으면 같은 index 위치가 매칭되는 녀석이니까 data[index]
        const indexEle = labels.findIndex((ele) => {
          console.log(ele);
          console.log(value.gender);
          console.log(index);
          return ele === value.gender;
        });
        console.log(indexEle);
        // 이미 있으면
        if (indexEle > -1) {
          data[indexEle]++;
        } else {
          // 아직 없으면
          console.log(origin[index]['gender']);
          labels.push(origin[index]['gender']);
          data.push(1);
          backgroundColor.push(
            `rgba(${this.getRandomRgb()}, ${this.getRandomRgb()}, ${this.getRandomRgb()}, 0.5)`
          );
        }
      }
      console.log(data);
      this.chartGender.datasets[0].data = data;
      this.chartGender.labels = labels;
      this.chartGender.datasets[0].backgroundColor = backgroundColor;
      console.log(this.chartGender);
    },
    getRandomRgb() {
      return Math.floor(Math.random() * 256);
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
<style lang="scss">
.el-tabs__content {
  width: 50rem;
  display: contents;
}
</style>
