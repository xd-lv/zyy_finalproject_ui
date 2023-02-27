export const tableOption = {
  'border': true,
  'index': true,
  'indexLabel': '序号',
  'stripe': true,
  'menu': true,
  'menuAlign': 'center',
  'align': 'center',
  'searchMenuSpan': 6,
  // "addTitle": "创建模型服务",
  // "addBtnText": "创建模型服务",
  addBtn: false,
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  'column': [
    {
      'type': 'input',
      'label': 'id',
      'prop': 'modelServiceId',
      editDisplay: false,
      addDisplay: false,
      viewDisplay: false,
      showColumn: false
    }, {
      'type': 'input',
      'label': '名称',
      'prop': 'modelServiceName',
      editDetail: true,
      rules: [{
        required: true,
        message: '请输入模型服务名称',
        trigger: 'blur'
      }]
    }, {
      'type': 'input',
      'label': '描述',
      'prop': 'modelServiceDesc'
    }, {
      'type': 'select',
      'label': '模型',
      'prop': 'modelId',
      rules: [{
        required: true,
        message: '请选择模型'
      }],
      dicData: []
    }, {
      'type': 'input',
      'label': '更新时间',
      'prop': 'updateTime',
      editDisplay: false,
      addDisplay: false
    }, {
      'type': 'input',
      'label': '服务状态', // 0-未上线, 1-上线中, 2-已上线, 3-下线中
      'prop': 'state',
      slot: true,
      editDisplay: false,
      addDisplay: false
    }, {
      'type': 'number',
      'label': '实例数',
      'prop': 'replicas',
      showColumn: false,
      'min-rows': 1,
      'max-rows': 10,
      'step': 1,
      'precision': 0,
      'value': 1,
      rules: [{
        required: true,
        message: '请设置模型服务实例数',
        trigger: 'blur'
      }]
    }, {
      'type': 'number',
      'label': 'CPU资源配置',
      'prop': 'resourceCpu',
      showColumn: false,
      'min-rows': 0.1,
      'max-rows': 32,
      'step': 1.0,
      'precision': 1,
      'value': 1.0,
      rules: [{
        required: true,
        message: '请设置notebook所需CPU资源',
        trigger: 'blur'
      }]
    }, {
      'type': 'number',
      'label': 'GPU资源配置',
      'prop': 'resourceGpu',
      showColumn: false,
      'min-rows': 0,
      'max-rows': 4,
      'step': 1,
      'precision': 0,
      'value': 0,
      rules: [{
        required: true,
        message: '请设置notebook所需GPU资源',
        trigger: 'blur'
      }]
    }, {
      'type': 'input',
      'label': '内存资源配置',
      'prop': 'resourceMem',
      showColumn: false,
      rules: [{
        required: true,
        message: '请输入合法内存资源(Mi,Gi)',
        validator: (rule, value, callback) => {
          var patt = /\d+(Mi|Gi)/
          if (!patt.test(value)) {
            callback(new Error('请输入合法内存资源(Mi,Gi)'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }]
    }]
}

export function setModelList(list) {
  for (var j = 0, len = tableOption.column.length; j < len; j++) {
    if (tableOption.column[j].prop == 'modelId') {
      tableOption.column[j].dicData = JSON.parse(JSON.stringify(list))
    }
  }
}
