<template>
  <div class="app-container" style="background-color: #efefef; height: 100%">
    <el-row>
      <el-col span="3"><h2>日志监控面板</h2></el-col>
    </el-row>
    <el-row style="text-align: right">
      <el-button span="3" type="primary">日志下载</el-button>
    </el-row>
    <el-row style="height: 780px">
      <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto; height: 100%; background-color: white">
        {{logText}}
        .   ____          _            __ _ _<br />
        /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \<br />
        ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \<br />
        \\/  ___)| |_)| | | | | || (_| |  ) ) ) )<br />
        '  |____| .__|_| |_|_| |_\__, | / / / /<br />
        =========|_|==============|___/=/_/_/_/<br />
        :: Spring Boot ::                (v2.7.5)<br />
        <br />
        2022-11-25 09:34:47.939  INFO 10840 --- [           main] com.cad.datalabel.DatalabelApplication   : Starting DatalabelApplication using Java 1.8.0_292 on Zheng-Y9000K with PID 10840 (D:\datalabel\target\classes started by 46160 in D:\datalabel)<br />
        2022-11-25 09:34:47.941  INFO 10840 --- [           main] com.cad.datalabel.DatalabelApplication   : No active profile set, falling back to 1 default profile: "default"<br />
        2022-11-25 09:34:48.899  INFO 10840 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8100 (http)<br />
        2022-11-25 09:34:48.905  INFO 10840 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]<br />
        2022-11-25 09:34:48.905  INFO 10840 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.68]<br />
        2022-11-25 09:34:48.974  INFO 10840 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext<br />
        2022-11-25 09:34:48.975  INFO 10840 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 997 ms<br />
        Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.<br />
        Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\DatasetMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\DatasourceMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\LabelGroupMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\LabelMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\RowMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\TableCreateMapper.xml]'<br />
        Parsed mapper file: 'file [D:\研究生\毕设\datalabel\target\classes\mapper\TextClassifiedRowMapper.xml]'<br />
        <br />
        <br />
        ,------.                           ,--.  ,--.         ,--.<br />
        |  .--. '  ,--,--.  ,---.   ,---.  |  '--'  |  ,---.  |  |  ,---   ,---.  ,--.--.<br />
        |  '--' | ' ,-.  | | .-. | | .-. : |  .--.  | | .-. : |  | | .-. | | .-. : |  .--'<br />
        |  | --'  \ '-'  | ' '-' ' \   --. |  |  |  | \   --. |  | | '-' ' \   --. |  |<br />
        `--'       `--`--' .`-  /   `----' `--'  `--'  `----' `--' |  |-'   `----' `--'<br />
        `---'                                   `--'                        is intercepting.<br />
        <br />
        2022-11-25 09:34:49.703  INFO 10840 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8100 (http) with context path ''<br />
        2022-11-25 09:34:49.710  INFO 10840 --- [           main] com.cad.datalabel.DatalabelApplication   : Started DatalabelApplication in 2.061 seconds (JVM running for 2.78)<br />
      </ul>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        logText: '   7:7   warning  Require self-closing on Vue.js custom components (<el-input>)           vue/html-self-closing\n'
      }
    }
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

