export const tableOption = {
  simplePage: true,
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  searchMenuSpan: 6,
  addBtn: false,
  // addBtnText: '创建模型',
  column: [
    {
      type: "input",
      label: "数据集ID",
      prop: "dataset_id",
      hide: true,
      editDisplay: false,
      addDisplay: false,
    },
    {
      type: "input",
      label: "数据集名称",
      prop: "dataset_name",
    },
    {
      type: "input",
      label: "数据集描述",
      prop: "dataset_desc",
    },
    {
      label: "数据集类型",
      prop: "dataset_format",
      type: "select",
      rules: [
        {
          required: true,
          message: "请选择选择框",
        },
      ],
      dicData: [
        {
          label: "csv",
          value: 1,
        },
        {
          label: "txt",
          value: 2,
        },
      ],
    },
    {
      type: "input",
      label: "dataset-url",
      prop: "dataset_url",
      viewDisplay: false,
      showColumn: false,
    },
    {
      type: "input",
      label: "所属用户ID",
      prop: "user_id",
      viewDisplay: false,
      showColumn: false,
    },
    {
      type: "input",
      label: "数据集创建时间",
      prop: "create_time",
      editDisplay: false,
      addDisplay: false,
      viewDisplay: false,
      showColumn: false,
    },
    {
      type: "input",
      label: "数据集更新时间",
      prop: "update_time",
      editDisplay: false,
      addDisplay: false,
      viewDisplay: false,
      showColumn: false,
    },
  ],
};