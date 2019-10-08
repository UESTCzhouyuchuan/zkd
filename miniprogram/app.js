//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xiaoyuansongsui-xh94i',
        traceUser: true,
      })
    }

    this.globalData = {
      openid: '',
      user_info: {
        wxUserInfo: ''
      },
    }
    this.getTempImageUrl()
  },
  backToLogin(openid) {
    if (!openid) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  getTempImageUrl() {
    wx.getImageInfo({
      src: 'https://yulovexin.xyz/images/zkd/birth.png',
      success:res=> {
        this.globalData.birthUrl = res.path
      },
    })
  },
})