<template>
  <div class="header">
    <span class="icon">
      <img src="./icon.png" alt="logo">
    </span>
    <h1>RPi-Music</h1>
  </div>
</template>

<script>
    export default {
      name: 'm-header',
    };
</script>

<style scoped lang="less">

  p {
    font-size: 12px;
    color: #f00;
  }
  .header {
    @h: 48px;
    background-color: #222;
    text-align: center;
    .icon {
      display: inline-block;
      height: @h;
      vertical-align: top;
      img {
        height: @h;
      }
    }
    h1 {
      color: #fff;
      display: inline-block;
      line-height: @h;
      font-size: 18px;
      font-weight: 500;
    }
  }
</style>
