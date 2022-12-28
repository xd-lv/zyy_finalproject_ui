<template>
  <div class="execution">
    <basic-container>
      <div class="data-manage">
        <a-page-header ref="data-manage-page-header" />
        <div :style="{ height: divHeight }">
          <div style="margin: 10px 80px">
            <a-card
              style="width: 100%; color: #0046b9; background: #d5e7ff"
              :bordered="false"
              size="small"
              :hoverable="true"
            >
              <p style="display: flex">
                <a-icon
                  style="margin-right: 10px; fontsize: 18px"
                  type="exclamation-circle"
                />此免费存储空间存储上限为500GB，超过15天未登陆，免费存储空间数据将被清空。
              </p>
            </a-card>
          </div>
          <div style="margin: 20px 80px">
            <a-button
              style="margin-right: 12px"
              type="primary"
              size="small"
              @click="upFile"
            >
              上传文件
            </a-button>
            <a-button
              style="margin-right: 12px"
              size="small"
              @click="createFolderShow = true"
            >
              创建文件夹
            </a-button>
            <a-popconfirm
              placement="bottom"
              :title="text"
              @confirm="delSelected"
              okText="Yes"
              cancelText="No"
            >
              <a-button type="danger" size="small"> 批量删除 </a-button>
            </a-popconfirm>
          </div>
          <!-- 文件路径显示 -->
          <div style="margin: 20px 80px 10px 89px">
            <a-breadcrumb style="margin: 5px; min-height: 33px" separator=">">
              <a-breadcrumb-item v-for="(item, index) in routes" :key="index">
                <a-button
                  type="link"
                  @click="breadcrumbOnClick(index)"
                  value="small"
                  v-if="index == 0"
                  icon="home"
                />
                <a-button
                  style="padding: unset"
                  type="link"
                  @click="breadcrumbOnClick(index)"
                  value="small"
                  v-else
                  >{{ item.name }}</a-button
                >
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <!-- 文件属性显示列表 -->
          <div style="margin: 0px 80px">
            <a-table
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              :columns="tableColumns"
              :data-source="tableData"
              :loading="isLoading"
            >
              <span slot="name" slot-scope="text, tableData">
                <span v-if="tableData.isDir"
                  ><a-icon style="margin-right: 5px" type="folder" /><a
                    class="folder-link"
                    @click="onClickDir(tableData)"
                    >{{ text }}</a
                  ></span
                >
                <span v-else
                  ><a-icon style="margin-right: 5px" type="file" />{{
                    text
                  }}</span
                >
              </span>
              <span slot="customTitle"
                ><a-icon type="align-left" /> 文件名</span
              >
              <span slot="action" slot-scope="text, tableData">
                <a-popconfirm
                  title="确定删除文件吗?"
                  @confirm="() => onDelete(tableData)"
                >
                  <a>删除</a>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a>复制路径</a>
                <span v-if="!tableData.isDir">
                  <a-divider type="vertical" />
                  <a :href="tableData.url">下载</a>
                </span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <el-dialog
        title="上传文件"
        :visible.sync="upFileShow"
        class="avue-dialog"
        v-dialogdrag
        width="35%"
        @close="reloadFile"
        :close-on-click-modal="false"
      >
        <el-row :span="24">
          <a-card
            style="width: 100%; color: #1890ff; background: #ffffff"
            :bordered="false"
            size="small"
            :hoverable="true"
          >
            <p style="display: flex">
              <a-icon
                style="margin-right: 10px; fontsize: 24px"
                type="exclamation-circle"
              />即将上传到：{{ "/" + this.filepath }}
            </p>
          </a-card>
        </el-row>
        <el-row :span="24">
          <el-col :span="24">
            <uploader :options="fileoptions" class="uploader-style">
              <uploader-unsupport></uploader-unsupport>
              <uploader-btn class="left">选择文件</uploader-btn>
              <uploader-btn :directory="true" class="right"
                >选择文件夹</uploader-btn
              >
              <uploader-drop>
                <p>可以把文件拖拽到这上传</p>
              </uploader-drop>
              <uploader-list></uploader-list>
            </uploader>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="upFileShow = false">取 消</el-button> -->
          <el-button type="primary" @click="reloadFile">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="创建文件夹"
        :visible.sync="createFolderShow"
        class="avue-dialog"
        v-dialogdrag
        width="35%"
      >
        <el-row :span="24">
          <a-card
            style="width: 100%; color: #1890ff; background: #ffffff"
            :bordered="false"
            size="small"
            :hoverable="true"
          >
            <p style="display: flex">
              <a-icon
                style="margin-right: 10px; fontsize: 24px"
                type="exclamation-circle"
              />文件夹位置：{{ "/" + this.filepath }}
            </p>
          </a-card>
        </el-row>
        <el-row :span="24">
          <el-col :span="24">
            <el-input
              placeholder="请输入新文件夹名"
              v-model="FolderName"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanDialog">取 消</el-button>
          <el-button type="primary" @click="createFolder">创建</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { createObjFolder, delFolder, delSelectedFolder } from '@/api/dataset'
import Vue from 'vue'
import uploader from 'vue-simple-uploader'
import store from '@/store'
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'

Vue.use(uploader)

const text = 'Are you sure to delete this task?'

const tableColumns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    key: 'size'
  },
  {
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
];
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      divHeight: '1px',
      routes: [{}],
      tableColumns,
      tableData: [],
      selectedRowKeys: [],
      selectedRows: [],
      filepath: '',
      upFileShow: false,
      upFileFloaderShow: false,
      createFolderShow: false,
      FolderName: '',
      downloadPath: '',
      text: '确定批量删除选择项吗？',
      isLoading: false,
      fileoptions: {
        target: '/data/bucket/upload',
        testChunks: false,
        chunkSize: 100 * 1024 * 1024 * 1024,
        simultaneousUploads: 5,
        allowDuplicateUploads: true,
        fileParameterName: 'file',
        headers: {
          Authorization: 'Bearer ' + store.getters.access_token
        },
        query: {
          ossPath: 'examples'
        },
      },
      fileattrs: {
        accept: 'image/*'
      },
      filefloaderoptions: {
        target: '/data/bucket/upload',
        testChunks: false,
        chunkSize: 100 * 1024 * 1024 * 1024,
        simultaneousUploads: 5,
        allowDuplicateUploads: true,
        fileParameterName: 'file',
        headers: {
          Authorization: 'Bearer ' + store.getters.access_token
        },
        query: {
          ossPath: ''
        }
      },
      filefloaderattrs: {
        accept: 'image/*'
      }
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.divHeight =
    //     document.body.clientHeight -
    //     this.$refs['data-manage-page-header'].$el.offsetTop -
    //     this.$refs['data-manage-page-header'].$el.offsetHeight +
    //     'px'
    // })
    this.getTableData(this.rootPath)
  },
  methods: {
    upFile() {
      this.fileoptions.query.ossPath = this.filepath
      this.upFileShow = true
    },
    loadUpData() {
      this.upFileShow = false
      this.createFolderShow = false
      this.FolderName = ''
      this.getTableData()
    },
    createFolder() {
      let path = this.filepath + this.FolderName + '/'
      createObjFolder(path)
        .then((response) => {})
        .catch(() => {})
      this.isLoading = true
      setTimeout(() => {
        this.loadUpData()
        this.isLoading = false
      }, 1000)
    },
    cleanDialog() {
      this.upFileShow = false
      this.createFolderShow = false
      this.FolderName = ''
    },
    breadcrumbOnClick(index) {
      let len = this.routes.length
      for (let idx = index + 1; idx < len; ++idx) {
        this.routes.pop()
      }
      let pathArray = new Array()
      this.uppath = ''
      for (let idx = 0; idx < this.routes.length; idx++) {
        pathArray.push(this.routes[idx].path)
      }
      let rootPath = pathArray.join('/')
      if (index == 0) {
        this.filepath = ''
      } else {
        this.filepath = rootPath.slice(1) + '/'
      }
      this.getPath(this.filepath)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getTableData() {
      this.getPath(this.filepath)
    },
    onClickDir(data) {
      this.routes.push({
        name: data.name,
        path: data.name
      })
      this.breadcrumbOnClick(this.routes.length)
    },
    getPath(fileparam) {
      this.axios
        .get('/data/bucket/getObjects', {
          params: {
            prefix: fileparam,
            recursive: false
          },
          headers: {
            nprogressDisable: true
          }
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data
          } else {
            this.$notification.error({
              message: '获取目录失败',
              description: '获取目录失败'
            })
          }
        })
        .catch((err) => {
          this.$notification.error({
            message: '获取目录失败',
            description: '获取目录失败'
          })
        });
    },
    onDelete(tableData) {
      delFolder(this.filepath, this.filepath + tableData.name);
      this.isLoading = true
      setTimeout(() => {
        this.loadUpData()
        this.isLoading = false
      }, 1000)
    },
    reloadFile() {
      this.isLoading = true
      setTimeout(() => {
        this.loadUpData()
        this.isLoading = false
        this.upFileShow = false
      }, 1000)
    },
    delSelected() {
      let filenameArray = new Array();
      for (var i = 0; i < this.selectedRows.length; i++) {
        filenameArray.push(this.selectedRows[i].name)
      }
      delSelectedFolder(
        Object.assign({
          prefix: this.filepath,
          filename: filenameArray
        })
      );
      setTimeout(() => {
        this.loadUpData()
        this.isLoading = false
      }, 1000)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  watch: {
    rootPath() {
      this.getTableData()
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
</style>
