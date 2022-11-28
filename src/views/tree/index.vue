<template>
  <div class="app-container"  style="background-color: #efefef; height: 100%">
    <el-row>
      <el-col span="3"><h2>零信任认证管理</h2></el-col>
    </el-row>
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <div style="background-color: white">
      <el-row>
        <el-col span="2">
          <el-tree
            ref="tree2"
            :data="data2"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            default-expand-all
          />
        </el-col>
        <el-col span="10" offset="2">
          <el-form ref="form" :model="form" label-width="140px">
            <h2>主体属性</h2>
            <el-form-item label="MAC地址">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="请求协议">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="设备ID">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="设备厂商">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="请求服务路径">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-divider></el-divider>

            <h2>环境属性</h2>
            <el-form-item label="IP">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="上线时间范围">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="上次请求时间间隔">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-divider></el-divider>

            <h2>客体属性</h2>
            <el-form-item label="所属部门">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="管理人员">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="授权时间">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="授权级别">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      data2: [{
        id: 1,
        label: '站点1',
        children: [{
          id: 4,
          label: '设备1'
        }, {
          id: 5,
          label: '设备2'
        }]
      }, {
        id: 2,
        label: '站点2',
        children: [{
          id: 5,
          label: '设备1'
        }, {
          id: 6,
          label: '设备2'
        }]
      }, {
        id: 3,
        label: '站点3',
        children: [{
          id: 7,
          label: '设备1'
        }, {
          id: 8,
          label: '设备2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

