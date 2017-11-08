Page({
  onLoad (option) {
    let id = Number(option.id) || 0
    this.setData({
      id: id
    })
  },
  onShow () {
    let arr = this.data.lists[this.data.id]
    this.setData({
      curList: arr
    })
  },
  onReady (e) {
    // var that = this
    // // 使用 wx.createAudioContext 获取 audio 上下文 context
    // that.audioCtx = wx.createAudioContext('myAudio')
    // that.audioCtx.setSrc('http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46')
    // that.audioCtx.play();
    
    // setTimeout(function () {
    //     that.setData( {
    //         length: 2
    //     });
    // }, 5000)
  },
  data: {
    x: 0,
    y: 0,
    id: 0,
    curList: null,
    baseUrl: '../../resources/',
    lists: [{
      title: 'tianxie',
      name: '天蝎',
      thumb: [1]
    }, {
      title: 'sheshou',
      name: '射手',
      thumb: [1, 2, 3]
    }, {
        title: 'mojie',
        name: '摩羯',
        thumb: [1, 2, 3]
      }]
  }
})
