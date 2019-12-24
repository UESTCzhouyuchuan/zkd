// miniprogram/pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeIndex: -1,
    notices: [],
    showNotice: false,
    duration: 0,
    speed: 1200,
    wrapWidth: 0,
    width: 0,
    noticeAnimation: null,
    timer: null,
    myLocation: {
      latitude: 30.65984,
      longitude: 104.10194
    },
    include_points: [],
    setting: {
      skew: 0,
      rotate: 0,
      showLocation: true,
      showScale: true,
      subKey: 'NXTBZ-USQW6-5SSSZ-ETPAB-HWTVE-SKFYX',
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    }
  },
  initAnimation() {
    wx.createSelectorQuery().in(this).select('.noticeBar-wrap').boundingClientRect((wrap) => {
      const animation = wx.createAnimation({
        duration: 0,
        timingFunction: "linear",
      });
      const resetAnimation = animation.translateX(wrap.width).step();
      this.setData({
        noticeAnimation: resetAnimation.export(),
        wrapWidth: wrap.width
      });
      // console.log("回到最右")
      const index = (this.data.noticeIndex + 1) % this.data.notices.length
      this.setData({
        noticeIndex: index,
      }, function() {
        wx.createSelectorQuery().in(this).select('.noticeBar-content').boundingClientRect((content) => {
          // console.log("查询")
          const duration = content.width / 40 * this.data.speed;
          const animation = wx.createAnimation({
            duration: duration,
            timingFunction: "linear",
          });
          this.setData({
            width: content.width,
            duration: duration,
            animation: animation,
          }, () => {
            this.startAnimation();
          });
        }).exec();
      })
    }).exec();
  },
  startAnimation() {
    // console.log("回到最左")
    this.data.animation.option.transition.duration = this.data.duration;
    const noticeAnimation = this.data.animation.translateX(-this.data.width).step();
    setTimeout(() => {
      this.setData({
        noticeAnimation: noticeAnimation.export()
      });
    }, 100);
    const timer = setTimeout(() => {
      this.initAnimation();
    }, this.data.duration);
    this.setData({
      timer
    })
  },
  destroyTimer() {
    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }
  },
  getNotices() {
    const db = wx.cloud.database()
    const t = this
    let notices = []
    db.collection('publish_info').orderBy('createTimer', 'desc').get().then(res => {
      const data = res.data
      let getInfo = []
      for (let i in data) {
        getInfo[i] = new Promise((resolve, reject) => {
          db.collection('user_info').doc(data[i]._openid).get().then(res => {
            notices.push(res.data.wxUserInfo.nickName + "：" + data[i].text_content)
            resolve()
          })
        })
      }
      Promise.all(getInfo).then(() => {
        // console.log(notices)
        notices.unshift('祝福祖国,祝福中科院,祝福校友们')
        t.setData({
          notices: notices,
        })
        t.initAnimation();
      })
    })
  },
  getUserLocate() {
    const t = this
    let pic

    function itemMapDetail(a, b) {
      for (let item of b) {
        let obj = {
          width: 35,
          height: 50,
          zIndex: 3,
          callout: {
            color: '#FF0202', //文本颜色
            borderRadius: 10, //边框圆角
            borderWidth: 2, //边框宽度
            borderColor: '#FF0202', //边框颜色
            bgColor: '#ffffff', //背景色
            padding: 5, //文本边缘留白
            textAlign: 'left' //文本对齐方式。有效值: left, right, center
          }
        }
        if (!(item.show_location === false) && item.location) {
          let phone = (item.show_info === false ? '用户选择不展示' : item.phone) || '未填写';
          obj.callout.content = "名字：" + (item.name || '未填写') + "\n院所：" + (item.institution || '未填写') + "\n学位："+ (item.degree || '未填写') + "\n电话：" + phone;
          pic = Math.floor(Math.random() * 4) + 1;
          obj.iconPath = '/images/dtp' + pic + '.png';
          obj.latitude = item.location.latitude;
          obj.longitude = item.location.longitude;
          a.push(obj);
        }
      }
    }
    async function getAllUserLocation() {
      let con = true
      let i = 0;
      let locations = []
      while (con) {
        await new Promise((resolve, reject) => {
          wx.cloud.database().collection('user_info').skip(i * 20).limit(20).get().then(res => {
            i += 1
            console.log(res.data)
            if (res.data.length < 20) {
              con = false
            }
            itemMapDetail(locations, res.data)
            resolve()
          }).catch(err => {
            console.log("获得用户失败", err)
          })
        })
      }
      console.log("获得全部用户位置", locations)
      t.marks(locations)
    }
    getAllUserLocation()
  },
  marks(locations) {
    this.setData({
      marks: locations,
      include_points: locations
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().backToLogin(getApp().globalData.openid)
    this.setData({
      myLocation: getApp().globalData.user_info.location
    })
    this.getNotices()
    this.getUserLocate()
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