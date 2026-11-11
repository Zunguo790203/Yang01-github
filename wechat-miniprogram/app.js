const defaultState = {
  wellName: '安页22-2HF',
  depth: '5293.30',
  casingDepth: '2490',
  casingId: '220.5',
  openHoleId: '226',
  pipeOd: '127',
  pipeId: '108.6',
  mudDensity: '1.75',
  funnelVisc: '82',
  pv: '49',
  yp: '12',
  gel10: '5.5',
  gel30: '12',
  flow: '24.1',
  rpm: '64',
  rop: '1.90',
  standpipe: '37.43',
  bottomTemp: '117',
  cutSize: '10',
  cutDensity: '2.65',
  source: '录井图片（待核验）',
  notes: '需要现场确认井深、井身段、测斜数据和温压修正模型。',
  savedAt: ''
};

App({
  globalData: {
    appName: '钻井现场辅助',
    prototype: true,
    state: defaultState,
    results: {
      annularVelocity: '--',
      transportIndex: '--',
      ecdStatus: '待计算',
      riskState: '待判定'
    }
  },
  onLaunch() {
    const saved = wx.getStorageSync('drillingFieldSnapshot');
    if (saved) {
      this.globalData.state = { ...defaultState, ...saved.form };
      this.globalData.results = saved.results || this.globalData.results;
    }
  }
});
