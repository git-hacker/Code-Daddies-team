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
    fogs: [
      { 
        "id": 239, 
        "longitude": 104.055387, 
        "latitude": 30.575614 
      }, 
      { 
        "id": 240, 
        "longitude": 104.058556, 
        "latitude": 30.575614 
      },
      { "id": 239, "longitude": 104.055387, "latitude": 30.575614 }, { "id": 240, "longitude": 104.058556, "latitude": 30.575614 }, { "id": 241, "longitude": 104.061725, "latitude": 30.575614 }, { "id": 242, "longitude": 104.064894, "latitude": 30.575614 }, { "id": 243, "longitude": 104.068063, "latitude": 30.575614 }, { "id": 244, "longitude": 104.071232, "latitude": 30.575614 }, { "id": 245, "longitude": 104.074401, "latitude": 30.575614 }, { "id": 246, "longitude": 104.07757, "latitude": 30.575614 }, { "id": 247, "longitude": 104.080739, "latitude": 30.575614 }, { "id": 248, "longitude": 104.083908, "latitude": 30.575614 }, { "id": 249, "longitude": 104.087077, "latitude": 30.575614 }, { "id": 250, "longitude": 104.090246, "latitude": 30.575614 }, { "id": 251, "longitude": 104.093415, "latitude": 30.575614 }, { "id": 252, "longitude": 104.096584, "latitude": 30.575614 }, { "id": 253, "longitude": 104.055387, "latitude": 30.578683 }, { "id": 254, "longitude": 104.058556, "latitude": 30.578683 }, { "id": 255, "longitude": 104.061725, "latitude": 30.578683 }, { "id": 256, "longitude": 104.064894, "latitude": 30.578683 }, { "id": 257, "longitude": 104.068063, "latitude": 30.578683 }, { "id": 258, "longitude": 104.071232, "latitude": 30.578683 }, { "id": 259, "longitude": 104.074401, "latitude": 30.578683 }, { "id": 260, "longitude": 104.07757, "latitude": 30.578683 }, { "id": 261, "longitude": 104.080739, "latitude": 30.578683 }, { "id": 262, "longitude": 104.083908, "latitude": 30.578683 }, { "id": 263, "longitude": 104.087077, "latitude": 30.578683 }, { "id": 264, "longitude": 104.090246, "latitude": 30.578683 }, { "id": 265, "longitude": 104.093415, "latitude": 30.578683 }, { "id": 266, "longitude": 104.096584, "latitude": 30.578683 }, { "id": 267, "longitude": 104.055387, "latitude": 30.581752 }, { "id": 268, "longitude": 104.058556, "latitude": 30.581752 }
      ],
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
    // this.setData({markers: markers})

    console.log(fogs)
    wx.request({
      method: 'get',
      url: app.globalData.baseUrl + app.globalData.getUrl,

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
