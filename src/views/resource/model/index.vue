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
          @click="createModel()"
        >创建模型
        </el-button>
      </template>
      <template slot="state" slot-scope="scope">
        <el-tag v-if="scope.row.state == 0" type="info">模型打包中</el-tag>
        <el-tag v-if="scope.row.state == 1" type="success">模型打包完成</el-tag>
        <el-tag v-if="scope.row.state == 2" type="warning">模型打包失败</el-tag>
      </template>
      <template slot="menu" slot-scope="{ type, size, row }">
        <el-button
          :size="size"
          :type="type"
          icon="el-icon-view"
          @click="showRow(row)"
        >显示</el-button>
      </template>
      <el-pagination
  background
  layout="prev, pager, next"
  :total="1000">
</el-pagination>
      </avue-crud>
    </basic-container>

    <el-dialog
      v-dialogdrag
      title="创建模型"
      :visible.sync="modelCreate"
      class="avue-dialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="darwer-border">
        <el-form
          label-position="top"
          :rules="formRules"
          :model="modelForm"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="模型名称" prop="modelName">
                <el-input
                  v-model="modelForm.modelName"
                  placeholder="请输入模型名称"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="模型描述" prop="modelDesc">
                <el-input
                  v-model="modelForm.modelDesc"
                  placeholder="请输入模型描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="模型类型" prop="modelType">
              <el-select
                @change="ModelTypeVisible"
                v-model="modelForm.modelType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="TorchServeVisible">
            <el-row>
              <el-form-item label="代码文件夹" prop="modelLink">
                <el-input
                  v-model="modelForm.modelLink"
                  :disabled="true"
                  @input="(e) => TSAfterFilePath(e)"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-folder"
                    @click="pathdrawer = true"
                  />
                </el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="TSAfterFilePathVisible">
              <el-row>
                <el-form-item :span="6" label="handler" prop="handlerType">
                  <el-select
                    @change="selectHandler"
                    v-model="modelForm.handlerType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in handleroptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :span="6"
                  v-if="HandlerFileVisible"
                  label="Handler文件"
                  prop="handlerFile"
                >
                  <el-input v-model="modelForm.handlerFile" :disabled="true">
                    <el-button
                      slot="append"
                      icon="el-icon-folder"
                      @click="pathdrawerHandler = true"
                    />
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="模型序列化文件" prop="modelSeri">
                  <el-input
                    @input="(e) => modelFileVisible(e)"
                    v-model="modelForm.modelSeri"
                    :disabled="true"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-folder"
                      @click="pathdrawerSeri = true"
                    />
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                  v-if="ModelFileVisible"
                  label="模型代码文件"
                  prop="modelFile"
                >
                  <el-input v-model="modelForm.modelFile" :disabled="true">
                    <el-button
                      slot="append"
                      icon="el-icon-folder"
                      @click="pathdrawerFile = true"
                    />
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="模型额外文件" prop="modelExtra">
                  <el-input v-model="modelForm.modelExtra" :disabled="true">
                    <el-button
                      slot="append"
                      icon="el-icon-folder"
                      @click="pathdrawerExtra = true"
                    />
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="Python Package" prop="modelPyton">
                  <el-input
                    v-model="modelForm.modelPyton"
                    placeholder="请输入模型所需PythonPackage，使用逗号分隔"
                  />
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="运行CPU资源" prop="runResourceCpu">
                  <el-slider
                    v-model="modelForm.runResourceCpu"
                    :step="1"
                    :max="9"
                    :min="0"
                    :marks="marksCPU"
                    :show-tooltip="false"
                    style="margin: 0px 20px"
                  />
                </el-form-item>
                <el-form-item label="运行GPU资源" prop="runResourceGpu">
                  <el-slider
                    v-model="modelForm.runResourceGpu"
                    :step="1"
                    :max="3"
                    :min="0"
                    :marks="marksGPU"
                    :show-tooltip="false"
                    style="margin: 0px 20px"
                  />
                </el-form-item>
                <el-form-item label="运行内存资源" prop="runResourceMem">
                  <el-slider
                    v-model="modelForm.runResourceMem"
                    :step="1"
                    :max="8"
                    :min="0"
                    :marks="marksMEM"
                    :show-tooltip="false"
                    style="margin: 0px 20px"
                  />
                </el-form-item>
              </el-row>
            </el-row>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModel()">创建模型</el-button>
        <el-button
          type="type"
          @click="modelCreate = !modelCreate"
        >取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="模型预览"
      :visible.sync="modelPreview"
      class="avue-dialog"
      v-dialogdrag
      width="50%"
    >
      <el-row>
        <el-col>
          <span> 模型名称： </span>
          <span id="modelNameView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型描述： </span>
          <span id="modelDescView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 创建时间： </span>
          <span id="modelTimeView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型类型： </span>
          <span id="modelTypeView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型handler： </span>
          <span id="modelHandlerView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型文件： </span>
          <span id="modelFileView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型序列化文件： </span>
          <span id="modelSeriView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型额外文件： </span>
          <span id="modelExtraView"> </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span> 模型所需Python包： </span>
          <span id="modelPythonView"> </span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="modelPreview = !modelPreview"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择代码文件夹" :visible.sync="pathdrawer" append-to-body>
      <el-tree
        :props="pathtreeprops"
        :load="treeloadNode"
        node-key="fullpath"
        ref="pathtree"
        :check-strictly="true"
        @check="handletreechoose"
        lazy
        show-checkbox
      />
    </el-dialog>
    <el-dialog
      title="选择Handler文件"
      :visible.sync="pathdrawerHandler"
      append-to-body
    >
      <el-tree
        :props="pathtreeprops"
        :load="treeloadNode"
        node-key="fullpath"
        ref="pathtree"
        :check-strictly="true"
        @check="handletreechooseHandler"
        lazy
        show-checkbox
      />
    </el-dialog>
    <el-dialog
      title="选择代码文件"
      :visible.sync="pathdrawerFile"
      append-to-body
    >
      <el-tree
        :props="pathtreeprops"
        :load="treeloadNode"
        node-key="fullpath"
        ref="pathtree"
        :check-strictly="true"
        @check="handletreechooseFile"
        lazy
        show-checkbox
      />
    </el-dialog>
    <el-dialog
      title="选择序列化文件"
      :visible.sync="pathdrawerSeri"
      append-to-body
    >
      <el-tree
        :props="pathtreeprops"
        :load="treeloadNode"
        node-key="fullpath"
        ref="pathtree"
        :check-strictly="true"
        @check="handletreechooseSeri"
        lazy
        show-checkbox
      />
    </el-dialog>
    <el-dialog
      title="选择额外文件"
      :visible.sync="pathdrawerExtra"
      append-to-body
    >
      <el-tree
        :props="pathtreeprops"
        :load="treeloadNode"
        node-key="fullpath"
        ref="pathtree"
        :check-strictly="true"
        lazy
        show-checkbox
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handletreechooseExtra"
        >确 定</el-button>
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
  getStatus
} from '@/api/models'
import { tableOption } from '@/const/crud/models'
import { mapGetters } from 'vuex'
import axios from 'axios'

axios.defaults.withCredentials = false

export default {
  name: 'models',
  data() {
    return {
      timer: null, // 轮询定时器
      timerNum: 10000, // 设置定时器时间ms
      modelPreview: false,
      modelCreate: false,
      pathdrawer: false,
      pathdrawerSeri: false,
      pathdrawerExtra: false,
      pathdrawerFile: false,
      pathdrawerHandler: false,
      HandlerFileVisible: false,
      ModelFileVisible: false,
      TorchServeVisible: false,
      TSAfterFilePathVisible: false,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      modelForm: {
        modelName: '',
        modelDesc: '',
        modelType: '',
        runResourceCpu: 1,
        runResourceGpu: 0,
        runResourceMem: 3
      },
      ormRules: {
        modelName: [{ required: true }]
      },
      options: [
        {
          value: '0',
          label: '用户自定义模型服务算子'
        },
        {
          value: '1',
          label: 'TorchServe'
        },
        {
          value: '2',
          label: 'TFServing'
        }
      ],
      value: '',
      handleroptions: [
        {
          value: 'image_classifier',
          label: 'image_classifier',
        },
        {
          value: 'object_detector',
          label: 'object_detector',
        },
        {
          value: 'text_classifier',
          label: 'text_classifier',
        },
        {
          value: 'image_segmenter',
          label: 'image_segmenter',
        },
        {
          value: 'user_defined',
          label: '用户自定义Handler',
        },
      ],
      handlervalue: '',
      modelLink: '',
      modelSeri: '',
      modelExtra: '',
      modelFile: '',
      marksCPU: {
        0: '0.5',
        1: '1',
        2: '2',
        3: '4',
        4: '6',
        5: '8',
        6: '10',
        7: '12',
        8: '14',
        9: '16'
      },
      marksGPU: {
        0: '0',
        1: '1',
        2: '2',
        3: '4'
      },
      marksMEM: {
        0: '100Mi',
        1: '200Mi',
        2: '500Mi',
        3: '1Gi',
        4: '2Gi',
        5: '4Gi',
        6: '8Gi',
        7: '16Gi',
        8: '32Gi'
      },
      pathtreeprops: {
        // 路径树配置
        label: 'label',
        children: 'children',
        isLeaf: function (data, node) {
          return data.isLeaf
        }
      }
    }
  },
  created() {
    this.getAllStatus()
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        // addBtn: this.vaildData(this.permissions.aiplatform_models_add, false),
        // delBtn: this.vaildData(this.permissions.aiplatform_models_del, false),
        // editBtn: this.vaildData(this.permissions.aiplatform_models_edit, false)
      }
    }
  },
  methods: {
    selectHandler(value) {
      console.log(value)
      if (value == 'user_defined') {
        this.HandlerFileVisible = true
      } else {
        this.HandlerFileVisible = false
      }
    },
    modelFileVisible(value1) {
      console.log(value1)
      if (value1.search('.pth') != -1) {
        this.ModelFileVisible = true
      } else {
        this.ModelFileVisible = false
      }
    },
    TSAfterFilePath(value) {
      console.log(value)
      this.TSAfterFilePathVisible = true
    },
    ModelTypeVisible(value) {
      console.log(value)
      if (value == 1) {
        this.TorchServeVisible = true
        console.log('23464q364363254623462436')
      }
    },
    createModel() {
      this.modelCreate = true
    },
    showRow(row) {
      console.log(row.modelId)
      this.axios.get('/aiplatform/models/' + row.modelId).then((res) => {
        var obj = eval('(' + res.data.data.modelInferenceSetting + ')')
        document.getElementById('modelNameView').innerHTML =
          res.data.data.modelName;
        document.getElementById('modelDescView').innerHTML =
          res.data.data.modelDesc;
        document.getElementById('modelTimeView').innerHTML =
          res.data.data.createTime;
        document.getElementById('modelTypeView').innerHTML =
          res.data.data.modelInferenceType;
        document.getElementById('modelHandlerView').innerHTML = obj['handler']
        document.getElementById('modelFileView').innerHTML = obj['model-file']
        document.getElementById('modelExtraView').innerHTML =
          obj['extra-files']
        document.getElementById('modelSeriView').innerHTML =
          obj['serialized-file']
        document.getElementById('modelPythonView').innerHTML =
          obj['python-packages']
      });
      this.modelPreview = true
    },
    getList(page, params) {
      this.tableLoading = true
      // fetchList(
      //   Object.assign(
      //     {
      //       current: page.currentPage,
      //       size: page.pageSize
      //     },
      //     params,
      //     this.searchForm
      //   )
      // )
      axios({
        url: 'http://localhost:8100/generalmodels/page',
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
        });
    },
    rowDel: function (row, index) {
      this.$confirm('是否确认删除ID为' + row.modelId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delObj(row.modelId)
        })
        .then((data) => {
          this.$message.success('删除成功')
          this.getList(this.page)
        });
    },
    handleUpdate: function (row, index, done, loading) {
      putObj(row)
        .then((data) => {
          this.$message.success('修改成功')
          done()
          this.getList(this.page)
        })
        .catch(() => {
          loading()
        })
    },
    saveModel() {
      var cpulist = ['0.5', '1', '2', '4', '6', '8', '10', '12', '14', '16']
      var gpulist = ['0', '1', '2', '4']
      var memlist = ['100Mi', '200Mi', '500Mi', '1Gi', '2Gi', '4Gi', '8Gi', '16Gi', '32Gi']
      // this.axios
      //   .get('/aiplatform/data/bucket/getUserBucketName')
      axios({
        url: 'http://localhost:8100/data/bucket/getUserBucketName',
        method: 'GET',
        params: {
          userId: 1023414272
        }
      })
        .then((res) => {
          var now = new Date()
          var time =
            now.getFullYear() +
            '_' +
            (now.getMonth() + 1) +
            '_' +
            now.getDate() +
            '_' +
            now.getHours() +
            '_' +
            now.getMinutes() +
            '_' +
            now.getSeconds()
          if (this.modelForm.modelFile == undefined) {
            this.modelForm.modelFile = ''
          }
          if (this.modelForm.handlerFile == undefined) {
            this.modelForm.handlerFile = ''
          }
          var FileStr = this.modelForm.modelFile.replace(
            this.modelForm.modelLink,
            './'
          )

          var SeriStr = this.modelForm.modelSeri.replace(
            this.modelForm.modelLink,
            './'
          )

          var ExtraStr = this.modelForm.modelExtra.replaceAll(
            this.modelForm.modelLink,
            './'
          )
          var charSet = 'abcdefghijklmnopqrstuvwxyz'
          var randomString = ''
          for (var i = 0; i < 10; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length)
            randomString += charSet.substring(randomPoz, randomPoz + 1)
          }
          var modelNameStr = randomString + '_' + time
          if (this.modelForm.handlerType == 'user_defined') {
            var handlerFileStr = this.modelForm.handlerFile.replace(
              this.modelForm.modelLink,
              './'
            )
          } else {
            var handlerFileStr = ''
          }

          console.log(res.data.data.bucketName)
          var modelLinkStr =
            res.data.data.bucketName + this.modelForm.modelLink

          var temprow = Object.assign({
            modelId: '',
            modelName: this.modelForm.modelName,
            modelDesc: this.modelForm.modelDesc,
            modelInferenceType: this.modelForm.modelType,
            modelInferenceSetting: Object.assign({
              'model-link': modelLinkStr,
              'model-name': modelNameStr,
              version: '1.0',
              'model-file': FileStr,
              'serialized-file': SeriStr,
              'export-path': '/output',
              'extra-files': ExtraStr,
              handler: this.modelForm.handlerType,
              handlerFile: handlerFileStr,
              'python-packages': this.modelForm.modelPyton
            }),
            runResourceCpu: cpulist[this.modelForm.runResourceCpu],
            runResourceGpu: gpulist[this.modelForm.runResourceGpu],
            runResourceMem: memlist[this.modelForm.runResourceMem],
            userId: '',
            createTime: '',
            updateTime: ''
          })
          console.log(this.modelForm.runResourceMem)
          console.log(temprow)
          addObj(temprow)
            .then((data) => {
              console.log('ok')
              this.$message.success('添加成功')
              //done();
              this.getList(this.page)
            })
            .catch(() => {
              //loading();
            })
          this.modelCreate = false
        })
    },
    handleSave: function (row, done, loading) {
      console.log(row)
      console.log(row.modelId)
      console.log(row.userId)
      var temprow = Object.assign({
        modelId: row.modelId,
        modelName: row.modelName,
        modelDesc: row.modelDesc,
        modelInferenceType: row.modelInferenceType,
        modelInferenceSetting: Object.assign({
          'model-link': row.model_link,
          'model-name': row.model_name,
          version: row.version,
          'model-file': row.model_file,
          'serialized-file': row.serialized_file,
          'export-path': row.export_path,
          'extra-files': row.extra_files,
          handler: row.handler,
          'python-packages': row.python_packages
        }),
        userId: row.userId,
        createTime: row.createTime,
        updateTime: row.updateTime
      });
      console.log(temprow.modelInferenceSetting)
      addObj(temprow)
        .then((data) => {
          //console.log(done);
          //console.log(loading);
          this.$message.success('添加成功')
          done();
          this.getList(this.page)
        })
        .catch(() => {
          loading()
        })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.getList(this.page)
    },
    treeloadNode(node, resolve) {
      console.log(this.modelForm.modelLink)

      if (node.level == 0) {
        if (this.modelForm.modelLink == undefined) {
          return resolve([{ fullpath: '/', label: '/' }])
        } else {
          return resolve([{ fullpath: this.modelForm.modelLink, label: this.modelForm.modelLink }])
        }
      } else {
        // 请求后端接口 结果resolve进去
        console.log(node)
        // console.log(node.data.fullpath.substr(1));
        console.log(node.data.hasOwnProperty('fullpath'))
        let pathprefix = node.data.fullpath.substr(1)
        console.log(pathprefix)
        // this.axios
        //   .get('/aiplatform/data/bucket/getFiles', {
        //     params: {
        //       prefix: pathprefix
        //     },
        //   })
        axios({
          url: 'http://localhost:8100/data/bucket/getFiles',
          method: 'GET',
          params: {
            prefix: pathprefix,
            userId: 1023414272
          }
        })
          .then((res) => {
            if (res.data.code == 200) {
              resolve(res.data.data)
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
          })
      }
    },
    handletreechoose(node) {
      this.$refs.pathtree.setCheckedNodes([node])
      this.modelForm.modelLink = node.fullpath
      this.TSAfterFilePathVisible = true
      this.pathdrawer = false
    },
    handletreechooseSeri(node) {
      this.$refs.pathtree.setCheckedNodes([node])
      this.modelForm.modelSeri = node.fullpath
      console.log(this.modelForm.modelSeri)
      if (this.modelForm.modelSeri.search('.pth') != -1) {
        this.ModelFileVisible = true
      } else {
        this.ModelFileVisible = false
      }
      console.log(this.ModelFileVisible)
      this.pathdrawerSeri = false
    },
    handletreechooseExtra() {
      console.log(this.$refs.pathtree.getCheckedNodes())
      //this.$refs.pathtree.setCheckedNodes([node]);

      this.modelForm.modelExtra =
        this.$refs.pathtree.getCheckedNodes()[0].fullpath
      for (var i = 1; i < this.$refs.pathtree.getCheckedNodes().length; i++) {
        this.modelForm.modelExtra =
          this.modelForm.modelExtra +
          ',' +
          this.$refs.pathtree.getCheckedNodes()[i].fullpath
      }
      console.log(this.modelForm.modelExtra)
      this.pathdrawerExtra = false
    },
    handletreechooseFile(node) {
      this.$refs.pathtree.setCheckedNodes([node])
      this.modelForm.modelFile = node.fullpath
      this.pathdrawerFile = false
    },
    handletreechooseHandler(node) {
      this.$refs.pathtree.setCheckedNodes([node])
      this.modelForm.handlerFile = node.fullpath
      this.pathdrawerHandler = false
    },
    getAllStatus() {
      this.timer = setInterval(() => {
        // 创建定时器
        // getStatus()
        axios({
          url: 'http://localhost:8100/generalmodels/allStatus',
          method: 'GET',
          params: {
            userId: 1023414272
          }
        })
          .then((data) => {
            console.log(data)
            var newStatus = data.data.data
            this.tableData.forEach((value) => {
              if (newStatus[value.modelId]) {
                value.state = newStatus[value.modelId].modelStatus
              }
            })
          })
          .catch(() => {
            this.$message.error('模型服务状态无法获取')
            clearInterval(this.timer)
            this.timer = null
          });
      }, this.timerNum)
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
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
