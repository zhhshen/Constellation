//app.js
import Config from './config.js'
const baseUrl = Config.configUrl
App({
  onLaunch: function () {
  },
  onShow: function () {
  },
  getConfig (cb) {
    var that = this
    wx.showLoading({
      title: '数据加载中',
    })
    if (this.globalData.config) {
      wx.hideLoading()
      typeof cb == "function" && cb(this.globalData.config)
    } else {
      wx.request({
        url: baseUrl + '?s=' + (new Date()).valueOf(),
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          wx.hideLoading()
          if (res.statusCode == 200) {
            let body = res.data
            that.globalData.config = body.data
            typeof cb == "function" && cb(that.globalData.config)
          } else {
            wx.showToast({
              title: '数据加载失败',
              icon: 'none'
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '数据加载失败',
            icon: 'none'
          })
        }
      })
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo: null,
    config: null
  }
})