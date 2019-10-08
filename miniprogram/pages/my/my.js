// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: '',
    qrID: '',
    qr: '',
    showModal: false,
    notices: [],
    showNotice: false,
    canConfirm: false,
    institution_: '',
    institution: '',
    institutions: ['半导体研究所', '北京基因组研究所', "测量与地球物理研究所", "成都计算机应用研究所", "成都山地灾害与环境研究所", "成都生物研究所", "成都有机化学研究所", "城市环境研究所", "大连化学物理研究所", "大气物理研究所", "地理科学与资源研究所", "地球化学研究所", "地球环境研究所", "地质与地球物理研究所", "电工研究所", "电子学研究所", "东北地理与农业生态研究所", "动物研究所", "分子细胞科学卓越创新中心（生物化学与细胞生物学研究所）", "分子植物科学卓越创新中心（植物生理生态研究所）", "福建物质结构研究所", "高能物理研究所", "工程热物理研究所", "古脊椎动物与古人类研究所", "光电技术研究所", "光电研究院", "广州地球化学研究所", "广州化学研究所", "广州能源研究所", "广州生物医药与健康研究院", "国家空间科学中心", "国家纳米科学中心", "国家授时中心", "国家天文台", "过程工程研究所", "海洋研究所", "合肥物质科学研究院", "华南植物园", "化学研究所", "计算机网络信息中心", "计算技术研究所", "金属研究所", "近代物理研究所", "科技政策与管理科学研究所", "空间应用工程与技术中心", "昆明动物研究所", "昆明植物研究所", "兰州化学物理研究所", "兰州油气资源研究中心", "理化技术研究所", "理论物理研究所", "力学研究所", "南海海洋研究所", "南京地理与湖泊研究所", "南京地质古生物研究所", "南京天文光学技术研究所", "南京天文仪器研制中心", "南京土壤研究所", "脑科学与智能技术卓越创新中心（神经科学研究所）", "宁波材料技术与工程研究所", "青藏高原研究所", "青岛生物能源与过程研究所", "青海盐湖研究所", "软件研究所", "山西煤炭化学研究所", "上海巴斯德研究所", "上海高等研究院", "上海光学精密机械研究所", "上海硅酸盐研究所", "上海技术物理研究所", "上海生命科学研究院", "上海天文台", "上海微系统与信息技术研究所", "上海药物研究所", "上海营养与健康研究院", "上海应用物理研究所", "上海有机化学研究所", "深海科学与工程研究所", "深圳先进技术研究院", "沈阳计算技术研究所", "沈阳应用生态研究所", "沈阳自动化研究所", "渗流流体力学研究所", "生态环境研究中心", "生物物理研究所", "声学所东海研究站", "声学研究所", "数学与系统科学研究院", "水生生物研究所", "水土保持与生态环境研究中心", "苏州纳米技术与纳米仿生研究所", "苏州生物医学工程技术研究所", "天津工业生物技术研究所", "微电子研究所", "微生物研究所", "文献情报中心", "武汉病毒研究所", "武汉物理与数学研究所", "武汉岩土力学研究所", "武汉植物园", "物理研究所", "西安光学精密机械研究所", "西北高原生物研究所", "西北生态环境资源研究院", "西双版纳热带植物园", "心理研究所", "新疆理化技术研究所", "新疆生态与地理研究所", "新疆天文台", "信息工程研究所", "亚热带农业生态研究所", "烟台海岸带研究所", "遥感与数字地球研究所", '遗传与发育生物学所农业资源研究中心', "遗传与发育生物学研究所", "云南天文台", "长春光学精密机械与物理研究所", '长春人造卫星观测站', '长春应用化学研究所', '植物研究所', '重庆绿色智能技术研究院', '紫金山天文台', '自动化研究所', '自然科学史研究所', '中国科学院大学', '数学科学学院', '物理科学学院', '地球与行星科学学院', '资源与环境学院', '生命科学学院', '计算机与控制学院', '经济与管理学院', '人文学院', '外语系', '工程科学学院', '电子电气与通信工程学院', '中丹学院', '华大教育中心', '公共政策与管理学院', '本科部', '国际学院', '存济医学院', '天文与空间科学学院', '微电子学院', '网络空间安全学院', '未来技术学院', '人工智能技术学院', '心理学系', '化学科学学院', '化学工程学院', '材料科学与光电技术学院', '纳米学院', '知识产权学院', '马克思主义学院', '创新创业学院', '艺术中心', '卡弗里理论科学研究所', '虚拟经济与数据科学研究中心', '大数据挖掘与知识管理重点实验室', '医学中心', '基础教育研究院', '建筑研究与设计中心', '网络创新与发展研究中心', '创新方法研究中心', '培训中心', '计算地球动力学重点实验室', '真空物理重点实验室', '管理干部学院', '核科学与技术学院', '科技服务有限公司', '上海微小卫星工程中心', '北京生命科学研究院', '南京水利科学研究院', '中国空间技术研究院', '北京橡胶工业研究设计院', '轻工业环境保护研究所']
  },
  click_notice(e) {
    this.setData({
      institution: e.currentTarget.dataset.value,
      canConfirm: true,
      showNotice: false,
    })
  },
  input_(e) {
    const key = e.detail.value
    // console.log("input", key)
    if (key != this.data.institution_) {
      this.setData({
        institution_: key
      })
      let notices = []
      if (key) {
        for (let value of this.data.institutions) {
          if (value.indexOf(key) > -1) {
            notices.push(value)
          }
        }
      }
      this.setData({
        notices: notices
      })
    }
    // console.log("查询结果一共",notices.length)
  },
  focus() {
    this.setData({
      showNotice: true
    })
  },
  showModal() {
    this.setData({
      showModal: true,
      institution: '',
    })
  },
  hideModal() {
    this.setData({
      showModal: false,
      canConfirm: false,
      showModal: false,
      notices: [],
      institution_: ''
    })
  },
  confirm() {
    this.setData({
      'user_info.institution': this.data.institution
    })
    this.hideModal()
  },
  input_qr() {
    const t = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        if (res.tempFilePaths.length > 0) {
          t.setData({
            qr: res.tempFilePaths[0]
          })
        }
      },
    })
  },
  input(e) {
    const user_info = this.data.user_info
    user_info[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      user_info: user_info
    })
    // console.log(user_info)
  },
  chooseDegree(e) {
    const itemList = ['学士', '硕士', '博士', '教工']
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        const degree = itemList[res.tapIndex]
        if (degree != this.data.degree) {
          this.setData({
            'user_info.degree': degree
          })
        }
      }
    })
  },
  save() {
    const user_info = this.data.user_info
    console.log("user_info", user_info)
    const openid = getApp().globalData.openid
    if (!openid) {
      console.log("获取openid失败")
      wx.showToast({
        title: '请检查网络连接或者退出重新登陆',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (!user_info.name || !user_info.enter_year || !user_info.institution || !user_info.degree ||
      !user_info.work_unit || !user_info.adress || !this.data.qr) {
      setTimeout(() => {
        wx.showToast({
          title: '星号(*)代表必填项',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }, 200)
    } else if (user_info.enter_year < 1978) {
      wx.showToast({
        title: '入校年份应大于1978',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (user_info.enter_year > (new Date()).getFullYear()) {
      wx.showToast({
        title: '入校年份应不大于今年' + (new Date()).getFullYear(),
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (! /^((\+|00)86)?1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[2,5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/.test(user_info.phone)) {
      wx.showToast({
        title: '电话格式不正确',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (! /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(user_info.mail)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      const t = this
      wx.showLoading({
        title: '正在保存',
        mask: true
      })
      if (this.data.originQr != this.data.qr) {
        const qr = this.data.qr
        wx.cloud.uploadFile({
          filePath: qr,
          cloudPath: 'qr/' + openid + qr.match(/\.[^.]+?$/)[0],
        }).then(res => {
          const fileID = res.fileID
          if (res.statusCode == 200 && fileID) {
            user_info.qrID = fileID
            const db = wx.cloud.database()
            db.collection('user_info').doc(openid).update({
              data: user_info
            }).then(res => {
              console.log('finish', res)
              getApp().globalData.user_info = user_info
              t.setData({
                originQr: this.data.qr
              })
              wx.hideLoading()
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })
            }).catch(err => {
              console.log('fail更改信息失败', err)
              wx.hideLoading()
              wx.showToast({
                title: '修改失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              t.setData({
                qr: t.data.originQr,
                user_info: getApp().globalData.user_info
              })
            })
          }
        }).catch(err => {
          console.log(err)
          t.setData({
            qr: t.data.originQr,
            user_info: getApp().globalData.user_info
          })
        })
      } else {
        console.log("未修改qr")
        const db = wx.cloud.database()
        db.collection('user_info').doc(openid).update({
          data: user_info
        }).then(res => {
          console.log('finish', res)
          getApp().globalData.user_info = user_info
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        }).catch(err => {
          console.log('fail更改信息失败', err)
          wx.hideLoading()
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          t.setData({
            user_info: getApp().globalData.user_info
          })
        })
      }
    }
  },
  viewPersonInfo() {
    wx.navigateTo({
      url: '/pages/showMsg/showMsg?openid=' + getApp().globalData.openid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().backToLogin(getApp().globalData.openid)
    const user_info = getApp().globalData.user_info
    console.log("在个人页面获得user_info", user_info)
    user_info.show_info = user_info.show_info === false ? false : true
    user_info.show_location = user_info.show_location === false ? false : true
    this.setData({
      user_info: user_info
    })
    if (user_info.qrID) {
      wx.cloud.getTempFileURL({
        fileList: [user_info.qrID]
      }).then(res => {
        // console.log(res)
        if (res.fileList.length > 0) {
          this.setData({
            originQr: res.fileList[0].tempFileURL,
            qr: res.fileList[0].tempFileURL
          })
        } else {
          console.log('获取失败', res)
        }
      })
    }
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