// miniprogram/pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toActivity: true,
    updateWxUserInfo: false,
    openid: '',
    isSubmiting: false,
    prepare: false
  },
  enter() {
    let url
    if (this.data.toActivity) {
      url = '/pages/activity/activity'
    } else {
      url = '/pages/my/my'
    }
    wx.switchTab({
      url: url,
    })
  },
  isObjectValueEqual(a, b) {
    //取对象a和b的属性名
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    //判断属性名的length是否一致
    if (aProps.length != bProps.length) {
      return false;
    }
    //循环取出属性名，再判断属性值是否一致
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },
  GetLocation() {
    const t = this
    const openid = this.data.openid
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          success: function(res) {
            console.log("成功获得位置", res)
            const location = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            t.enter()
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration:1000
            })
            // 以下
            const qqMap = require('../../utils/qqmap-wx-jssdk.min.js')
            const qqmap = new qqMap({
              key: 'NXTBZ-USQW6-5SSSZ-ETPAB-HWTVE-SKFYX',
            })
            new Promise((resolve,reject) => {
              qqmap.reverseGeocoder({
                location: location,
                sig: 'tcSoDsYQo8eFiKODsMEaHTEUIoiwxcqF',
                success(res) {
                  console.log(res)
                  location.adress = res.result
                  resolve()
                },
                fail(err) {
                  reject(err)
                }
              })
            }).then(res=>{
              wx.cloud.database().collection('user_info').doc(openid).update({
                data: {
                  location: location
                }
              }).then(res => {
                console.log("更新用户location成功", res)
                getApp().globalData.user_info.location = location
              }).catch(err => {
                console.log("更新用户location失败", err)
              })
            }).catch(err=>{
              console.log("逆地址解析失败",err)
            })
          },
        })
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '请进行位置授权,即将打开设置页面',
          mask: true,
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                }
              })
            }
          }
        })
      }
    })
  },
  loading() {
    this.setData({
      isSubmiting: true
    })
  },
  bindGetUserInfo(e) {
    wx.showLoading({
      title: '正在登陆',
    })
    if (!this.data.prepare){
      return;
    }
    const openid = this.data.openid
    const wxUserInfo = e.detail.userInfo
    if (!openid) {
      wx.showToast({
        title: '请检查网络是否连接',
        icon: 'none'
      })
      this.setData({
        isSubmiting: false
      })
    } else if (wxUserInfo) {
      console.log("获取wxUserInfo", wxUserInfo)
      const user_info = getApp().globalData.user_info
      console.log('user_info', getApp().globalData.user_info)
      if (!user_info.wxUserInfo || !this.isObjectValueEqual(user_info.wxUserInfo, wxUserInfo)) {
        console.log('wxuserinfo存在修改')
        wx.cloud.database().collection('user_info').doc(openid).update({
          data: {
            wxUserInfo: wxUserInfo
          }
        }).then(res => {
          console.log("成功修改userInfo",res)
          getApp().globalData.user_info.wxUserInfo = wxUserInfo
        }).catch(err => {
          console.log(err)
          this.setData({
            isSubmiting: false
          })
        })
        this.GetLocation()
      } else {
        console.log('wxuserinfo未修改,直接进入授权')
        this.GetLocation()
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '授权之后才能进行其他操作',
      })
      this.setData({
        isSubmiting: false
      })
    }
  },
  getOpenid() {
    return new Promise((resolve,reject)=>{
      const t = this
      let openid = wx.getStorageSync('openid')
      if (!openid) {
        console.log("缓存中无No openid")
        wx.cloud.callFunction({
          name: 'login',
          success: res => {
            console.log(res)
            openid = res.result.openid;
            wx.setStorageSync('openid', res.result.openid)
            getApp().globalData.openid = openid
            t.setData({
              openid: openid
            })
            resolve(openid)
            // console.log(res.result.openid, this.globalData.openid)
          },
          fail: err => {
            console.log("Error mesg: ", err)
            wx.showToast({
              title: '获取信息失败请检查网络',
            })
            reject()
          }
        })
      } else {
        console.log("通过缓存获得openid")
        getApp().globalData.openid = openid
        t.setData({
          openid: openid
        })
        resolve(openid)
      }
     
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // getTempImageUrl() {
  //   wx.getImageInfo({
  //     src: 'https://yulovexin.xyz/images/zkd/birth.png',
  //     success: res => {
  //       console.log("获得临时图片成功")
  //       getApp().globalData.birthUrl = res.path
  //     },
  //   })
  // },
  onLoad: function(options) {
    const t = this
    async function prepare(){
      const openid = await t.getOpenid()
      console.log("获得openid", openid)
      t.getUser_info(openid)
    }
    prepare()
    // this.getTempImageUrl()
  },
  getUser_info(openid) {
    const t = this
    const db = wx.cloud.database()
    db.collection('user_info').doc(openid).get().then(res => {
      console.log("获得user", res)
      const user_info = res.data
      if (user_info) {
        delete user_info._openid
        delete user_info._id
      }
      getApp().globalData.user_info = user_info
      if (!user_info || !user_info.name) {
        t.setData({
          toActivity: false
        })
      }
      t.setData({
        prepare: true
      })
    }).catch(err => {
      console.log("获取user_info失败", err.errMsg)
      if (err.errMsg.indexOf('document.get:fail Error: cannot find document with _id') != -1) {
        console.log("新建user_info")
        wx.showLoading({
          title: '正在注册',
        })
        db.collection('user_info').doc(openid).set({
          data: {
            name: ''
          }
        }).then(res => {
          console.log("新建user_info成功",res)
          wx.hideLoading()
          wx.showToast({
            title: '注册成功',
            duration:1000
          })
          getApp().globalData.user_info = {
            name: ''
          }
          t.setData({
            prepare: true,
            toActivity: false
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请检查网络情况',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})