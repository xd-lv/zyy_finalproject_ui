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
        :before-open="beforeOpen"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot-scope="scope" slot="state">
          <el-tag type="warning" v-if="scope.row.state == 0">未上线</el-tag>
          <el-tag type="info" v-if="scope.row.state == 1">上线中</el-tag>
          <el-tag type="success" v-if="scope.row.state == 2">已上线</el-tag>
          <el-tag type="info" v-if="scope.row.state == 3">下线中</el-tag>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            :size="scope.size"
            :type="scope.type"
            @click="online(scope.row)"
            v-if="scope.row.state == 0"
            >上线</el-button
          >
          <el-button
            :size="scope.size"
            :type="scope.type"
            @click="getPredictAPI(scope.row)"
            v-if="scope.row.state == 2"
          >
            获取API
          </el-button>
          <el-button
            :size="scope.size"
            :type="scope.type"
            @click="offline(scope.row)"
            v-if="scope.row.state == 2"
            >下线</el-button
          >
        </template>
        <template slot="menuLeft" slot-scope="{ size }">
          <el-button
            :size="size"
            type="primary"
            @click="createModelService()"
            icon="el-icon-plus"
            >创建模型服务
          </el-button>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog
      title="模型服务API"
      :visible.sync="modelServiceAPIShow"
      class="avue-dialog"
      v-dialogdrag
      width="50%"
      :close-on-click-modal="false"
    >
      <el-card class="box-card">
        <div style="font-size: 20px; padding: 15px 0">
          {{
            "url: " +
            modelServiceAPI.url +
            "?modelServiceId=" +
            modelServiceAPI.modelServiceId
          }}
        </div>
        <div style="font-size: 20px; padding: 15px 0">
          {{ "method: " + modelServiceAPI.method }}
        </div>
        <div style="font-size: 20px; padding: 15px 0">
          {{ 'multipart/form-data：{ "data": ' + modelServiceAPI.data + " }" }}
        </div>
      </el-card>
    </el-dialog>

    <el-dialog
      title="创建模型服务"
      :visible.sync="modelServiceCreate"
      class="avue-dialog"
      v-dialogdrag
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="darwer-border">
        <el-form
          label-position="top"
          :rules="formRules"
          :model="modelServiceForm"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="模型服务名称" prop="modelServiceName">
                <el-input
                  v-model="modelServiceForm.modelServiceName"
                  placeholder="请输入模型服务名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="模型服务描述" prop="modelServiceDesc">
                <el-input
                  v-model="modelServiceForm.modelServiceDesc"
                  placeholder="请输入模型服务描述"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item :span="6" label="模型" prop="modelServiceModel">
              <el-select
                @change="getModelResource"
                v-model="modelServiceForm.modelServiceModel"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in modelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="实例数" prop="instanceNum">
              <el-input-number
                v-model="modelServiceForm.instanceNum"
                :min="1"
                :max="10"
                label="实例数"
              ></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="运行CPU资源" prop="runResourceCpu">
              <el-slider
                v-model="modelServiceForm.runResourceCpu"
                :step="1"
                :max="9"
                :min="0"
                :marks="marksCPU"
                :show-tooltip="false"
                style="margin: 0px 20px"
              >
              </el-slider>
            </el-form-item>
            <el-form-item label="运行GPU资源" prop="runResourceGpu">
              <el-slider
                v-model="modelServiceForm.runResourceGpu"
                :step="1"
                :max="3"
                :min="0"
                :marks="marksGPU"
                :show-tooltip="false"
                style="margin: 0px 20px"
              >
              </el-slider>
            </el-form-item>
            <el-form-item label="运行内存资源" prop="runResourceMem">
              <el-slider
                v-model="modelServiceForm.runResourceMem"
                :step="1"
                :max="8"
                :min="0"
                :marks="marksMEM"
                :show-tooltip="false"
                style="margin: 0px 20px"
              >
              </el-slider>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModelService()"
          >创建模型服务</el-button
        >
        <el-button type="type" @click="modelServiceCreate = !modelServiceCreate"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  onlineObj,
  offlineObj,
  getStatus,
  getModelList,
  getAPI,
} from "@/api/modelservice";
import { tableOption, setModelList } from "@/const/crud/modelservice";
import { mapGetters } from "vuex";
import axios from 'axios'

axios.defaults.withCredentials = false

export default {
  name: "modelservice",
  data() {
    return {
      modelList: [],
      modelServiceForm: {
        modelServiceName: "",
        modelServiceDesc: "",
        modelServiceModel: "",
        instanceNum: 1,
        runResourceCpu: 1,
        runResourceGpu: 0,
        runResourceMem: 3,
      },
      modelServiceCreate: false,
      modelServiceAPIShow: false,
      modelServiceAPI: {
        url: "",
        method: "post",
        modelServiceId: "",
        data: "",
      },
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      timer: null, // 轮询定时器
      timerNum: 10000, // 设置定时器时间ms
      marksCPU: {
        0: "0.5",
        1: "1",
        2: "2",
        3: "4",
        4: "6",
        5: "8",
        6: "10",
        7: "12",
        8: "14",
        9: "16",
      },
      marksGPU: {
        0: "0",
        1: "1",
        2: "2",
        3: "4",
      },
      marksMEM: {
        0: "100Mi",
        1: "200Mi",
        2: "500Mi",
        3: "1Gi",
        4: "2Gi",
        5: "4Gi",
        6: "8Gi",
        7: "16Gi",
        8: "32Gi",
      },
    };
  },
  created() {
    this.getStatus();
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        // addBtn: this.vaildData(this.permissions.aiPlatform_modelservice_add, false),
        // delBtn: this.vaildData(this.permissions.aiPlatform_modelservice_del, false),
        // editBtn: this.vaildData(this.permissions.aiPlatform_modelservice_edit, false)
      };
    },
  },
  methods: {
    createModelService() {
      this.modelServiceCreate = true;
      getModelList().then((data) => {
        this.modelList = data.data.data;
      });
    },
    getModelResource(modelId) {
      this.axios.get("/aiplatform/models/" + modelId).then((res) => {
        console.log(res.data.data.runResourceCpu);
        console.log(res.data.data.runResourceGpu);
        console.log(res.data.data.runResourceMem);
        this.modelServiceForm.runResourceGpu = res.data.data.runResourceGpu;
        this.modelServiceForm.runResourceMem = res.data.data.runResourceMen;
        this.modelServiceForm.runResourceCpu = res.data.data.runResourceCpu;
      });
    },
    getList(page, params) {
      this.tableLoading = true;
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
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function (row, index) {
      this.$confirm("是否确认删除ID为" + row.modelServiceId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.modelServiceId);
        })
        .then((data) => {
          this.$message.success("删除成功");
          this.getList(this.page);
        });
    },
    handleUpdate: function (row, index, done, loading) {
      putObj(row)
        .then((data) => {
          this.$message.success("修改成功");
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    saveModelService() {
      var cpulist = [0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16];
      var gpulist = [0, 1, 2, 4];
      var memlist = [
        "100Mi",
        "200Mi",
        "500Mi",
        "1Gi",
        "2Gi",
        "4Gi",
        "8Gi",
        "16Gi",
        "32Gi",
      ];
      var row = Object.assign({
        modelId: this.modelServiceForm.modelServiceModel,
        modelServiceDesc: this.modelServiceForm.modelServiceDesc,
        modelServiceId: "",
        modelServiceName: this.modelServiceForm.modelServiceName,
        replicas: this.modelServiceForm.instanceNum,
        resourceCpu: cpulist[this.modelServiceForm.runResourceCpu],
        resourceGpu: gpulist[this.modelServiceForm.runResourceGpu],
        resourceMem: memlist[this.modelServiceForm.runResourceMem],
        state: "",
        updateTime: "",
      });
      console.log(row);
      addObj(row)
        .then((data) => {
          this.$message.success("添加成功");
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
      this.modelServiceCreate = false;
    },
    handleSave: function (row, done, loading) {
      console.log(row);
      addObj(row)
        .then((data) => {
          this.$message.success("添加成功");
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    refreshChange() {
      this.getList(this.page);
    },
    online(row) {
      console.log(row);
      onlineObj(row)
        .then((data) => {
          this.$message.success("模型服务上线中，请稍候");
          this.getList(this.page);
        })
        .catch(() => {
          this.$message.error("模型服务上线失败");
        });
    },
    getPredictAPI(row) {
      getAPI(row)
        .then((data) => {
          this.modelServiceAPI.url = data.data.data.url;
          this.modelServiceAPI.method = data.data.data.method;
          this.modelServiceAPI.modelServiceId = data.data.data.modelServiceId;
          this.modelServiceAPI.data = data.data.data.data;
          console.log(this.modelServiceAPI);
          this.modelServiceAPIShow = true;
        })
        .catch(() => {
          this.$message.error("获取模型API失败");
        });
    },
    offline(row) {
      offlineObj(row)
        .then((data) => {
          this.$message.success("模型服务下线中");
          this.getList(this.page);
        })
        .catch(() => {
          this.$message.error("模型服务下线失败");
        });
    },
    beforeOpen(done, type) {
      if (["add", "edit"].includes(type)) {
        getModelList()
          .then((data) => {
            setModelList(data.data.data);
            done();
          })
          .catch((e) => {
            console.log(e.message, e.name, e.lineNumber);
            this.$message.error("获取模型列表失败");
            done();
          });
      }
    },
    getStatus() {
      this.timer = setInterval(() => {
        //创建定时器
        // getStatus()
        axios({
          url: 'http://localhost:8100/generalmodelservice/allStatus',
          method: 'GET',
          params: {
            userId: 1023414272
          }
        })
          .then((data) => {
            var newStatus = data.data.data;
            this.tableData.forEach((value) => {
              if (newStatus[value.modelServiceId]) {
                value.state =
                  newStatus[value.modelServiceId].modelServiceStatus;
              }
            });
          })
          .catch(() => {
            this.$message.error("模型服务状态无法获取");
            clearInterval(this.timer);
            this.timer = null;
          });
      }, this.timerNum);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
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
