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
        // showlocation: true,
    },
    userLocation: {
      latitude: 0,
      longitude: 0,
    },
    fogs: [ ],
    markers: [ ],
    landmarks: [
      {
        id: 900000,
        title: 'Panda center',
        latitude: 30.59396743774414,
        longitude: 104.05834197998047,
        iconPath: "../../assets/icons/landmarkUnlock.png",
        width: 50,
        height: 50,
      },
      {
        id: 900001,
        title: 'Sweet park',
        latitude: 30.645829,
        longitude: 104.048147,
        iconPath: "../../assets/icons/landmarkLock.png",
        width: 50,
        height: 50,
      },
      {
        id: 900002,
        title: 'Wuhouci - One of the best temples in Chengdu!',
        latitude: 30.639552,
        longitude: 104.046473,
        iconPath: "../../assets/icons/landmarkUnlock.png",
        width: 50,
        height: 50,
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

  // get users current location
  // set that as the center of the map
  // grab fog markers put them into markerfogs array
  // set 
  onLoad: function () {
    let fogs = this.data.fogs

    let page = this

    this.getUserCurrentLocation(true);

    wx.request({
      method: 'get',
      url: app.globalData.baseUrl + app.globalData.getUrl,
      success: function (res) {
        let markerFogs = [];
        console.log("Please wait I'm extremely slow");
        for(var i = 0; i < res.data.length; i++) {
          if(!res.data[i].visible) {
            markerFogs.push({
              id: res.data[i].id,
              longitude: res.data[i].longitude,
              latitude: res.data[i].latitude,
              iconPath: "../../assets/images/fog.png",
              width: 50,
              height: 50,
              anchor: { x: 0.5, y: 0.5 },
            });
          }
        }
        page.setData({
          markers: markerFogs.concat(page.data.landmarks),
        });
        page.postCurrentLocation();
      }
    })
    this.postCurrentLocation();

    setInterval(this.postCurrentLocation, 15000)
  },

  setMapCenterAsUsersCurrentLocation: function(lat, long) {
    this.getUserCurrentLocation(true);
  },

  postCurrentLocation: function() {
    // POST request to send those coordinates
    this.getUserCurrentLocation(false);
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
        let previousMarkerCount = markerFogs.length;
        for(let i = 0; i < res.data.visited_grid_cells.length; i++) {
          let gridCellIdToRemove = res.data.visited_grid_cells[i];
          console.log("You've visited grid cell id: " + gridCellIdToRemove + " so that fog will be removed");

          markerFogs = markerFogs.filter((fog) => {
            return fog.id !== gridCellIdToRemove;
          });
        }
        if(previousMarkerCount !== markerFogs.length) {
          this.setData({
            markers: markerFogs
          });
        }
      }
    })
  },


  
  getUserCurrentLocation: function (centerOnLocation) {
    let page = this

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        page.setData({
          userLocation: {
            latitude: latitude,
            longitude: longitude,
          }
        })

        console.log("User's current location: ")
        console.log(page.data.userLocation)

        if(centerOnLocation) {
          page.setData({
            map: {
              latitude: latitude,
              longitude: longitude
            }
          })
        }
      },
      fail: function (res) {
        console.log("Get location failed!");
      }
    })
  },
})
