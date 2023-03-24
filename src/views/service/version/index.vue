<template>
  <div class="execution">
    <!-- <basic-container> -->
    <template>
      <el-tabs :tab-position=tabPosition style="height: 100%;">
        <el-tab-pane label="通用模型服务">
          <el-card class="box-card" shadow="always" :body-style="{ padding: '20px' }">
            <el-steps :active="active" finish-status="success">
              <el-step title="选择服务"></el-step>
              <el-step title="版本查看"></el-step>
              <el-step title="新版本构建"></el-step>
              <el-step title="版本构建完成"></el-step>
            </el-steps>

            <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="联合推理服务">联合推理服务</el-tab-pane>
        <el-tab-pane label="增量学习服务">增量学习服务</el-tab-pane>
        <el-tab-pane label="版本删除">版本删除</el-tab-pane>
      </el-tabs>
    </template>
    <!-- </basic-container> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabPosition: 'left',
      active: 0
    }
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
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
