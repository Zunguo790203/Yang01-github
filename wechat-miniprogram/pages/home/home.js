const INITIAL = {
  wellName: '安页22-2HF',
  depth: '5293.30',
  casingDepth: '2490',
  casingId: '220.5',
  openHoleId: '226',
  pipeOd: '127',
  mudDensity: '1.75',
  flow: '24.1',
  rpm: '64',
  ropMinPerM: '1.90',
  standpipe: '37.43',
  mudTemp: '65',
  bottomTemp: '117',
  cutSize: '10',
  cutDensity: '2.65',
  pv: '49',
  yp: '12',
  source: '录井图片（待核验）'
};

const NUMERIC_FIELDS = [
  'depth', 'casingDepth', 'casingId', 'openHoleId', 'pipeOd', 'mudDensity',
  'flow', 'rpm', 'ropMinPerM', 'standpipe', 'mudTemp', 'bottomTemp',
  'cutSize', 'cutDensity', 'pv', 'yp'
];

Page({
  data: {
    activeTab: '现场',
    form: INITIAL,
    annularVelocity: '--',
    validation: '尚未计算',
    warnings: [],
    ecdStatus: '模型待验证',
    cleanStatus: '需补齐模型输入',
    savedAt: ''
  },

  onLoad() {
    const saved = wx.getStorageSync('drillingFieldSnapshot');
    if (saved && saved.form) {
      this.setData({ form: saved.form, savedAt: saved.savedAt || '' });
    }
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key;
    const value = event.detail.value;
    this.setData({ [`form.${key}`]: value });
  },

  chooseTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.tab });
  },

  restoreSample() {
    this.setData({ form: { ...INITIAL }, annularVelocity: '--', validation: '样例已载入，待计算' });
  },

  saveSnapshot() {
    const savedAt = new Date().toLocaleString();
    wx.setStorageSync('drillingFieldSnapshot', { form: this.data.form, savedAt });
    this.setData({ savedAt });
    wx.showToast({ title: '已保存在本机', icon: 'success' });
  },

  calculate() {
    const f = this.data.form;
    const values = {};
    const warnings = [];
    for (const key of NUMERIC_FIELDS) {
      values[key] = Number(f[key]);
      if (!Number.isFinite(values[key]) || values[key] <= 0) {
        warnings.push(`${this.labelFor(key)}需为大于 0 的数值`);
      }
    }
    if (warnings.length) {
      this.setData({ warnings, validation: '输入校验未通过', annularVelocity: '--' });
      return;
    }
    if (values.pipeOd >= values.openHoleId || values.pipeOd >= values.casingId) {
      warnings.push('钻柱外径必须小于相应井眼/套管内径，请核对尺寸与当前钻具位置。');
    }
    if (values.casingDepth >= values.depth) {
      warnings.push('套管下深不小于当前井深，请核对深度基准和井身结构。');
    }

    // Nominal annular velocity for the entered open-hole geometry only.
    // Q (L/s) is converted to m³/s; dimensions are converted from mm to m.
    const holeM = values.openHoleId / 1000;
    const pipeM = values.pipeOd / 1000;
    const area = Math.PI / 4 * (holeM * holeM - pipeM * pipeM);
    const velocity = area > 0 ? (values.flow / 1000) / area : NaN;
    if (!Number.isFinite(velocity)) warnings.push('环空几何无效，不能计算名义环空流速。');

    this.setData({
      warnings,
      annularVelocity: Number.isFinite(velocity) ? `${velocity.toFixed(2)} m/s` : '--',
      validation: warnings.length ? '存在待核验项' : '基础输入校验通过',
      ecdStatus: '未计算：需导入完整轨迹、分段钻具/环空几何及经验证的温压流变模型',
      cleanStatus: '未判断：需经验证的携岩模型和完整工况数据'
    });
  },

  labelFor(key) {
    const labels = {
      depth: '当前井深', casingDepth: '套管下深', casingId: '套管内径',
      openHoleId: '裸眼井径', pipeOd: '钻柱外径', mudDensity: '泥浆密度',
      flow: '排量', rpm: '转速', ropMinPerM: '钻时', standpipe: '立压',
      mudTemp: '流变测试温度', bottomTemp: '井底温度', cutSize: '岩屑粒径',
      cutDensity: '岩屑密度', pv: 'PV', yp: 'YP'
    };
    return labels[key] || key;
  }
});
