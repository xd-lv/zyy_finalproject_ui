<template>
  <div class="execution">
    <!-- <basic-container> -->
      <el-row>
      <el-col span="6">
        <h1>数据集管理</h1>
      </el-col>
    </el-row>
    <!-- </basic-container> -->
  </div>
</template>

<script>

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
