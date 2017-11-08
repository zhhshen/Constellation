Page({
  onReady (e) {
  },
  data: {
    xzLists: [{
      name: '天蝎座',
    }, {
      name: '摩羯座'
    }, {
      name: '射手座'
    }]
  },
  tapView (e) {
    let id = Number(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../content/content?id='+ id
    })
  }
})
