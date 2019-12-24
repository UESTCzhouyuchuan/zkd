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
    this.getTempImageUrl('bitrhImageUrl', 'https://www.yulovexin.xyz/images/zkd/birth.jpg');
    this.getTempImageUrl('avatarShowUrl', 'https://www.yulovexin.xyz/images/zkd/avatarShow.png');

  },
  backToLogin(openid) {
    if (!openid) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  getTempImageUrl(file, url) {
    const t = this
    const fileInfo = wx.getStorageSync(file)
    let get_net_img = false
    if (fileInfo && fileInfo.filePath && fileInfo.time) {
      console.log(file + "图片存在本地:",fileInfo.filePath);
      let days = Math.ceil(((new Date()).getTime() - fileInfo.time)/(24*3600*1000));
      console.log("距离上一次访问图片相隔时间", days+"day");
      (days >= 2) && (get_net_img = true);
      this.globalData[file] = fileInfo.filePath;
    } else {
      get_net_img = true;
    }
    if (get_net_img) {
      wx.getImageInfo({
        src: url,
        success: res => {
          wx.saveFile({
            tempFilePath: res.path,
            success(res) {
              const saveFilePath = res.savedFilePath
              console.log("缓存图片", file)
              wx.setStorageSync(file, {
                filePath: saveFilePath,
                time: (new Date()).getTime()
              })
              t.globalData[file] = saveFilePath
            }
          })
        },
      })
    }
  },
})