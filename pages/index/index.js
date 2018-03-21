//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '点击头像查看',
    userInfo: {
      avatarUrl: 'http://oayhezji6.bkt.clouddn.com/bear.png'
    },
    prepare: 'prepare'
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../content/content'
    })
  },
  onLoad () {
    //调用应用实例的方法获取全局数据
    let that = this
    app.getUserInfo(res => {
      //更新数据
      that.setData({
        userInfo: res
      })
    })
    wx.navigateTo({
      url: '../content/content'
    })
  }
})
