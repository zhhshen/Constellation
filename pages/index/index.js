//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '点击头像查看惊喜',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  onLoad () {
    let that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(res => {
      //更新数据
      that.setData({
        userInfo: res
      })
    })
  }
})
