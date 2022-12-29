<template>
  <div class="app-container"  style="background-color: #f3f3f3; height: 900px">
    <el-row style="margin-bottom: 20px">
      <el-col :span=3><h2>零信任认证管理</h2></el-col>
    </el-row>

    <el-row>
      <el-col span="4">
        信誉值阈值：<el-input type="number" v-model="creditThreshold" style="width: 150px"></el-input>
      </el-col>
      <el-col span="5" offset=1>
        请求次数阈值：<el-input type="number" v-model="reqThreshold" style="width: 150px"></el-input>
      </el-col>
      <el-col span=14 style="text-align: right">
        <el-button type="primary" size="medium" @click="changThreshold">保存</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <div style="background-color: white; height: 900px">
      <el-row>
        <el-col :span=2>
          <el-tree
            ref="tree2"
            :data="data2"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span=10 :offset=2 v-show="hintShow">
          <div>
            <h2>请选择站点和设备</h2>
          </div>
        </el-col>
        <el-col :span=20 :offset=2 v-show="!hintShow">

          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="ID" width="95">
              <template slot-scope="scope">
                {{ scope.$index }}
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="主体属性状态" width="200" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-show="scope.row.subject">已完成</el-tag>
                <el-tag type="danger" v-show="!scope.row.subject">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="环境属性状态" width="200" align="center">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.environment" type="success">已完成</el-tag>
                <el-tag v-show="!scope.row.environment" type="danger">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column  label="客体属性状态" width="200" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-show="scope.row.object">已完成</el-tag>
                <el-tag type="danger" v-show="!scope.row.object">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="200">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="drawer = true" type="primary" size="small" round>
                  编辑属性
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-drawer
        title="属性编辑"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">
        <div class="overflowAuto" style="margin-left: 20px; margin-bottom: 100px; width: 500px">
          <el-form ref="form" :model="form" label-width="150px" style="margin-right: 20px; ">
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
            <el-form-item label="IP网段">
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
            <el-form-item style="height: 100px">
              <div style="text-align: center">
                <el-button type="primary">保存</el-button>
              </div>
            </el-form-item>
            <el-divider></el-divider>
          </el-form>
        </div>
      </el-drawer>
    </div>

  </div>
</template>

<script>
import { axios } from "axios";

export default {

  data() {
    return {
      drawer: false,
      creditThreshold: '',
      reqThreshold: 0,
      direction: 'rtl',
      selectDevice: '',
      hintShow: true,
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
        type: 1,
        children: [{
          id: 4,
          type: 2,
          label: '设备1'
        }, {
          id: 5,
          type: 2,
          label: '设备2'
        }]
      }, {
        id: 2,
        label: '站点2',
        type: 1,
        children: [{
          id: 5,
          type: 2,
          label: '设备1'
        }, {
          id: 6,
          type: 2,
          label: '设备2'
        }]
      }, {
        id: 3,
        label: '站点3',
        type: 1,
        children: [{
          id: 7,
          type: 2,
          label: '设备1'
        }, {
          id: 8,
          type: 2,
          label: '设备2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: [
        {
          name: '节点1',
          subject: true,
          environment: true,
          object: true,
          createTime: '2022/12/1'
        }, {
          name: '节点2',
          subject: false,
          environment: false,
          object: false,
          createTime: '2022/12/1'
        }, {
          name: '节点3',
          subject: true,
          environment: false,
          object: true,
          createTime: '2022/12/1'
        }, {
          name: '节点4',
          subject: true,
          environment: true,
          object: true,
          createTime: '2022/12/1'
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  mounted() {
    axios.get('http://localhost:8100/config/get').then(res => {
      this.reqThreshold = res.data.data.reqThreshold
      this.creditThreshold = res.data.data.creditThreshold
    })
  },

  methods: {
    changThreshold() {
      axios.get('http://localhost:8100/config/update?reqThreshold=' + this.reqThreshold + '&creditThreshold=' + this.creditThreshold)
      alert('保存成功')
    },
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
    },

    handleNodeClick(data) {
      console.log(data)
      if (data.type == 2) {
        this.hintShow = false
        this.selectDevice = data
      }
    }
  }
}
</script>
<style>
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar{
  display: none;
}
.overflowAuto {
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

