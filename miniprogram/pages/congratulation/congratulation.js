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
      new Promise((resolve, reject) => {
        const birthUrl = getApp().globalData.birthUrl
        if (birthUrl) {
          console.log("已经缓存")
          resolve(birthUrl)
        } else {
          wx.getImageInfo({
            src: 'https://yulovexin.xyz/images/zkd/birth.png',
            success(res) {
              resolve(res.path)
            },
            fail(err) {
              console.log(err)
              reject(err)
            }
          })
        }
      }).then(path => {
        console.log(path)
        const birth = wx.createCanvasContext('birth')
        birth.drawImage(path, 0, 0, width, height)
        birth.setFillStyle('#EA7517')
        birth.setFontSize(16)
        birth.fillText("第" + t.data.number + "位校友" + t.data.nickName + "赠", width * 1 / 4, height * 4 / 7)
        birth.stroke()
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