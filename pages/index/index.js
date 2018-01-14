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

    let page = this
    // this.setData({markers: markers})
    this.setMapCenterAsUsersCurrentLocation()
    console.log(fogs)
    wx.request({
      method: 'get',
      url: app.globalData.baseUrl + app.globalData.getUrl,
      success: function (res) {
        let markerFogs = [];
        console.log("Please wait I'm extremely slow");
        for(var i = 0; i < res.data.length; i++) {
          console.log(res.data[i]);
          if(!res.data[i].visible) {
            markerFogs.push({
              id: res.data[i].id,
              longitude: res.data[i].longitude,
              latitude: res.data[i].latitude,
              iconPath: "../../assets/images/fog.png",
              width: 75,
              height: 90,
              anchor: { x: 0.5, y: 0.5 }
            })
          }
        }
        console.log(res.data)
        page.setData({
          markers: markerFogs,
        });
      }
    })
    setInterval(this.postCurrentLocation, 5000)
  },

  setMapCenterAsUsersCurrentLocation: function(lat, long) {
    console.log('FUCK')
    this.setData({
      map: {
        latitude: lat,
        longitude: long
      }
    })
    console.log(this.data.map)
  },

  postCurrentLocation: function() {
    // POST request to send those coordinates
    this.getUserCurrentLocation();
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
      success: function (res) {
        type: 'wgs84',
        console.log("Here's the response data: ")
        let latitude = res.latitude
        let longitude = res.longitude

        page.setMapCenterAsUsersCurrentLocation(latitude, longitude)
        page.setData({
          userLocation: {
            latitude: latitude,
            longitude: longitude,
          }
        })
      },
      fail: function (res) {
        console.log("Get location failed!");
      }
    })
  },
})
