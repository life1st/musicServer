<template>
<div class="tab">
  <router-link tag="div" class="item" to="/recommend">
    <span class="link">推荐</span>
  </router-link>
  <router-link tag="div" class="item" to="/singer">
    <span class="link">歌手</span>
  </router-link>
  <router-link tag="div" class="item" to="/rank">
    <span class="link">排行</span>
  </router-link>
  <router-link tag="div" class="item" to="/search">
    <span class="link">搜索</span>
  </router-link>
</div>
</template>

<script>
  export default {
    name: 'tab',
  };
</script>

<style scoped lang="less">
  .tab {
    display: flex;
    justify-content: space-around;
    .item {
      text-align: center;
      padding: 12px 0;
      flex-grow: 1;
      margin: 0 2%;
      span {
        font-size: 14px;
        cursor: default;
      }
    }
    .router-link-active {
      position: relative;
      &:after {
        content: ' ';
        position: absolute;
        left: 2px;
        right: 2px;
        bottom: 1px;
        border-bottom: 2px solid #f00;
        animation: enter .3s ease-in;
      }
    }
  }

  //临时动画hhh
  @keyframes enter {
    0% {
      transform: translateX(-600px) ;
      opacity: 0;
    }
    50% {
      opacity: .8;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
