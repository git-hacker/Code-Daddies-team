//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    map: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        showlocation: true,
    },
    markers: [
      { 
        iconPath: "jpeg.png", 
        id: 0, 
        latitude: 23.099994, longitude: 113.324520, 
        width: 20, 
        height: 20, 
        alpha: .5,
      }
    ],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  // get current location
  // get user info/list of visited grids from Rails API
  // show user marker on current location,

  onLoad: function () {
    this.getLocation()
    
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getLocation: function() {
    let page = this
    type: 'gcj02'
    wx.getLocation({
      success: function (res) {
      let latitude = res.latitude
      let longitude = res.longitude
      let accuracy = res.accuracy
      console.log("Your location is: ")
      console.log("Lat:", latitude)
      console.log("Long: ", longitude)
      page.setData({
        map: {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy
        }
      })
    }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  }
})
