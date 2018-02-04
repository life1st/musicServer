<template>
    <header>
      <el-row :gutter="18">
        <el-col :span="3" :offset="2">
          <h1 class="logo">
            豆瓣FM | Douban FM
          </h1>
        </el-col>
        <el-col :span="6" class="desc">
          <span class="title">Yet Another Douban FM.</span>
          <span
            class="download-btn"
            @mouseover="openDig">
            下载豆瓣 FM APP.
          </span>
          <transition name="fade">
            <div
              class="download-app"
              v-show="downloadShow"
              @mouseleave="closeDig">
              <img src="https://img3.doubanio.com/f/fm/1e89298732fbf090aea0812f7fb2af30ad82ab61/pics/fm/landingpage/qr_2@2x.png" alt="app qrcode">
              <p>iPhone · Android</p>
              <a href="https://douban.fm/app" target="_blank">去了解一下豆瓣FM APP ></a>
            </div>
          </transition>
        </el-col>
        <el-col :span="4" :offset="9">
          <div class="user-info">
            <div class="login">
              <div class="avatar"></div>
            </div>
            <div class="unlogin">
              <a href="https://accounts.douban.com/popup/login" target="_blank">登陆/注册</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </header>
</template>

<script>
  import Vue from 'vue';
  import { row, col } from 'element-ui';

  Vue.use(row)
  Vue.use(col)
  export default {
    name: 'vHeader',
    data() {
      return {
        downloadShow: false,
      };
    },
    methods: {
      openDig() {
        this.downloadShow = true;
      },
      closeDig() {
        this.downloadShow = false;
      },
    },
  };
</script>

<style scoped lang="less">
  header {
    font-size: 12px;
    color: #666;
    border-bottom: 1px solid #e3e3e3;
  }
  .logo {
    width: 100px;
    height: 40px;
    background: url("//img3.doubanio.com/dae/staticng/s/bragi/fac999b8062c57ed5308bd24d761678880ebea30/deploy/b6a46d59a094ec51ec67452607965e2c.svg");
    background-size: 100px 40px;
    display: inline-block;
    font-size: 0;
  }
  .desc {
    line-height: 56px;
    position: relative;
    .title {
      font-size: 14px;
    }
    .download-btn {
      display: inline-block;
      height: 100%;
    }
    .download-app {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
      padding: 18px;
      line-height: 18px;
      text-align: center;
      img {
        width: 100px;
      }
      a {
        display: inline-block;
        color: #666;
        margin-top: 28px;
      }
    }
  }
  .user-info {
    height: 56px;
    .unlogin {
      a {
        display: inline-block;
        cursor: pointer;
        margin-top: 18px;
        &:hover {
          color: #000;
        }
      }
    }
  }
</style>
