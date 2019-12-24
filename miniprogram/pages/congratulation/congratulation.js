// miniprogram/pages/congratulation/congratulation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPic: false,
    number: 520,
    nickName: "周玉川"
  },
  toCertificate() {
    wx.previewImage({
      urls: [this.data.previewImagePath],
      fail: err => {
        wx.showModal({
          title: '加载图片失败',
        })
      }
    })
  },
  showPic() {
    this.setData({
      showPic: true
    })
    this.createPic()
  },
  createPic() {
    const t = this
    wx.createSelectorQuery().in(this).select('.birth').boundingClientRect((wrap) => {
      const width = wrap.width
      const height = wrap.height
      console.log(width, height)
      wx.showLoading({
        title: '正在渲染',
        mask: false
      })
      let pic = []
      pic[0] = new Promise((resolve, reject) => {
        const bitrhImageUrl = getApp().globalData.bitrhImageUrl
        if (bitrhImageUrl) {
          console.log("已经缓存bitrhImageUrl")
          resolve(bitrhImageUrl)
        } else {
          wx.getImageInfo({
            src: 'https://www.yulovexin.xyz/images/zkd/birth.jpg',
            success(res) {
              resolve(res.path)
            },
            fail(err) {
              console.log(err)
              reject(err)
            }
          })
        }
      })
      pic[1] = new Promise((resolve, reject) => {
        const avatarImageUrl = getApp().globalData.avatarImageUrl
        if (avatarImageUrl) {
          console.log("已经缓存avatarImageUrl")
          resolve(avatarImageUrl)
        } else {
          wx.getImageInfo({
            src: getApp().globalData.user_info.wxUserInfo.avatarUrl,
            success(res) {
              resolve(res.path)
            },
            fail(err) {
              console.log(err)
              reject(err)
            }
          })
        }
      })
      pic[2] = new Promise((resolve, reject) => {
        const avatarShowUrl = getApp().globalData.avatarShowUrl
        if (avatarShowUrl) {
          console.log("已经缓存avatarShowUrl")
          resolve(avatarShowUrl)
        } else {
          wx.getImageInfo({
            src: '',
            success(res) {
              resolve(res.path)
            },
            fail(err) {
              console.log(err)
              reject(err)
            }
          })
        }
      })
      Promise.all(pic).then(res => {
        console.log(res)
        //获取设备的信息
        let mobile = wx.getSystemInfoSync();
        //获取设计图纸换算比例（用于自适应所有屏幕）
        let ratio = mobile.windowWidth / 375;
        const avatar = 25*ratio;
        const avatarShow = 50*ratio
        const birth = wx.createCanvasContext('birth')
        birth.drawImage(res[0], 0, 0, width, height)
        birth.setFillStyle('#EA7517')
        birth.setFontSize(14)
        birth.fillText(t.data.nickName, 60, height / 2)
        birth.fillText("No."+t.data.number, 60, height / 2 + 20)
        birth.drawImage(res[2], width / 2 -avatarShow , 60*ratio-avatarShow, avatarShow * 2, avatarShow *2)
        birth.save()
        birth.arc(width / 2 + ratio * 2, 55 * ratio,avatar,0,Math.PI*2);
        birth.clip()
        birth.drawImage(res[1], width / 2 + ratio * 2 - avatar, 55*ratio-avatar, avatar * 2, avatar * 2)
        birth.restore()
        birth.draw(false, t.viewPictrue())
        wx.hideLoading()
      })
    }).exec();
  },
  viewPictrue() {
    const t = this
    wx.hideLoading()
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'birth',
        success(res) {
          console.log(res)
          t.setData({
            previewImagePath: res.tempFilePath
          })
        },
        fail(err) {
          console.log("转变失败", err)
        }
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().backToLogin(getApp().globalData.openid)
    this.setData({
      number: options.number,
      nickName: getApp().globalData.user_info.wxUserInfo.nickName
    })
    // this.setData({
    //   number:520,
    //   nickName:'周玉川'
    // })
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