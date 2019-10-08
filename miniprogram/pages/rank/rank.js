// miniprogram/pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankTabCur: 0,
    rankTabNav: ['研究所', '省份'],
    rank: [],
    showRank: false
  },
  rankTabSelect(e) {
    const cur = e.currentTarget.dataset.index
    if (cur != this.data.rankTabCur) {
      this.setData({
        rankTabCur: cur
      })
    }
  },
  getTotalInfo() {
    function con(a, b) {
      for (let value of b) {
        a.push(value._openid)
      }
    }

    function getWordCnt(a) {
      let obj = {};
      let res = []
      for (let item of a) {
        obj[item] = (obj[item] + 1) || 1
      }
      let i = 0
      let tmp = {}
      for (let index in obj) {
        tmp = {
          name: index,
          value: obj[index]
        }
        res[i++] = tmp
        if (i > 10) {
          break;
        }
      }
      if (res.length <= 1) {
        return res
      }
      // console.log(res)
      let t3
      for (let t1 = 0 ; t1<res.length;t1++){
        for (let t2 = 0 ; t2 < t1;t2++){
          if (res[t1].value > res[t2].value){
            t3 = res[t1]
            res[t1] = res[t2]
            res[t2] = t3
          }
        }
      }
      return res
    }
    const t = this
    const db = wx.cloud.database()
    let institution = []
    let province = []
    async function get() {
      let data = []
      let i = 0
      let ll = true
      while (ll) {
        await new Promise((resolve, reject) => {
          db.collection('publish_info').skip(i * 20).limit(20).get().then(res => {
            i += 1
            // console.log(res)
            con(data, res.data)
            if (res.data.length < 20) {
              ll = false
            }
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      }
      let provinces = []
      let getInfo = []
      for (let i in data) {
         getInfo[i] = new Promise((resolve, reject) => {
          db.collection('user_info').doc(data[i]).get().then(res => {
            // console.log(res)
            if (res.data.institution) {
              institution.push(res.data.institution)
            }
            if (res.data.location.adress) {
              provinces.push(res.data.location.adress.ad_info.province)
            }
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      }
      Promise.all(getInfo).then(res=>{
        institution = getWordCnt(institution)
        provinces = getWordCnt(provinces)
        console.log("得到rank数据")
        console.log(provinces, institution)
        t.setData({
          'rank[0]': institution,
          'rank[1]': provinces,
          showRank: true
        })
      })
    }
    get().catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().backToLogin(getApp().globalData.openid)
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
    this.getTotalInfo()
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
    this.getTotalInfo()
    wx.stopPullDownRefresh()
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