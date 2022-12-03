<template>
  <div class="app-container" style="background-color: #f3f3f3;">
    <div style="background-color: #f3f3f3; height: 750px">
    <el-row>
      <el-col :span=3><h2>日志监控面板</h2></el-col>
    </el-row>
    <el-row>
      <el-col :span=6>
        日志级别筛选：
        <el-select v-model="level" placeholder="请选择" @change="levelFilter">
          <el-option
            v-for="item in levelOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span=6>
        <span class="demonstration">日志日期筛选：</span>
        <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      </el-col>

      <el-col :span=12 style="text-align: right">
        <el-button :span=3 type="primary">日志下载</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div style="height: 600px; margin-top: 20px; margin-right: 20px; margin-left: 20px; overflow-y: auto; position: absolute; width: 1480px; background-color: white; border-width: 2px; border-color: black">
        <div v-for="log in logItem" style="margin-left: 10px">
          <div style="display: flex; text-align: left; height: 25px">
            <p>{{log.date}}</p>
            <p v-show="log.level==='info'" style="color: green; margin-left: 10px">{{log.level}}</p>
            <p v-show="log.level==='warning'" style="color: red; margin-left: 10px">{{log.level}}</p>
            <p style="margin-left: 10px">{{log.content}}</p>
          </div>
        </div>
      </div>
    </el-row>
  </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
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
      logItem: []
    }
  },
  mounted() {
    setInterval(() => {
      this.getLog()
    }, 1000 * 5)
  },
  methods: {
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

<style scoped>
</style>

