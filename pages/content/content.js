var source = require('../../resources/data.js');
Page({
  onLoad (option) {
  },
  onShow () {
   
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
    this.change(source.poetry)
    this.typing(this.data.title)
  },
  data: {
    title: '',
    content: '',
    i: 0
  },
  change (arr) {
    let len = arr.length
    let num = Math.round(Math.random() * len)
    this.setData({
      title: arr[num]['title']
    })
  },
  revert (text) {
    text = text || ''
    this.setData({
      "content": text.split('\|')
    })
  },
  typing (str) {
    let that = this
    let i = this.data.i
    if (i <= str.length) {
      let text = str.slice(0, i++) + '|'
      this.revert(text)
      this.setData({
        i: i
      })
      setTimeout(() => {
        this.typing(str)
      }, 150)
    }
    else {
      this.revert(text)
      this.setData({
        i: 0
      })
    }  
  }
})
