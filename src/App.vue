<template>
  <DefaultLayout />
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue';
export default {
  name: 'App',
  components: {
    DefaultLayout
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
