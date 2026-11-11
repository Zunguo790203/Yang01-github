const defaultState = {
  wellName: '安页22-2HF',
  depth: '5293.30',
  casingDepth: '2490',
  casingId: '220.5',
  openHoleId: '226',
  pipeOd: '127',
  pipeId: '108.6',
  mudDensity: '1.75',
  flow: '24.1',
  rpm: '64',
  ropMinPerM: '1.90',
  standpipe: '37.43',
  mudTemp: '65',
  bottomTemp: '117',
  pv: '49',
  yp: '12',
  cutSize: '10',
  cutDensity: '2.65',
  source: '录井图片（待核验）',
  savedAt: '',
  warnings: []
};

App({
  globalData: {
    appName: '钻井现场辅助',
    prototype: true,
    state: defaultState,
    results: {
      ecd: '--',
      annularVelocity: '--',
      transportIndex: '--',
      risk: '待计算'
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
