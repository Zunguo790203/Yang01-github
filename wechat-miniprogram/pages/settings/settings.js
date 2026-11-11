Page({
  data: {
    mode: 'prototype',
    policy: '仅本地缓存，不上传行为数据'
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: '设置' });
  }
});
