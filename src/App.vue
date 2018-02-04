<template>
  <div id="app">
    <vMain></vMain>
  </div>
</template>

<script>
  import vMain from '@/components/VMain';

  export default {
    name: 'app',
    components: {
      vMain,
    },
  };
</script>

<style lang="less">
  @import "common/css/reset";
  @import "common/css/animation";

  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #FAFAFA;
  }
</style>
