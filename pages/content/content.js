import Storage from '../../utils/storage.js'
const baseUrl = 'https://easy-mock.com/mock/5a0cfca31e9be34076f930a6/constellation/proxy'
const diffTime = 60 * 60 * 1000
let frequency = 1
Page({
  onLoad () {
    let lastTimestamp = Storage.get('time')
    let timestamp = (new Date()).valueOf()
    let lastData = Storage.get('poetry')
    // 时间缓存存在且时间差小于1天，取缓存数据
    if (lastTimestamp && lastData && (timestamp - lastTimestamp) <= diffTime) {
      this.setData({
        "source": lastData
      })
    } else {
      this.requestData()
    }
  },

  onReady () {
    let that = this
    setTimeout(function () {
      that.getAllRects()
    }, 200)
    
  },

  data: {
    title: '',
    imageUrl: '',
    content: '',
    name: '',
    author: '',
    src: 'http://oayhezji6.bkt.clouddn.com/bear.png',
    i: 0,
    show: false,
    source: null,
    curPoetry: {},
    typeContent: [],
    cache: [],
    curIndex: 0,
    current: 0,
    rects: []
  },

  // 获取数据
  requestData() {
    let that = this
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: baseUrl + '?=s' + (new Date()).valueOf(),
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
            that.next()
          } else {
            ++frequency
            if (frequency >= 2) {
              wx.showToast({
                title: '数据加载失败',
                icon: 'none'
              })
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
        } else {
          this.requestData()
        }
      }
    })
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
  
  change () {
    let source = this.data.source
    if (!source) return
    let poetry = source.poetry
    if (poetry && poetry.length > 0) {
      let len = poetry.length
      let num = Math.round(Math.random() * (len-1))
      let fn = this.getUnRepeat(num, poetry)
      if (fn()) {
        let cache = this.data.cache
        cache.push(num)
        this.setData({
          curPoetry: poetry[num],
          cache: cache,
          curIndex: cache.length
        })
        
        wx.setNavigationBarTitle({
          title: poetry[num]['title'] || ''
        })
        this.typing(poetry[num]['content'])
      }
    } 
  },

  swiperChange (e) {
    let current = e.detail.current
    this.setData({
      current: current
    })
  },

  toPage (event) {
    let tag = event.currentTarget.dataset.tag
    let source = this.data.source
    let current = this.data.current
    if (!source) return
    let poetry = source.poetry
    if (poetry && poetry.length > 0) {
      let len = poetry.length - 1
      if (tag == 'next') {
        this.setData({
          current: current >= len ? 0 : ++current
        })
      }
      if (tag == 'prev') {
        this.setData({
          current: current <= 0 ? 0 : --current
        })
      }
    }
  },
 
  getUnRepeat (num, source) {
    let that = this
    let arr = this.data.cache
    if (arr.length !== source.length) {
      let isRepeat = arr.indexOf(num)
      if (isRepeat !== -1) {
        let fn = function () {
          let newNum = Math.round(Math.random() * (source.length - 1))
          that.getUnRepeat(newNum, source)
        }
        return fn
      } else {
        return function () {
          return true
        }
      }
    } else {
      this.setData({
        cache: [],
        curIndex: 0
      })
      return function () {
        return false
      }
    }
  },
  revert (text) {
    text = text || ''
    return text.split('\|')
  },
  typing (str) {
    let that = this
    this.setData({
      show: false
    })
    let i = this.data.i
    if (i <= str.length) {
      let text = str.slice(0, i++) + '|'
      this.setData({
        i: i,
        typeContent: this.revert(text)
      })

      setTimeout(() => {
        this.typing(str)
      }, 150)
    }
    else {
      this.setData({
        i: 0,
        show: true
      })
    }  
  },

  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.curPoetry.title || '',
      path: '/pages/content/content',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  getAllRects: function () {
    let that = this
    let domClass = '.p-swiper-content-inner'
    wx.createSelectorQuery().selectAll(domClass).boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        rect.width,
        rect.height
      })
    }).exec(function (res) {
      that.setData({
        rects: res
      })
    })
  },

  toSave () {
    let current = this.data.current
    let rects = this.data.rects
    let source = this.data.source
    if (!source) return
    let poetry = source.poetry
    if (!source.poetry) return
    let currCanvas = rects[current]
    let currContent = poetry[current]
    let ctx = wx.createCanvasContext('my-canvas')
    console.log(currContent)
    if (currContent.imageUrl) {
      ctx.drawImage(currContent.imageUrl, 0, 0, 200, 240)
    }
    if (currContent.content) {
      ctx.setFontSize(16)
      ctx.setFillStyle("#444444")
      ctx.fillText(currContent.content)
      ctx.stroke()
    }
    ctx.draw()
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: currCanvas.width,
        height: currCanvas.height,
        canvasId: 'my-canvas',
        success: function (res) {
          console.log(res.tempFilePath)
        }
      })
    }, 200)
    
  }
})
