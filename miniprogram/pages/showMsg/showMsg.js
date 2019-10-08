// miniprogram/pages/showMsg/showMsg.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isMe: false,
    user_info: null,
    showContact: false
  },
  changeMe(){
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  contact(){
    this.setData({
      showContact: true
    })
  },
  hideModal(){
    this.setData({
      showContact: false
    })
  },
  longPress(){
    console.log("长按")
  },
  nop(){
    wx.previewImage({
      urls: ['https://yulovexin.xyz/images/zkd/contact.png'],
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.current
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user_openid=getApp().globalData.openid
    getApp().backToLogin(user_openid)
    const openid = options.openid
    console.log("获得查看的openid",openid)
    if (openid == user_openid){
      this.setData({
        isMe: true
      })
    }
    const t = this
    wx.cloud.database().collection('user_info').doc(openid).get().then(res =>{
      const user_info = res.data
      user_info.show_info = user_info.show_info === false ? false : true
      if (user_info.qrID){
        wx.cloud.getTempFileURL({
          fileList: [user_info.qrID],
          success(res){
            if (res.fileList.length > 0) {
              t.setData({
                qr: res.fileList[0].tempFileURL
              })
            } else {
              console.log('获取失败', res)
            }
          }
        })
      }
      t.setData({
        user_info: res.data
      })
    }).catch(err=>{
      wx.showModal({
        title: '错误',
        content: '获取用户信息失败',
      })
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})