const FIELD_GROUPS = {
  well: [
    { key: 'wellName', label: '井名', type: 'text', unit: '', required: true },
    { key: 'depth', label: '当前井深', type: 'number', unit: 'm', required: true },
    { key: 'source', label: '数据来源', type: 'text', unit: '', required: true }
  ],
  structure: [
    { key: 'casingDepth', label: '套管下深', type: 'number', unit: 'm', required: true },
    { key: 'casingId', label: '套管内径', type: 'number', unit: 'mm', required: true },
    { key: 'openHoleId', label: '裸眼井径', type: 'number', unit: 'mm', required: true },
    { key: 'pipeOd', label: '钻柱外径', type: 'number', unit: 'mm', required: true },
    { key: 'pipeId', label: '钻柱内径', type: 'number', unit: 'mm', required: true }
  ],
  fluid: [
    { key: 'mudDensity', label: '泥浆密度', type: 'number', unit: 'g/cm³', required: true },
    { key: 'funnelVisc', label: '漏斗黏度', type: 'number', unit: 's', required: true },
    { key: 'pv', label: 'PV', type: 'number', unit: 'mPa·s', required: true },
    { key: 'yp', label: 'YP', type: 'number', unit: 'Pa', required: true },
    { key: 'gel10', label: '初切', type: 'number', unit: 'Pa', required: false },
    { key: 'gel30', label: '终切', type: 'number', unit: 'Pa', required: false }
  ],
  operation: [
    { key: 'flow', label: '排量', type: 'number', unit: 'L/s', required: true },
    { key: 'rpm', label: '转速', type: 'number', unit: 'rpm', required: true },
    { key: 'rop', label: '钻速', type: 'number', unit: 'min/m', required: true },
    { key: 'standpipe', label: '立压', type: 'number', unit: 'MPa', required: true },
    { key: 'bottomTemp', label: '井底温度', type: 'number', unit: '℃', required: true }
  ],
  cuttings: [
    { key: 'cutSize', label: '岩屑粒径', type: 'number', unit: 'mm', required: true },
    { key: 'cutDensity', label: '岩屑密度', type: 'number', unit: 'g/cm³', required: true },
    { key: 'notes', label: '备注', type: 'textarea', unit: '', required: false }
  ]
};

module.exports = FIELD_GROUPS;
