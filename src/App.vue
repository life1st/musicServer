<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view/>
  </div>
</template>

<script>
  import MHeader from '@/components/m-header/main';
  import Tab from '@/components/tab/main';

  export default {
    name: 'app',
    components: {
      MHeader,
      Tab,
    },
  };
</script>

<style lang="less">
  @import "common/css/reset.less";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
