import YouMusicApi from 'youtube-music-api'

class YoutubeMusicModel {
  youApi: typeof YouMusicApi = null
  async getYouApi() {
    if (!this.youApi) {
      const instance = new YouMusicApi()
      await instance.initalize()
      this.youApi = instance
    }
    return this.youApi
  }
  
  async search(q: string) {
    console.log(this.youApi())
    return this.youApi().getSearchSuggestions(q)
  }
}
const youtubeMusicModel = new YoutubeMusicModel()
export { youtubeMusicModel }
