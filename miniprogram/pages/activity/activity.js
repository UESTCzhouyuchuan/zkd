// miniprogram/pages/activity/activity.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    textareaAValue: '',
    canSubmit: true,
    isSubmiting: false,
    congratulations: []
  },
  viewPersonInfo(e) {
    const openid = e.currentTarget.dataset.openid
    wx.navigateTo({
      url: '/pages/showMsg/showMsg?openid=' + openid
    })
  },
  save1(text_content, imgsID) {
    const t = this
    const db = wx.cloud.database()
    const user_info = getApp().globalData.user_info
    db.collection('publish_info').add({
      data: {
        text_content: text_content,
        imgsID: imgsID,
        createTimer: db.serverDate()
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      const cong = {
        openid: getApp().globalData.openid,
        nickName: user_info.wxUserInfo.nickName,
        avatarUrl: user_info.wxUserInfo.avatarUrl,
        institution: user_info.institution,
        text_content: text_content,
        imgsUrl: t.data.imgs
      }
      let congratulations = t.data.congratulations
      congratulations.unshift(cong)
      t.setData({
        isSubmiting: false,
        congratulations: congratulations
      })
      new Promise((resolve,reject)=>{
        db.collection('publish_info').count().then(res=>{
          console.log("第多少位",res)
          wx.navigateTo({
            url: '/pages/congratulation/congratulation?number=' + res.total,
          })
          t.setData({
            imgs: [],
            textareaAValue: '',
          })
        })
      })
      setTimeout(() => {
        t.setData({
          canSubmit: true
        })
      }, 5000)
    }).catch((err) => {
      wx.showToast({
        title: '上传失败',
        icon: 'none',
        duration: 1000
      })
      console.log(err)
    })
  },
  save() {
    const openid = getApp().globalData.openid
    const text_content = this.data.textareaAValue
    if (!openid) {
      console.log("获取openid失败")
      wx.showToast({
        title: '请检查网络连接或者退出重新登陆',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (text_content) {
      if (this.data.canSubmit) {
        wx.showLoading({
          title: '正在上传',
          mask: true
        })
        this.setData({
          canSubmit: false,
          isSubmiting: true
        })
        const imgs = this.data.imgs
        const t = this
        let imgsID = []
        if (imgs.length > 0) {
          let uploads = []
          for (let i = 0; i < imgs.length; i++) {
            uploads[i] = new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                filePath: imgs[i],
                cloudPath: 'wish/' + openid + "/" + (new Date()).getTime() + i + imgs[i].match(/\.[^.]+?$/)[0],
                success: function(res) {
                  console.log("上传成功")
                  imgsID.push(res.fileID)
                  resolve()
                }
              })
            })
          }
          Promise.all(uploads).then(() => {
            t.save1(text_content, imgsID)
          }).catch((err) => {
            wx.showToast({
              title: '上传图片失败',
              icon: 'none',
              duration: 1000
            })
            console.log(err)
          })
        } else {
          t.save1(text_content, imgsID)
        }
      } else {
        wx.showModal({
          content: '请勿频繁提交',
        })
      }
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
    }
  },
  chooseImg() {
    const t = this
    wx.chooseImage({
      count: 9 - t.data.imgs.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        if (res.tempFiles.length > 0) {
          t.setData({
            imgs: t.data.imgs.concat(res.tempFilePaths)
          })
        }
      },
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
      current: e.currentTarget.dataset.current
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      cancelText: '手滑了',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgs.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgs: this.data.imgs
          })
        }
      }
    })
  },
  asy(list) {
    const t = this
    // console.log(list)
    const db = wx.cloud.database()
    return new Promise((resolve, reject) => {
      if (list.imgsID.length > 0) {
        let fileList = []
        wx.cloud.getTempFileURL({
          fileList: list.imgsID
        }).then(res => {
          // console.log("成功获得图片")
          // console.log("res.fileList", res.fileList)
          let imgsUrl=[]
          let img
          for (img of res.fileList){
            imgsUrl.unshift(img.tempFileURL)
          }
          let cong = {
            openid: list._openid,
            avatarUrl: '',
            nickName: '',
            institution: '',
            text_content: list.text_content,
            imgsUrl: imgsUrl
          }
          db.collection('user_info').doc(list._openid).field({
            'wxUserInfo.avatarUrl': true,
            'wxUserInfo.nickName': true,
            'institution': true,
          }).get().then(res => {
            // console.log(res)
            cong.avatarUrl = res.data.wxUserInfo.avatarUrl
            cong.institution = res.data.institution
            cong.nickName = res.data.wxUserInfo.nickName
            let congratulations = t.data.congratulations
            congratulations.push(cong)
            t.setData({
              congratulations: congratulations
            })
            resolve()
          }).catch(err => {
            console.log(err)
            reject()
          })
        })
      } else {
        let cong = {
          openid: list._openid,
          avatarUrl: '',
          nickName: '',
          institution: '',
          text_content: list.text_content,
          imgsUrl: []
        }
        db.collection('user_info').doc(list._openid).field({
          'wxUserInfo.avatarUrl': true,
          'wxUserInfo.nickName': true,
          'institution': true,
        }).get().then(res => {
          // console.log(res)
          cong.avatarUrl = res.data.wxUserInfo.avatarUrl
          cong.institution = res.data.institution
          cong.nickName = res.data.wxUserInfo.nickName
          let congratulations = t.data.congratulations
          congratulations.push(cong)
          t.setData({
            congratulations: congratulations
          })
          resolve()
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  GetCongratulations() {
    const t = this
    const getAsy = async function(lists) {
      let list
      for (list of lists) {
        await t.asy(list)
      }
    }
    const db = wx.cloud.database()
    db.collection('publish_info').orderBy('createTimer', 'desc').get().then(res => {
      console.log(res)
      getAsy(res.data)
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().backToLogin(getApp().globalData.openid)
    this.GetCongratulations()
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
    // this.GetCongratulations()
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