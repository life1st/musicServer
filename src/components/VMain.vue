<template>
  <div class="vMain">
    <vHeader></vHeader>
    <player></player>
  </div>
</template>

<script>
  import vHeader from '@/components/VHeader';
  import player from '@/components/player';
  export default {
    name: 'vMain',
    components: {
      vHeader,
      player,
    },
  };
</script>

<style scoped lang="less">
  .vMain {
    min-width: 1080px;
  }
</style>
