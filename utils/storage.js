const prefix = '_zhh_'
module.exports = {
  set: function (key, data) {
    try {
      wx.setStorageSync(prefix + key, JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  },
  get: function (key) {
    try {
      var value = wx.getStorageSync(prefix + key)
      if (value) {
        return JSON.parse(value)
      }
    } catch (e) {
      return null
    }
  },
  clear: function (key) {
    try {
      wx.removeStorageSync(prefix + key)
    } catch (e) {
      console.log(e)
    }
  }
}