Page({
  data: { mode: 'prototype', notice: '本地缓存，不上传' },
  onLoad() {
    wx.setNavigationBarTitle({ title: '设置' });
  }
});
