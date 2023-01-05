<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
      <template slot="menuLeft" slot-scope="{ size }">
        <el-button
          :size="size"
          type="primary"
          icon="el-icon-plus"
          @click="createDrawer = !createDrawer"
        >创建数据集
        </el-button>
      </template>
    </avue-crud>
    </basic-container>

    <el-drawer
      title="构建数据集"
      :visible.sync="createDrawer"
      :direction="rtl"
      :before-close="handleClose"
      size="60%">
      <div class="darwer-border">
        <el-form label-position="top" :rules="formRules" :model="datasetForm" label-width="80px">
        <el-row>
          <el-col>
          <el-form-item label="数据集名称" prop="datasetName">
          <el-input v-model="datasetForm.datasetName" placeholder="请输入数据集名称" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="数据集描述" prop="datasetDesc">
          <el-input v-model="datasetForm.datasetDesc" placeholder="请输入数据集描述" />
        </el-form-item>
        <el-form-item label="数据格式" prop="datasetFormat">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in formatOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源选择" prop="datasetUrl">
          <div class="darwer-border">
            <el-transfer v-model="value" :data="data"></el-transfer>
          </div>
        </el-form-item>
        <el-form-item label="数据集节点选择" prop="datasetNode">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in nodeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button
          type="primary"
          @click="createDataset()"
        >确 定</el-button>
      </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { tableOption } from '@/const/crud/dataset'
import axios from 'axios'

axios.defaults.withCredentials = false

export default {
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${ i }`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      tableData: [],
      tableOption: tableOption,
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      datasetForm: {
        datasetName: '',
        datasetDesc: '',
        datasetUrl: '',
        datasetFormat: '',
        datasetNode: ''
      },
      data: generateData(),
      value: [1, 4],
      createDrawer: false,
      nodeOptions: [{
        value: '选项1',
        label: '黄金糕'
      }],
      formatOptions: [{
        value: '选项1',
        label: '黄金糕'
      }],
      timer: null, // 轮询定时器
      timerNum: 10000 // 设置定时器时间ms
    }
  },
  created() {
    this.getAllStatus()
  },
  methods: {
    createDataset() {
      // datasetForm
      console.log(this.datasetForm)
      const formdata = new FormData()
      formdata.append('datasetname', this.datasetForm.datasetName)
      formdata.append('datasetdesc', this.datasetForm.datasetDesc)
      formdata.append('dataseturl', this.datasetForm.datasetUrl)
      formdata.append('datasetformat', this.datasetForm.datasetFormat)
      formdata.append('nodeid', 1)
      formdata.append('userid', 1023414272)
      axios({
        url: 'http://localhost:8080/finalprojectgo/dataset/create/',
        method: 'POST',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((data) => {
          this.$message.$message('数据集创建成功')
        })
        .catch(() => {
          this.$message.error('数据集创建失败')
        })

      this.createDrawer = !this.createDrawer
    },
    getAllStatus() {
      this.timer = setInterval(() => {
        // 创建定时器
        // getStatus()
        axios({
          url: 'http://localhost:8080/finalprojectgo/dataset/list/',
          method: 'GET'
        })
          .then((data) => {
            console.log(data)
            this.tableData = data.data.Data.data
          })
          .catch(() => {
            this.$message.error('数据集状态无法获取')
            clearInterval(this.timer)
            this.timer = null
          })
      }, this.timerNum)
    },
    getList(page, params) {
      this.tableLoading = true
      axios({
        url: 'http://localhost:8080/finalprojectgo/dataset/page/',
        method: 'GET',
        params: Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchForm
        )
      })
        .then((response) => {
          console.log(response)
          this.tableData = response.data.Data.data
          this.page.total = response.data.Data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>

<style>
.uploader-style {
  width: 100%;
  padding: 0px;
  margin: 5px auto 0;
  font-size: 16px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); */
}

.uploader-style .uploader-btn {
  border-color: #1890ff;
  width: 49%;
  margin-right: 0;
  text-align: center;
}

.left {
  float: left;
}

.right {
  float: right;
}

.uploader-style .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.uploader-style .uploader-drop {
  background-color: #ffffff;
  padding: 50px;
}

element.style {
  padding: 0;
}

.data-manage {
  height: 100%;
  width: 100%;
  background: #fff;
  overflow-y: auto;
}

.data-manage>>>.ant-page-header-heading-title {
  font-size: 18px;
}

.data-manage>>>.ant-card-body>p {
  margin: 5px 10px;
}

.data-manage>>>.folder-link:hover {
  text-decoration: underline;
}
</style>
