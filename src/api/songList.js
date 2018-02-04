import jsonp from 'jsonp'

let url = 'https://api.douban.com/v2/fm/playlist';
let parmas = {
  apikey: '02646d3fb69a52ff072d47bf23cef8fd',
  app_name: 'radio_iphone',
  from: 'mainsite',
  pt: '0.0',
  kbps: 128,
  formats: 'aac',
  alt: 'json',
  channel: 10,/*填写对应的channel id*/
  client: 's:mobile|y:iOS 10.2|f:115|d:b88146214e19b8a8244c9bc0e2789da68955234d|e:iPhone7,1|m:appstore',
  client_id: '02646d3fb69a52ff072d47bf23cef8fd',
  icon_cate: 'xlarge',
  udid: 'b88146214e19b8a8244c9bc0e2789da68955234d',
  douban_udid: 'b635779c65b816b13b330b68921c0f8edc049590',
  version: 115
}
