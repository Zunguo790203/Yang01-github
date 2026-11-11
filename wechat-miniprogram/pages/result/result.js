Page({
  data: {
    annularVelocity: '--',
    transportIndex: '--',
    ecdStatus: '待计算',
    riskState: '待判定'
  },
  onLoad() {
    const saved = wx.getStorageSync('drillingFieldSnapshot');
    if (saved && saved.results) {
      this.setData({
        annularVelocity: saved.results.annularVelocity || '--',
        transportIndex: saved.results.transportIndex || '--',
        ecdStatus: saved.results.ecdStatus || '待计算',
        riskState: saved.results.riskState || '待判定'
      });
    }
  }
});
