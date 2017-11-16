const baseUrl = 'https://easy-mock.com/mock/5a0cfca31e9be34076f930a6/constellation/zhh'
Page({
  onLoad (option) {
    this.requestData()
  },
  onShow () {
   
  },
  onReady (e) {
    
  },
  data: {
    title: '',
    content: '',
    name: '',
    author: '',
    i: 0,
    show: false,
    source: null
  },
  playAudio () {
    // var that = this
    // // 使用 wx.createAudioContext 获取 audio 上下文 context
    // that.audioCtx = wx.createAudioContext('myAudio')
    // that.audioCtx.setSrc('')
    // that.audioCtx.play();

    // setTimeout(function () {
    //     that.setData( {
    //         length: 2
    //     });
    // }, 5000)
  },
  requestData () {
    wx.request({
      url: baseUrl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let body = res.data
        this.setData({
          "source": body.data
        })
        this.change()
      }
    })
  },
  change() {
    let poetry = this.data.source.poetry
    if (poetry && poetry.length > 0) {
      let len = poetry.length
      let num = Math.round(Math.random() * (len-1))
      this.setData({
        title: poetry[num]['title'],
        name: poetry[num]['name'],
        author: poetry[num]['author'],
      })
      wx.setNavigationBarTitle({
        title: poetry[num]['name'] || ''
      })
    } 
    this.typing(this.data.title)
  },
  revert (text) {
    text = text || ''
    this.setData({
      "content": text.split('\|')
    })
  },
  typing (str) {
    let that = this
    this.setData({
      show: false
    })
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
      this.revert(str)
      this.setData({
        i: 0,
        show: true
      })
    }  
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '',
      path: '/pages/content/content',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
