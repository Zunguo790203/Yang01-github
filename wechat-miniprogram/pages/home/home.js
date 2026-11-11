Page({
  data: {
    activeTab: '现场',
    form: {
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
      source: '录井图片（待核验）'
    },
    warnings: [],
    validation: '待计算',
    annularVelocity: '--',
    ecdStatus: '待计算',
    cleanStatus: '待计算',
    savedAt: '',
    summary: '尚未计算，先录入现场参数。',
    riskBadge: '待判定'
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

  chooseTab(event) {
    const tab = event.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  restoreSample() {
    this.setData({
      form: {
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
        source: '录井图片（待核验）'
      },
      warnings: [],
      validation: '样例已恢复',
      ecdStatus: '待计算',
      cleanStatus: '待计算',
      annularVelocity: '--',
      summary: '样例已加载，点击“校验并分析”进行计算。'
    });
  },

  saveSnapshot() {
    const savedAt = new Date().toLocaleString();
    const payload = {
      form: this.data.form,
      savedAt,
      results: {
        ecd: this.data.ecdStatus,
        annularVelocity: this.data.annularVelocity,
        transportIndex: this.data.cleanStatus,
        risk: this.data.riskBadge
      }
    };
    wx.setStorageSync('drillingFieldSnapshot', payload);
    wx.showToast({ title: '已保存', icon: 'success' });
    this.setData({ savedAt });
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
      mudDensity: Number(form.mudDensity),
      flow: Number(form.flow),
      rpm: Number(form.rpm),
      ropMinPerM: Number(form.ropMinPerM),
      standpipe: Number(form.standpipe),
      mudTemp: Number(form.mudTemp),
      bottomTemp: Number(form.bottomTemp),
      pv: Number(form.pv),
      yp: Number(form.yp),
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
      warnings.push('套管下深不应大于当前井深');
    }

    let velocity = '--';
    if (warnings.length === 0) {
      const holeM = numeric.openHoleId / 1000;
      const pipeM = numeric.pipeOd / 1000;
      const area = (Math.PI / 4) * (holeM * holeM - pipeM * pipeM);
      const resultVelocity = (numeric.flow / 1000) / area;
      velocity = `${resultVelocity.toFixed(2)} m/s`;
    }

    const risk = warnings.length === 0 ? '基础校验通过' : '待核验';
    const ecdState = warnings.length === 0 ? '基础输入通过，待工程模型标定' : '未通过';
    const cleanState = warnings.length === 0 ? '需补充温压流变与井段模型' : '待核验';

    this.setData({
      warnings,
      validation: warnings.length === 0 ? '基础输入校验通过' : '存在输入问题',
      annularVelocity: velocity,
      ecdStatus: ecdState,
      cleanStatus: cleanState,
      riskBadge: risk,
      summary: `井名：${form.wellName}；本机基础校验状态：${warnings.length === 0 ? '通过' : '待修正'}。当前结果仅用于趋势判断，不作为现场处置依据。`
    });

    wx.setStorageSync('drillingFieldSnapshot', {
      form,
      savedAt: this.data.savedAt,
      results: {
        ecd: ecdState,
        annularVelocity: velocity,
        transportIndex: cleanState,
        risk: risk
      }
    });
  }
});
