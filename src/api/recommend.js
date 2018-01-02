import jsonp from '@/common/js/jsonp';
import {commonParams, options} from './config'

export function getRecommend() {
  console.log('test')
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/p.fcg'

  const data = Object.assign({}, commonParams, {
    // add params here if need.
    planform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
