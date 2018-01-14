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
              anchor: { x: 0.5, y: 0.5 },
            });
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
      success: (res) => {
        console.log(res);
        console.log("Checking if we need to remove any fogs after location update...");

        // if we've now visited some new grid cells, we should remove
        // those grid cells from the map overlays
        let markerFogs = this.data.markers;
        for(let i = 0; i < res.data.visited_grid_cells.length; i++) {
          let gridCellIdToRemove = res.data.visited_grid_cells[i];
          console.log("You've visited grid cell id: " + gridCellIdToRemove + " so that fog will be removed");

          markerFogs = markerFogs.filter((fog) => {
            return fog.id !== gridCellIdToRemove;
          });
        }
        this.setData({
          markers: markerFogs
        })
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
