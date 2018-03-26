import Storage from '../../utils/storage.js'
import Config from '../../config.js'
const app = getApp()
let frequency = 1
Page({
  onLoad () {
    let that = this
    let lastTimestamp = Storage.get('time')
    let timestamp = (new Date()).valueOf()
    let lastData = Storage.get('poetry')
    app.getConfig(function (config) {
      config = config || Config
      const baseUrl = config.baseUrl
      const diffTime = config.refreshTime
      // 时间缓存存在且时间差小于diffTime，取缓存数据
      if (lastTimestamp && lastData && (timestamp - lastTimestamp) <= diffTime) {
        that.setData({
          "source": lastData
        })
      } else {
        that.requestData(baseUrl)
      }
    })
    
  },

  onReady () {
    this.getLastCurr()
  },
  
  data: {
    src: '',
    source: null,
    current: 0,
    rects: []
  },

  // 获取数据
  requestData(baseUrl) {
    let that = this
    baseUrl = baseUrl || ''
    wx.showLoading({
      title: '数据加载中',
    })
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
          if (body && body.data) {
            that.setData({
              "source": body.data
            })
            let timestamp = (new Date()).valueOf()
            Storage.set('time', timestamp)
            Storage.set('poetry', body.data)
            frequency = 0
          } else {
            ++frequency
            if (frequency >= 2) {
              wx.showToast({
                title: '数据加载失败',
                icon: 'none'
              })
              frequency = 0
            } else {
              that.requestData()
            }
          }
        }
      },
      fail: (res) => {
        ++frequency
        if (frequency >= 2) {
          wx.showToast({
            title: '数据加载失败',
            icon: 'none'
          })
          frequency = 0
        } else {
          this.requestData()
        }
      }
    })
  },
  // 获取上一次的浏览记录
  getLastCurr () {
    let lastCurr = Storage.get('current')
    let source = this.data.source
    if (!source) return
    let poetry = source.poetry
    if (poetry && poetry.length > 0) {
      if (lastCurr && lastCurr <= poetry.length - 4) {
        this.setData({
          current: Number(lastCurr)
        })
      } else {
        this.setData({
          current: 0
        })
      }
    }
  },
  // touch页面
  swiperChange (e) {
    let current = e.detail.current
    let source = this.data.source
    if (!source) return
    let poetry = source.poetry
    this.setData({
      current: current
    })
    wx.setNavigationBarTitle({
      title: poetry[current]['title']
    })
    Storage.set('current', current)
  },
  // 分页
  toPage (event) {
    let tag = event.currentTarget.dataset.tag
    let source = this.data.source
    let current = this.data.current
    if (!source) return
    let poetry = source.poetry
    if (poetry && poetry.length > 0) {
      let len = poetry.length - 1
      if (tag == 'next') {
        let curr = current >= len ? 0 : ++current
        this.setData({
          current: curr
        })
        wx.setNavigationBarTitle({
          title: poetry[curr]['title']
        })
        Storage.set('current', curr)
      }
      if (tag == 'prev') {
        let curr = current <= 0 ? 0 : --current
        this.setData({
          current: curr
        })
        wx.setNavigationBarTitle({
          title: poetry[curr]['title']
        })
        Storage.set('current', curr)
      }
    }
  },
  // 分享操作
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let source = this.data.source
    let current = this.data.current
    if (!source) return
    let poetry = source.poetry
    let imageUrl = ''
    let title = ''
    if (poetry && poetry.length > 0) {
      imageUrl = poetry[current]['imageUrl']
      title = poetry[current]['title']
    }
    return {
      title: title,
      path: '/pages/content/content',
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  // 预览图片
  previewImage (e) {
    let currImage = e.target.dataset.src
    let source = this.data.source
    if (!source) return
    let poetry = source.poetry
    let urls = poetry.map(function (p) {
      return p.imageUrl
    })
    wx.previewImage({
      current: currImage,
      urls: urls || [currImage]
    })
  }
})
