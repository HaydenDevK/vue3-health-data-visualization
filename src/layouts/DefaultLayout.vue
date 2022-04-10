<template>
  <el-container>
    <el-header>
      <DefaultHeader />
    </el-header>
    <el-main>
      <ChartComp />
      <TableComp />
    </el-main>
  </el-container>
</template>

<script>
import DefaultHeader from '../components/DefaultHeader.vue';
import TableComp from '../components/TableComp.vue';
import ChartComp from '../components/ChartComp.vue';
export default {
  name: 'DefaultLayout',
  components: {
    DefaultHeader,
    TableComp,
    ChartComp
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  background: var(--primary);
  position: fixed;
  top: 0;
  height: 7.2rem;
  width: 100%;
  z-index: 99;
}
.el-main {
  margin-top: 7.2rem;
}
</style>
