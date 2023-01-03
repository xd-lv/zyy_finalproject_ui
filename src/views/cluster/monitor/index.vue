<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="事件活动" name="second">
      <div class="block">
        <el-row>
          <el-card class="box-card card-height" :style="conheight">
            <ul
              class="infinite-list"
              v-infinite-scroll="load"
              style="overflow: auto"
            >
              <li v-for="i in count" class="infinite-list-item">{{ i }}</li>
            </ul>
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
                >上线
              </el-button>
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
              >
                下线</el-button
              >
            </template>
          </avue-crud>
        </basic-container>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from "axios";

axios.defaults.withCredentials = false;

export default {
  data() {
    return {
      activeName: "second",
      // card高度自适应
      conheight: {
        height: "",
      },
      tableData: [],
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
        networkMethod: null,
      },
      evenList: [
        {
          name: "活动按期开始",
          timestamp: "2018-04-15",
        },
        {
          name: "通过审核",
          timestamp: "2018-04-13",
        },
        {
          name: "创建成功",
          timestamp: "2018-04-11",
        },
        {
          name: "活动按期开始",
          timestamp: "2018-04-15",
        },
      ],
    };
  },
  created() {
    this.getStatus();
    window.addEventListener("resize", this.getHeight); // card高度自适应
    this.getHeight(); // card高度自适应
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // card高度自适应
    getHeight() {
      this.conheight.height = window.innerHeight - 170 + "px";
    },
    getStatus() {
      this.timer = setInterval(() => {
        // 创建定时器
        // getStatus()
        axios({
          url: "http://localhost:8100/generalmodelservice/allStatus",
          method: "GET",
          params: {
            userId: 1023414272,
          },
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

.el-card-define {
  min-height: 100%;
  height: 100%;
}

.el-card-define >>> .el-card__body {
  height: 100%;
}
</style>