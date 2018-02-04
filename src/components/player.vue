<template>
    <div class="player">
      <div class="lrc-box" v-show="lrcShow">

      </div>
      <div class="song-info">
        <div class="title">
          Banjo Laura (Radio Edit) (Naujas)
        </div>
        <div class="singer">
          Lauris Reiniks
        </div>
        <div class="control-box">
          <div class="song-length">
            00:00
          </div>
          <div class="volume">
            <div class="icon"></div>

          </div>
          <div class="btn-group">
            <label for="showLrc">
              <svg title="Title" viewBox="0 0 20 20" height="20" width="20" class="icon" style="vertical-align: middle;">
                <desc>Icon</desc>
                <g id="icon" fill="none" fill-rule="evenodd">
                  <g id="ci" fill="#B9B9B9">
                    <path d="M2 7.5c0-.276.229-.5.5-.5h11c.276 0 .5.232.5.5 0 .276-.229.5-.5.5h-11a.505.505 0 0 1-.5-.5zm1 3c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 10.5zm0 3c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 13.5zm-1 3c0-.276.233-.5.503-.5h5.994c.278 0 .503.232.503.5 0 .276-.233.5-.503.5H2.503A.507.507 0 0 1 2 16.5zm1-12c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 4.5zM9.5 4c-.303 0-.5.255-.5.5s.197.5.5.5H16v11l-3.5.044c-.328 0-.5.15-.5.456 0 .308.172.5.5.5H16c.497 0 1-.5 1-1V5c0-.5-.505-1-1-1H9.5zm4.5 6.604a.601.601 0 0 0-.596-.604H9.597a.602.602 0 0 0-.597.604v2.791c0 .333.269.605.597.605h3.807a.602.602 0 0 0 .596-.605v-2.79zM10 11h3v2h-3v-2z" id="Combined-Shape">
                    </path>
                  </g>
                </g>
              </svg>
            </label>
            <input type="checkbox" id="showLrc">
            <span>下</span>
            <span>+</span>
            <span>分享</span>
          </div>
        </div>
        <div class="buttons">
          <label for="star"
                 @click="toggieStar">
            <svg viewBox="0,0,30,30" height="26" width="26" class="icon icon-heart" style="vertical-align: middle;"><desc></desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M22,0 C18.9359565,0 16.5821582,1.72596986 15,3.5 C13.4530656,1.72596986 11.0993172,0 8,0 C3.7559698,0 0,3.9236383 0,9 C0,12.0105248 0.844640658,15.0729547 2.5,18 C6.88109125,25.6681877 15.0243286,28.9632358 15,29 C15.0243286,28.9631844 22.9314319,25.7540044 27.5,18 C29.1765036,15.1251042 30.0352238,12.2324468 30,9 C30.0352238,3.9236383 26.2791541,0 22,0 Z" id="b" :fill="starColor"></path></g></svg>
          </label>
          <input type="checkbox" id="star">
          <label for="delete">
            <svg title="Title" viewBox="0,0,30,30" height="26" width="26" class="icon" style="vertical-align: middle;"><desc>Icon</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M19.0000002,2.99518936 L25.5501576,2.99518936 C27.2676993,2.99518936 27.9974555,4.25794694 27.9974555,5.16641446 L27.9974556,7.00000017 L2,7.00000017 L2,5.07556186 C2,4.18983672 2.59870784,2.99518936 4.31630844,2.99518936 L11,2.99518936 L11,1.5 C11,0.5 11.5,0 12.5,0 L17.5,0 C18.5,0 18.9999997,0.5 19,1.5 L19.0000002,2.99518936 Z M4.23383579,27.9351249 C4.2446828,28.8186284 4.84627924,29.9939828 6.54778618,30 L23.4857474,30 C25.1313687,29.9939828 25.8684938,28.8317828 25.9256175,27.9351249 L27.4668952,8 L2.53056032,8 L4.23383579,27.9351249 Z M11,25 C10,25 10,24.5 10,24 L10,13 C10,12.5 10,12 11,12 C12,12 12,12.5 12,13 L12,24 C12,24.5 12,25 11,25 Z M19,25 C18,25 18,24.5 18,24 L18,13 C18,12.5 18,12 19,12 C20,12 20,12.5 20,13 L20,24 C20,24.5 20,25 19,25 Z" fill="#4A4A4A"></path></g></svg>
          </label>
          <input type="checkbox" id="delete">
          <label for="play" @click="toggetPlayStauts">
            <svg v-show="playStatus" title="Title" viewBox="15 8 10 13" height="22" width="22" class="icon" style="vertical-align: middle;"><desc>Icon</desc><path d="M16.2404248,8.16131117 L24.4883398,13.8012748 C25.1705534,14.1855546 25.1705534,14.8143854 24.4883398,15.1986903 L16.2404248,20.8387042 C15.5581861,21.222984 15,20.8967404 15,20.1136905 L15,8.88632486 C15,8.1032498 15.5581861,7.7770062 16.2404248,8.16131117 Z" stroke="none" fill="#4a4a4a" fill-rule="evenodd"></path></svg>
            <svg v-show="!playStatus" title="Title" viewBox="61 0 22 22" height="22" width="22" class="icon icon-pause" style="vertical-align: middle;"><desc>Icon</desc><path d="M61,1.00246167 C61,0.448817378 61.4509752,0 61.990778,0 L66.009222,0 C66.5564136,0 67,0.43945834 67,1.00246167 L67,20.9975383 C67,21.5511826 66.5490248,22 66.009222,22 L61.990778,22 C61.4435864,22 61,21.5605417 61,20.9975383 L61,1.00246167 Z M77,1.00246167 C77,0.448817378 77.4509752,0 77.990778,0 L82.009222,0 C82.5564136,0 83,0.43945834 83,1.00246167 L83,20.9975383 C83,21.5511826 82.5490248,22 82.009222,22 L77.990778,22 C77.4435864,22 77,21.5605417 77,20.9975383 L77,1.00246167 Z" stroke="none" fill="#4a4a4a" fill-rule="evenodd"></path></svg>
          </label>
          <input type="checkbox" id="play">
          <label for="playNext">
            <svg title="Title" viewBox="0,0,30,30" height="22" width="22" class="icon" style="vertical-align: middle;"><desc>Icon</desc><g id="Page-1" fill="none" fill-rule="evenodd"><g id="Fill-1-Copy-8-+-Path-Copy-6-+-Oval-3-Copy-2" fill="#4A4A4A"><path d="M4.722 1.347l18.973 12.148c1.497.828 1.497 2.182 0 3.01L4.722 28.653C3.225 29.48 2 28.778 2 27.09V2.91C2 1.22 3.225.52 4.722 1.346zM25 28.5c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" id="Fill-1-Copy-8"></path><path id="Path-Copy-6" d="M23 4h4v22.5h-4z"></path><path d="M25 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" id="Oval-3-Copy-2"></path></g></g></svg>
          </label>
          <input type="checkbox" id="playNext">
        </div>
      </div>
      <div class="song-cover">
        <img src="https://img1.doubanio.com/lpic/s3207717.jpg" alt="song-cover">
      </div>
    </div>
</template>

<script>
  export default {
    name: 'player',
    data() {
      return {
        lrcShow: false,
        star: false,
        starColor: '#4A4A4A',
        playStatus: false
      };
    },
    methods: {
      toggieStar() {
        this.star = !this.star;
        setTimeout(() => {
          this.star ? this.starColor = '#FF2C56' : this.starColor = '#4A4A4A';
        },100)
      },
      toggetPlayStauts() {
        this.playStatus = !this.playStatus
      }
    },
  };
</script>

<style scoped lang="less">
  .player {
    display: flex;
    justify-content: space-around;
    width: 800px;
    margin: 0 auto;
    .song-info {
      .title {
        font-size: 25px;
        font-weight: 400;
        color: #333;
      }
    }
    .control-box {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #96CBA0;
    }
    .btn-group {
      input {
        display: none;
      }
    }
    .song-cover {
      width: 240px;
      height: 240px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 240px;
        height: 240px;
      }
    }
    .buttons {
      input {
        display: none;
      }
    }
  }
</style>
