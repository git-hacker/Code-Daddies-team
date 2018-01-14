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
        latitude: 30.575614,
        longitude: 104.055387,
        accuracy: 0,
        showlocation: true,
    },
    userLocation: {
      latitude: 0,
      longitude: 0,
    },
    fogs: [ ],
    markers: [ ],
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
    let fogs = this.data.fogs
    var i = 0;
    var markers = []
    for(i; i <= fogs.length; i++) {
      markers.push(fogs[i])
    }
    let page = this
    // this.setData({markers: markers})

    console.log(fogs)
    wx.request({
      method: 'get',
      url: app.globalData.baseUrl + app.globalData.getUrl,
      success: function (res) {
        let fogs = []
        fogs.push(res.data)
        console.log(res.data)
        page.setData({
          fogs: fogs
        })
      }
    })
      setInterval(this.postCurrentLocation, 15000)

  },

  postCurrentLocation: function() {
    // POST request to send those coordinates
    this.getUserCurrentLocation
    console.log("User's current location: ")
    console.log(this.data.userLocation)
    wx.request({
      method: 'post',
      data: this.data.userLocation,
      url: app.globalData.baseUrl + app.globalData.postUrl,
      success: function(res) {
        console.log(res)
      }
    })
  },


  
  getUserCurrentLocation: function () {
    let page = this

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("Here's the response data: ")
        console.log(res)
        let latitude = res.latitude
        let longitude = res.longitude
        let accuracy = res.accuracy
        console.log("Your location is: ")
        console.log("Lat:", latitude)
        console.log("Long: ", longitude)
        page.setData({
          userLocation: {
            latitude: latitude,
            longitude: longitude,
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
