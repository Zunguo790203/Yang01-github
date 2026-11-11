Page({
  data: {
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
    warnings: [],
    validation: '待计算',
    annularVelocity: '--',
    transportIndex: '--',
    ecdStatus: '待计算',
    riskState: '待判定',
    savedAt: '',
    summary: '尚未计算。'
  },

  onLoad() {
    const saved = wx.getStorageSync('drillingFieldSnapshot');
    if (saved && saved.form) {
      this.setData({ form: saved.form, savedAt: saved.savedAt || '' });
    }
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ ['form.' + key]: event.detail.value });
  },

  restoreSample() {
    const form = {
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
    };
    this.setData({ form, warnings: [], validation: '样例已恢复', annularVelocity: '--', transportIndex: '--', ecdStatus: '待计算', riskState: '待判定', summary: '样例已加载，点击“校验并分析”。' });
  },

  saveSnapshot() {
    const savedAt = new Date().toLocaleString();
    const payload = {
      form: this.data.form,
      savedAt,
      results: {
        annularVelocity: this.data.annularVelocity,
        transportIndex: this.data.transportIndex,
        ecdStatus: this.data.ecdStatus,
        riskState: this.data.riskState
      }
    };
    wx.setStorageSync('drillingFieldSnapshot', payload);
    this.setData({ savedAt });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  calculate() {
    const form = this.data.form;
    const warnings = [];
    const numeric = {
      depth: Number(form.depth),
      casingDepth: Number(form.casingDepth),
      casingId: Number(form.casingId),
      openHoleId: Number(form.openHoleId),
      pipeOd: Number(form.pipeOd),
      pipeId: Number(form.pipeId),
      mudDensity: Number(form.mudDensity),
      funnelVisc: Number(form.funnelVisc),
      pv: Number(form.pv),
      yp: Number(form.yp),
      gel10: Number(form.gel10),
      gel30: Number(form.gel30),
      flow: Number(form.flow),
      rpm: Number(form.rpm),
      rop: Number(form.rop),
      standpipe: Number(form.standpipe),
      bottomTemp: Number(form.bottomTemp),
      cutSize: Number(form.cutSize),
      cutDensity: Number(form.cutDensity)
    };

    Object.keys(numeric).forEach(key => {
      if (!Number.isFinite(numeric[key]) || numeric[key] <= 0) {
        warnings.push(`${key} 请输入有效正数`);
      }
    });

    if (numeric.pipeOd >= numeric.openHoleId) {
      warnings.push('钻柱外径必须小于裸眼井径');
    }
    if (numeric.casingDepth >= numeric.depth) {
      warnings.push('套管下深不应超过当前井深');
    }

    let annularVelocity = '--';
    let transportIndex = '--';
    let riskState = '待判定';
    let ecdStatus = '待工程模型标定';

    if (warnings.length === 0) {
      const holeM = numeric.openHoleId / 1000;
      const pipeM = numeric.pipeOd / 1000;
      const area = (Math.PI / 4) * (holeM * holeM - pipeM * pipeM);
      const v = (numeric.flow / 1000) / area;
      annularVelocity = `${v.toFixed(2)} m/s`;

      const densityDelta = Math.max(numeric.cutDensity - numeric.mudDensity, 0.05);
      const slip = 0.063 * Math.sqrt(densityDelta * numeric.cutSize);
      const ti = v / (slip + 0.08 + numeric.rop * 0.02);
      transportIndex = `${ti.toFixed(2)}`;

      riskState = ti > 1.3 ? '良好' : (ti > 0.9 ? '中等' : '偏危险');
      ecdStatus = '基础几何校验通过；温压修正模型仍需进一步现场标定';
    }

    this.setData({
      warnings,
      validation: warnings.length === 0 ? '基础输入校验通过' : '存在输入问题',
      annularVelocity,
      transportIndex,
      ecdStatus,
      riskState,
      summary: warnings.length === 0
        ? `井名：${form.wellName}；名义环空流速 ${annularVelocity}，岩屑运移指数 ${transportIndex}，当前风险判定：${riskState}。注意：本原型仅用于趋势判断，不作为井控或施工决策依据。`
        : '存在输入问题，请核对井径、排量、深度和钻柱尺寸后再计算。',
    });

    wx.setStorageSync('drillingFieldSnapshot', {
      form,
      savedAt: this.data.savedAt,
      results: {
        annularVelocity,
        transportIndex,
        ecdStatus,
        riskState
      }
    });
  }
});
