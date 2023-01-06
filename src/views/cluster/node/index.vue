<template>
  <div class="app-container" style="background-color: #efefef; height: 100%">
    <el-row>
      <el-col span="3">
        <h2>边云设备管理</h2>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="边缘集群管理" name="first">
        <el-row>
          <el-card style="margin-bottom: 5px">
            <el-form
              :model="edgeQueryParams"
              ref="queryForm"
              :inline="true"
              label-width="100px"
              style="margin-bottom: -20px"
            >
              <el-form-item label="边缘集群名称" prop="deviceName">
                <el-input
                  v-model="edgeQueryParams.deviceName"
                  placeholder="请输入边缘集群名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                >搜索
                </el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                >重置
                </el-button
                >
              </el-form-item>
              <el-form-item style="float: right">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="createEdge()"
                  v-hasPermi="['iot:edge:add']"
                >创建边缘集群
                </el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
          <el-row>
            <el-row>
              <el-table
                v-loading="listLoading"
                v-if="edgeListRefresh"
                :data="edgeList"
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
                <el-table-column label="集群名称" prop="name">
                </el-table-column>
                <el-table-column label="集群描述" prop="desc">
                </el-table-column>
                <el-table-column label="集群服务器数量" prop="nodeCount">
                </el-table-column>
                <el-table-column label="集群设备数量" prop="deviceCount">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="createTime"
                  label="创建时间"
                  width="200"
                >
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="节点管理" name="second">
        <el-row>
          <el-row>
            <el-card style="margin-bottom: 5px">
              <el-form
                :model="nodeQueryParams"
                ref="nodeQueryForm"
                :inline="true"
                label-width="68px"
                style="margin-bottom: -20px"
              >
                <el-form-item label="设备名称" prop="nodeName">
                  <el-input
                    v-model="nodeQueryParams.nodeName"
                    placeholder="请输入设备名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="分类名称" prop="mac">
                  <el-input
                    v-model="nodeQueryParams.mac"
                    placeholder="请输入设备分类名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                  >搜索
                  </el-button
                  >
                  <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                  >重置
                  </el-button
                  >
                </el-form-item>
                <el-form-item style="float: right">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="createNode()"
                    v-hasPermi="['iot:node:add']"
                  >新增节点
                  </el-button
                  >
                </el-form-item>
              </el-form>
            </el-card>
            <el-card style="padding-bottom: 100px">
              <el-row :gutter="30" v-loading="loading">
                <el-col
                  v-for="item in nodeList"
                  :xs="24"
                  :sm="12"
                  :md="12"
                  :lg="8"
                  :xl="6"
                  style="margin-bottom: 30px; text-align: center"
                >
                  <el-card
                    :body-style="{ padding: '20px' }"
                    shadow="always"
                    class="card-item"
                  >
                    <el-row type="flex" :gutter="10" justify="space-between">
                      <el-col :span="20" style="text-align: left">
                        <el-link
                          type=""
                          :underline="false"
                          @click="handleEditDevice(item)"
                          style="
                            font-weight: bold;
                            font-size: 16px;
                            line-height: 32px;
                            white-space: nowrap;
                          "
                        >
                          <svg-icon icon-class="device"/>
                          {{ item.nodeName }}
                          <el-tag
                            type="info"
                            size="mini"
                            style="margin-left: 5px; font-weight: 200"
                            v-if="item.isSys == 1"
                          >系统
                          </el-tag
                          >
                        </el-link>
                      </el-col>
                      <el-col :span="4">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="取消发布"
                          placement="top-start"
                          v-if="item.status == 2"
                        >
                          <el-button
                            type="success"
                            size="mini"
                            style="padding: 5px"
                            @click="changeDeviceStatus(item.deviceId, 1)"
                          >已发布
                          </el-button
                          >
                        </el-tooltip>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="现在发布"
                          placement="top-start"
                          v-if="item.status == 1"
                        >
                          <el-button
                            type="info"
                            size="mini"
                            style="padding: 5px"
                            @click="changeDeviceStatus(item.deviceId, 2)"
                          >未发布
                          </el-button
                          >
                        </el-tooltip>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="14">
                        <el-descriptions
                          :column="1"
                          size="small"
                          style="margin-top: 10px; white-space: nowrap"
                        >
                          <el-descriptions-item label="MAC地址">
                            {{ item.mac }}
                          </el-descriptions-item>
                          <el-descriptions-item label="节点所在集群">
                            <el-tag>
                              {{ item.edgeName }}
                            </el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item label="联网方式">
                            <el-tag>
                              {{ nodeNetworkMethedList[item.networkMethod] }}
                            </el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item label="节点资源">
                            <el-descriptions :column="3">
                              <el-descriptions-item label="CPU">
                                {{ item.cpu }}
                              </el-descriptions-item>
                              <el-descriptions-item label="GPU">
                                {{ item.gpu }}
                              </el-descriptions-item>
                              <el-descriptions-item label="内存">
                                {{ item.memory }}Gi
                              </el-descriptions-item>
                            </el-descriptions>
                          </el-descriptions-item>

                          <el-descriptions-item label="设备授权">
                            <el-tag
                              type="success"
                              size="mini"
                              v-if="item.isAuthorize == 1"
                            >已启用
                            </el-tag
                            >
                            <el-tag type="info" size="mini" v-else
                            >未启用
                            </el-tag
                            >
                          </el-descriptions-item>
                        </el-descriptions>
                      </el-col>
                      <el-col :span="10">
                        <div style="margin-top: 10px">
                          <el-image
                            style="
                              width: 100%;
                              height: 100px;
                              border-radius: 10px;
                            "
                            lazy
                            :preview-src-list="[baseUrl + item.imgUrl]"
                            :src="baseUrl + item.imgUrl"
                            fit="cover"
                            v-if="item.imgUrl != null && item.imgUrl != ''"
                          ></el-image>
                          <el-image
                            style="
                              width: 100%;
                              height: 100px;
                              border-radius: 10px;
                            "
                            :preview-src-list="[
                              require('@/assets/images/product.jpg'),
                            ]"
                            :src="require('@/assets/images/product.jpg')"
                            fit="cover"
                            v-else
                          ></el-image>
                        </div>
                      </el-col>
                    </el-row>
                    <el-button-group style="margin-top: 15px; height: 28px">
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        @click="handleEditDevice(item)"
                        v-hasPermi="['iot:device:edit']"
                      >详情
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="handleDelete(item)"
                        v-hasPermi="['iot:device:remove']"
                        v-if="item.status == 1"
                      >删除
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="success"
                        icon="el-icon-s-check"
                        @click="handleDeviceAuthorize(item)"
                        v-hasPermi="['iot:device:edit']"
                        v-if="item.status == 2"
                        :disabled="item.isAuthorize != 1"
                      >设备授权
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="warning"
                        icon="el-icon-search"
                        @click="handleViewDevice(item.id)"
                        v-hasPermi="['iot:device:query']"
                      >查看设备
                      </el-button
                      >
                    </el-button-group>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="设备管理" name="third">
        <el-row>
          <el-row>
            <el-card style="margin-bottom: 5px">
              <el-form
                :model="deviceQueryParams"
                ref="deviceQueryForm"
                :inline="true"
                label-width="68px"
                style="margin-bottom: -20px"
              >
                <el-form-item label="设备名称" prop="deviceName">
                  <el-input
                    v-model="deviceQueryParams.deviceName"
                    placeholder="请输入设备名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="分类名称" prop="categoryName">
                  <el-input
                    v-model="deviceQueryParams.categoryName"
                    placeholder="请输入设备分类名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                  >搜索
                  </el-button
                  >
                  <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                  >重置
                  </el-button
                  >
                </el-form-item>
                <el-form-item style="float: right">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="createDevice()"
                    v-hasPermi="['iot:device:add']"
                  >新增设备
                  </el-button
                  >
                </el-form-item>
              </el-form>
            </el-card>
            <el-card style="padding-bottom: 100px">
              <el-row :gutter="30" v-loading="loading">
                <el-col
                  v-for="item in deviceList"
                  :xs="24"
                  :sm="12"
                  :md="12"
                  :lg="8"
                  :xl="6"
                  style="margin-bottom: 30px; text-align: center"
                >
                  <el-card
                    :body-style="{ padding: '20px' }"
                    shadow="always"
                    class="card-item"
                  >
                    <el-row type="flex" :gutter="10" justify="space-between">
                      <el-col :span="20" style="text-align: left">
                        <el-link
                          type=""
                          :underline="false"
                          @click="handleEditDevice(item)"
                          style="
                            font-weight: bold;
                            font-size: 16px;
                            line-height: 32px;
                            white-space: nowrap;
                          "
                        >
                          <svg-icon icon-class="device"/>
                          {{ item.deviceName }}
                          <el-tag
                            type="info"
                            size="mini"
                            style="margin-left: 5px; font-weight: 200"
                            v-if="item.isSys == 1"
                          >系统
                          </el-tag
                          >
                        </el-link>
                      </el-col>
                      <el-col :span="4">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="取消发布"
                          placement="top-start"
                          v-if="item.status == 2"
                        >
                          <el-button
                            type="success"
                            size="mini"
                            style="padding: 5px"
                            @click="changeDeviceStatus(item.deviceId, 1)"
                          >已发布
                          </el-button
                          >
                        </el-tooltip>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="现在发布"
                          placement="top-start"
                          v-if="item.status == 1"
                        >
                          <el-button
                            type="info"
                            size="mini"
                            style="padding: 5px"
                            @click="changeDeviceStatus(item.deviceId, 2)"
                          >未发布
                          </el-button
                          >
                        </el-tooltip>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="14">
                        <el-descriptions
                          :column="1"
                          size="small"
                          style="margin-top: 10px; white-space: nowrap"
                        >
                          <el-descriptions-item label="设备描述">
                            <el-tag>
                              {{ item.desc }}
                            </el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item label="联网方式">
                            <el-tag>
                              {{ deviceNetworkMethedList[item.networkMethod] }}
                            </el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item label="设备所属集群">
                            <el-tag> {{ item.edgeName }}</el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item label="设备授权">
                            <el-tag
                              type="success"
                              size="mini"
                              v-if="item.isAuthorize == 1"
                            >已启用
                            </el-tag
                            >
                            <el-tag type="info" size="mini" v-else
                            >未启用
                            </el-tag
                            >
                          </el-descriptions-item>
                        </el-descriptions>
                      </el-col>
                      <el-col :span="10">
                        <div style="margin-top: 10px">
                          <el-image
                            style="
                              width: 100%;
                              height: 100px;
                              border-radius: 10px;
                            "
                            lazy
                            :preview-src-list="[baseUrl + item.imgUrl]"
                            :src="baseUrl + item.imgUrl"
                            fit="cover"
                            v-if="item.imgUrl != null && item.imgUrl != ''"
                          ></el-image>
                          <el-image
                            style="
                              width: 100%;
                              height: 100px;
                              border-radius: 10px;
                            "
                            :preview-src-list="[
                              require('@/assets/images/product.jpg'),
                            ]"
                            :src="require('@/assets/images/product.jpg')"
                            fit="cover"
                            v-else
                          ></el-image>
                        </div>
                      </el-col>
                    </el-row>
                    <el-button-group style="margin-top: 15px; height: 28px">
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        @click="handleEditDevice(item)"
                        v-hasPermi="['iot:device:edit']"
                      >详情
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="handleDelete(item)"
                        v-hasPermi="['iot:device:remove']"
                        v-if="item.status == 1"
                      >删除
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="success"
                        icon="el-icon-s-check"
                        @click="handleDeviceAuthorize(item)"
                        v-hasPermi="['iot:device:edit']"
                        v-if="item.status == 2"
                        :disabled="item.isAuthorize != 1"
                      >设备授权
                      </el-button
                      >
                      <el-button
                        size="mini"
                        type="warning"
                        icon="el-icon-search"
                        @click="handleViewDevice(item.id)"
                        v-hasPermi="['iot:device:query']"
                      >查看设备
                      </el-button
                      >
                    </el-button-group>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      v-dialogdrag
      title="新增节点"
      :visible.sync="nodeCreate"
      class="avue-dialog"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="darwer-border">
        <el-form
          label-position="top"
          :rules="formRules"
          :model="nodeForm"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="节点名称" prop="nodeName">
                <el-input
                  v-model="nodeForm.nodeName"
                  placeholder="请输入节点名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="节点描述" prop="nodeDesc">
                <el-input
                  v-model="nodeForm.desc"
                  placeholder="请输入节点描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="权限选择" prop="edgeId">
              <el-select
                @change="NodeTypeVisible"
                v-model="nodeForm.edgeId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in nodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="NodeTokenVisible">
            <el-form-item label="联网方式" prop="networkMethod">
              <el-select
                @change="NodeTypeVisible"
                v-model="nodeForm.networkMethod"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in networkMedthodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="NodeTokenVisible">
            <el-form-item label="MAC地址" prop="mac">
              <el-input
                v-model="nodeForm.mac"
                placeholder="请输入服务器MAC地址"
              />
            </el-form-item>
          </el-row>
          <el-row v-if="NodeTokenVisible">
            <el-col>
              <el-form-item label="CPU数量" prop="cpu">
                <el-input
                  v-model="nodeForm.cpu"
                  placeholder="请输入服务器CPU数量"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="NodeTokenVisible">
            <el-col>
              <el-form-item label="GPU数量" prop="gpu">
                <el-input
                  v-model="nodeForm.gpu"
                  placeholder="请输入服务器GPU数量"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="NodeTokenVisible">
            <el-col>
              <el-form-item label="内存大小" prop="memory">
                <el-input
                  v-model="nodeForm.memory"
                  placeholder="请输入服务器内存大小"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clickAction()">新增节点</el-button>
        <el-button type="type">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-dialogdrag
      title="新增设备"
      :visible.sync="deviceCreate"
      class="avue-dialog"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="darwer-border">
        <el-form
          label-position="top"
          :rules="formRules"
          :model="deviceForm"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="边缘设备名称" prop="deviceName">
                <el-input
                  v-model="deviceForm.deviceName"
                  placeholder="请输入边缘设备名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="边缘设备描述" prop="deviceDesc">
                <el-input
                  v-model="deviceForm.desc"
                  placeholder="请输入边缘设备描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="权限选择" prop="edgeId">
              <el-select
                @change="DeviceTypeVisible"
                v-model="deviceForm.edgeId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in deviceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="DeviceTokenVisible">
            <el-form-item label="联网方式" prop="networkMethod">
              <el-select
                @change="DeviceTypeVisible"
                v-model="deviceForm.networkMethod"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in networkMedthodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clickAction()">新增设备</el-button>
        <el-button type="type">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-dialogdrag
      title="创建边缘集群"
      :visible.sync="edgeCreate"
      class="avue-dialog"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="darwer-border">
        <el-form
          label-position="top"
          :rules="formRules"
          :model="edgeForm"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="边缘集群模型名称" prop="edgeName">
                <el-input
                  v-model="edgeForm.edgeName"
                  placeholder="请输入边缘集群名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="边缘集群模型描述" prop="edgeDesc">
                <el-input
                  v-model="edgeForm.edgeDesc"
                  placeholder="请输入边缘集群描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createEdgeAction()"
        >创建边缘集群</el-button
        >
        <el-button type="type">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { listProduct, listDevice } from '@/api/product'
import { getClusterList } from '@/api/table'
import { tsImportEqualsDeclaration } from '@babel/types'

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
      deviceNetworkMethedList: ['', 'Wi-Fi', '蜂窝(2G/3G/4G/5G)', '以太网', '其他'],
      nodeNetworkMethedList: ['', 'Wi-Fi', '蜂窝(2G/3G/4G/5G)', '以太网', '其他'],
      deviceTypeList: ['直连设备', '网关子设备', '网关设备'],
      activeName: 'first',
      dicts: [
        'iot_yes_no',
        'iot_device_status',
        'iot_device_type',
        'iot_network_method',
        'iot_vertificate_method',
        'iot_device_chip'
      ],
      loading: false,
      total: 0,
      deviceList: [],
      nodeList: [],
      edgeList: [],
      title: '',
      open: false,
      edgeQueryParams: {
        pageNum: 1,
        pageSize: 12,
        nodeName: null,
        categoryId: null,
        categoryName: null,
        tenantId: null,
        tenantName: null,
        isSys: null,
        status: null,
        nodeType: null,
        networkMethod: null
      },
      nodeQueryParams: {
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
      deviceQueryParams: {
        pageNum: 1,
        pageSize: 12,
        deviceName: null,
        categoryId: null,
        categoryName: null,
        tenantId: null,
        tenantName: null,
        isSys: null,
        status: null,
        deviceType: null,
        networkMethod: null
      },
      // 表单参数
      form: {},
      baseUrl: process.env.VUE_APP_BASE_API,
      nodeCreate: false,
      deviceCreate: false,
      edgeCreate: false,
      list: null,
      edgeForm: {
        edgeName: '',
        edgeDesc: ''
      },
      DeviceTokenVisible: false,
      deviceForm: {
        deviceName: '',
        desc: '',
        networkMethod: '',
        edgeId: ''
      },
      NodeTokenVisible: false,
      nodeForm: {
        nodeName: '',
        desc: '',
        mac: '',
        networkMethod: '',
        cpu: '',
        gpu: '',
        memory: '',
        edgeId: ''
      },
      nodeOptions: [
        {
          value: '0',
          label: '云端安全权限'
        }
      ],
      networkMedthodOptions: [
        {
          value: '1',
          label: 'Wi-Fi'
        },
        {
          value: '2',
          label: '蜂窝(2G/3G/4G/5G)'
        },
        {
          value: '3',
          label: '以太网'
        },
        {
          value: '4',
          label: '其他'
        }
      ],
      deviceOptions: [],
      listLoading: false,
      edgeListRefresh: true
    }
  },
  created() {
    this.fetchData()
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true
      axios.get('http://localhost:8100/cluster/listDevice').then((res) => {
        this.deviceList = res.data.data
        this.loading = false
      })
      axios.get('http://localhost:8100/cluster/listNode').then((res) => {
        this.nodeList = res.data.data
        this.loading = false
      })
      axios.get('http://localhost:8100/cluster/listEdge').then((res) => {
        this.edgeList = res.data.data
        this.loading = false
        console.log(this.nodeOptions)
        for (let item of res.data.data) {
          this.nodeOptions.push({
            value: item.id,
            label: item.name + '-' + item.desc
          })
          this.deviceOptions.push({
            value: item.id,
            label: item.name + '-' + item.desc
          })
        }
        console.log(this.nodeOptions)
      })
    },
    createNode() {
      this.nodeCreate = true
      console.log(this.nodeCreate)
    },
    NodeTypeVisible(value) {
      this.NodeTokenVisible = true
    },
    createDevice() {
      this.deviceCreate = true
    },
    DeviceTypeVisible(value) {
      this.DeviceTokenVisible = true
    },
    createEdge() {
      this.edgeCreate = true
    },
    fetchData() {
      this.listLoading = true
      getClusterList().then((response) => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    clickAction() {
      console.log('click')
    },
    createEdgeAction() {
      console.log(this.edgeForm)
      var object = {
        name: this.edgeForm.edgeName,
        desc: this.edgeForm.edgeDesc
      }
      this.edgeListRefresh = false
      axios
        .post('http://localhost:8100/cluster/createEdge', object)
        .then((res) => {
          this.getList()
          this.edgeCreate = false
          this.edgeListRefresh = true
        })
    }
  }
}
</script>

<style scoped>
.card-item {
  border-radius: 15px;
}
</style>
