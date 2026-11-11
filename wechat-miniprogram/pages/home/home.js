Page({
  data: {
    groupNames: ['well', 'structure', 'fluid', 'operation', 'cuttings'],
    groups: {},
    form: {
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
      notes: '需要现场确认井深、井身段、测斜数据和温压修正模型。'
    },
    resultSummary: '尚未计算。',
    validationStatus: '待验证',
    ecdStatus: '待标定',
    riskState: '待判定',
    warnings: []
  },

  onLoad() {
    const fieldGroups = require('../../fieldGroups.js');
    this.setData({ groups: fieldGroups });
    const saved = wx.getStorageSync('drillingFieldSnapshot');
    if (saved && saved.form) {
      this.setData({ form: saved.form });
    }
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ ['form.' + key]: event.detail.value });
  },

  validate() {
    const form = this.data.form;
    const warnings = [];
    const values = {
      depth: Number(form.depth),
      casingDepth: Number(form.casingDepth),
      casingId: Number(form.casingId),
      openHoleId: Number(form.openHoleId),
      pipeOd: Number(form.pipeOd),
      pipeId: Number(form.pipeId),
      mudDensity: Number(form.mudDensity),
      flow: Number(form.flow),
      rpm: Number(form.rpm),
      rop: Number(form.rop),
      standpipe: Number(form.standpipe),
      bottomTemp: Number(form.bottomTemp),
      cutSize: Number(form.cutSize),
      cutDensity: Number(form.cutDensity),
      pv: Number(form.pv),
      yp: Number(form.yp)
    };

    Object.keys(values).forEach(key => {
      if (!Number.isFinite(values[key]) || values[key] <= 0) warnings.push(`${key} 请输入有效正数`);
    });

    if (values.pipeOd >= values.openHoleId) warnings.push('钻柱外径必须小于裸眼井径');
    if (values.casingDepth >= values.depth) warnings.push('套管下深应小于当前井深');

    let annularVelocity = '--';
    let transport = '--';
    let risk = '待判定';
    if (warnings.length === 0) {
      const area = (Math.PI / 4) * ((values.openHoleId / 1000) ** 2 - (values.pipeOd / 1000) ** 2);
      const vel = (values.flow / 1000) / area;
      annularVelocity = `${vel.toFixed(2)} m/s`;
      const slip = 0.063 * Math.sqrt(Math.max(values.cutDensity - values.mudDensity, 0.05) * values.cutSize);
      const ti = vel / (slip + 0.08 + values.rop * 0.02);
      transport = ti.toFixed(2);
      risk = ti > 1.3 ? '良好' : (ti > 0.9 ? '中等' : '偏危险');
    }

    this.setData({
      warnings,
      validationStatus: warnings.length === 0 ? '基础输入校验通过' : '存在输入问题',
      ecdStatus: warnings.length === 0 ? '基础结构校验通过，待正式温压修正模型' : '待标定',
      riskState: risk,
      resultSummary: warnings.length === 0
        ? `名义环空流速 ${annularVelocity}；岩屑运移指数 ${transport}；风险判定 ${risk}。注意：本原型不作为井控或施工决策依据。`
        : '存在输入问题，请修正后再计算。',
      annularVelocity,
      transportIndex: transport
    });
  },

  save() {
    const payload = {
      form: this.data.form,
      savedAt: new Date().toLocaleString(),
      results: {
        annularVelocity: this.data.annularVelocity,
        transportIndex: this.data.transportIndex,
        riskState: this.data.riskState,
        ecdStatus: this.data.ecdStatus,
        validationStatus: this.data.validationStatus
      }
    };
    wx.setStorageSync('drillingFieldSnapshot', payload);
    wx.showToast({ title: '已保存', icon: 'success' });
  }
});
