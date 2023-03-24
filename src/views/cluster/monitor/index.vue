<template>
  <div class="app-container" style="background-color: #efefef; height: 100%">
    <el-row>
      <el-col span="3">
        <h2>集群监控</h2>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="事件活动" name="second">
        <div class="block">
          <el-row>
            <el-card class="box-card card-height card" :style="conheight">
              <el-timeline>
                <el-timeline-item v-for="(item, index) in evenList" :key="index">
                  <el-card @click.native="getPath">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.timestamp }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-row>
        </div> 
      </el-tab-pane>
      <el-tab-pane label="服务日志" name="third">
        <div class="execution">
          <basic-container>
            <avue-crud
              ref="crud"
              :page.sync="page"
              :data="tableData"
              :permission="permissionList"
              :table-loading="tableLoading"
              :option="tableOption"
              :before-open="beforeOpen"
              @on-load="getList"
              @search-change="searchChange"
              @refresh-change="refreshChange"
              @size-change="sizeChange"
              @current-change="currentChange"
            >
              <template slot-scope="{type,size,row}" slot="menu">
                <el-button icon="el-icon-view" :size="size" :type="type" @click="view(row)">详细</el-button>
              </template>
              <template slot-scope="scope" slot="state">
                <el-tag type="warning" v-if="scope.row.state == 0">未上线</el-tag>
                <el-tag type="info" v-if="scope.row.state == 1">上线中</el-tag>
                <el-tag v-if="scope.row.state == 2" type="success">已上线</el-tag>
                <el-tag v-if="scope.row.state == 3" type="info">下线中</el-tag>
              </template>
            </avue-crud>
          </basic-container>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      title="服务日志"
      :visible.sync="drawer"
      :with-header="false"
      size="60%">
      <el-row>
        <h3>基本信息</h3>
        <div>
          {{ this.viewItem }}
        </div>
      </el-row>
      <el-row>
        <h3>日志信息</h3>
        <div
          style="height: 600px; margin-top: 20px; margin-right: 20px; margin-left: 20px; overflow-y: auto; position: absolute; width: 1480px; background-color: white; border-width: 2px; border-color: black"
        >
          <div v-for="log in logItem" style="margin-left: 10px">
            <div style="display: flex; text-align: left; height: 25px">
              <p>{{ log.date }}</p>
              <p v-show="log.level==='info'" style="color: green; margin-left: 10px">{{ log.level }}</p>
              <p v-show="log.level==='warning'" style="color: red; margin-left: 10px">{{ log.level }}</p>
              <p style="margin-left: 10px">{{ log.content }}</p>
            </div>
          </div>
        </div>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import axios from 'axios'
import { tableOption, setModelList } from '@/const/crud/logmodelservice'

axios.defaults.withCredentials = false

export default {
  data() {
    return {
      drawer: false,
      activeName: 'second',
      // card高度自适应
      conheight: {
        height: ''
      },
      tableData: [],
      tableOption: tableOption,
      eventQueryParams: {
        pageNum: 1,
        pageSize: 12,
        nodeName: null,
        categoryId: null,
        mac: null,
        tenantId: null,
        tenantName: null,
        isSys: null,
        status: null,
        nodeType: null,
        networkMethod: null
      },
      timer: null, // 轮询定时器
      timerNum: 10000, // 设置定时器时间ms
      evenList: [
        {
          name: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          name: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          name: '创建成功',
          timestamp: '2018-04-11'
        },
        {
          name: '活动按期开始',
          timestamp: '2018-04-15'
        }
      ],
      levelOption: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'info',
        label: '一般日志'
      }, {
        value: 'warning',
        label: '警告日志'
      }],
      logText: '   7:7   warning  Require self-closing on Vue.js custom components (<el-input>)           vue/html-self-closing\n',
      level: '',
      date: '',
      logItem: [],
      viewItem: []
    }
  },
  created() {
    this.getStatus()
    window.addEventListener('resize', this.getHeight) // card高度自适应
    this.getHeight() // card高度自适应
  },
  mounted() {
    setInterval(() => {
      this.getLog()
    }, 1000 * 5)
  },
  methods: {
    view(row) {
      // this.$message.success('自定义按钮'+ JSON.stringify(row));
      this.viewItem = row
      this.drawer = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // card高度自适应
    getHeight() {
      this.conheight.height = window.innerHeight - 170 + 'px'
    },
    beforeOpen(done, type) {
      if (['add', 'edit'].includes(type)) {
        getModelList()
          .then((data) => {
            setModelList(data.data.data)
            done()
          })
          .catch((e) => {
            console.log(e.message, e.name, e.lineNumber)
            this.$message.error('获取模型列表失败')
            done()
          })
      }
    },
    getList(page, params) {
      this.tableLoading = true
      // fetchList(
      //   Object.assign(
      //     {
      //       current: page.currentPage,
      //       size: page.pageSize,
      //     },
      //     params,
      //     this.searchForm
      //   )
      // )
      axios({
        url: 'http://localhost:8100/generalmodelservice/page',
        method: 'GET',
        params: Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchForm,
          {
            userId: 1023414272
          }
        )
      })
        .then((response) => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    getStatus() {
      this.timer = setInterval(() => {
        // 创建定时器
        // getStatus()
        axios({
          url: 'http://localhost:8100/generalmodelservice/allStatus',
          method: 'GET',
          params: {
            userId: 1023414272
          }
        })
          .then((data) => {
            var newStatus = data.data.data
            this.tableData.forEach((value) => {
              if (newStatus[value.modelServiceId]) {
                value.state =
                  newStatus[value.modelServiceId].modelServiceStatus
              }
            })
          })
          .catch(() => {
            this.$message.error('模型服务状态无法获取')
            clearInterval(this.timer)
            this.timer = null
          })
      }, this.timerNum)
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
    getLog() {
      var result = axios.get('http://localhost:8100/log/getAllLog').then(res => {
        console.log(res.data)
        this.logItem = res.data.data
      })
    },
    levelFilter() {
      console.log(this.level)
      switch (this.level) {
        case 'info':
          this.logItem = new Array()
          axios.get('http://localhost:8100/log/getAllLog').then(res => {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].level == 'info') {
                this.logItem.push(res.data.data[i])
              }
            }
          })
          break
        case 'warning':
          this.logItem = new Array()
          axios.get('http://localhost:8100/log/getAllLog').then(res => {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].level == 'warning') {
                this.logItem.push(res.data.data[i])
              }
            }
          })
          break
        case 'all':
          this.logItem = new Array()
          axios.get('http://localhost:8100/log/getAllLog').then(res => {
            this.logItem = res.data.data
          })
          break
      }
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

.data-manage >>> .ant-page-header-heading-title {
  font-size: 18px;
}

.data-manage >>> .ant-card-body > p {
  margin: 5px 10px;
}

.data-manage >>> .folder-link:hover {
  text-decoration: underline;
}

.el-card-define {
  min-height: 100%;
  height: 100%;
}

.el-card-define >>> .el-card__body {
  height: 100%;
}

.card {
  overflow-y: auto /* 开启滚动显示溢出内容 */
}
</style>
