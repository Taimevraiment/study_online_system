<template>
  <div>
    <el-card body-style="min-height: 500px" v-loading.fullscreen.lock="loading">
      <!-- 不同课程的tabs -->
      <el-tabs v-model="currentCourse" @tab-click="getHomework">
        <el-tab-pane
          v-for="item in courseInfo"
          :key="item.cid"
          :label="item.cname"
          :name="item.cid + ''"
        >
          <el-alert v-if="alertVisible||timelimit" title="教师未发布作业" :closable="false" show-icon></el-alert>
          <!-- 显示作业区域 -->
          <div v-else>
            <el-row>
              <el-col :span="2">
                <el-button type="primary" round @click="save">保存</el-button>
              </el-col>
              <el-col :span="16">
                <center>
                  <h3 v-if="homeworkData.name!==null">{{homeworkData.name}}</h3>
                </center>
              </el-col>
              <el-col :span="6" :offset="homeworkData.name!==null?0:16">
                <div>截止时间：{{homeworkData.finishtime | dateFormat}}</div>
              </el-col>
            </el-row>
            <div v-if="homeworkData.schoose!==undefined&&homeworkData.schoose.length>0">
              <b>单项选择题</b>
              <div v-for="(item,index) in homeworkData.schoose" :key="index+1111">
                <el-row>
                  <el-col :span="1">{{index + 1}} .</el-col>
                  <el-col :span="23">{{item.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1">
                    <el-radio-group v-model="ansData.schoose[index].answer">
                      <el-radio label="A">A.{{item.choosea}}</el-radio>
                      <br />
                      <el-radio label="B">B.{{item.chooseb}}</el-radio>
                      <br />
                      <el-radio label="C">C.{{item.choosec}}</el-radio>
                      <br />
                      <el-radio label="D">D.{{item.choosed}}</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="homeworkData.schoose!==undefined&&homeworkData.mchoose.length>0">
              <b>多项选择题</b>
              <div v-for="(item,index) in homeworkData.mchoose" :key="index+2222">
                <el-row>
                  <el-col :span="1">{{index + 1}} .</el-col>
                  <el-col :span="23">{{item.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1">
                    <el-checkbox-group v-model="ansData.mchoose[index].answer">
                      <el-checkbox label="A">A.{{item.choosea}}</el-checkbox>
                      <br />
                      <el-checkbox label="B">B.{{item.chooseb}}</el-checkbox>
                      <br />
                      <el-checkbox label="C">C.{{item.choosec}}</el-checkbox>
                      <br />
                      <el-checkbox label="D">D.{{item.choosed}}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="homeworkData.schoose!==undefined&&homeworkData.judge.length>0">
              <b>判断题</b>
              <div v-for="(item,index) in homeworkData.judge" :key="index+3333">
                <el-row>
                  <el-col :span="1">{{index + 1}} .</el-col>
                  <el-col :span="23">{{item.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1">
                    <el-radio-group v-model="ansData.judge[index].answer">
                      <el-radio label="0">错误</el-radio>
                      <el-radio label="1">正确</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="homeworkData.schoose!==undefined&&homeworkData.passage.length>0">
              <b>简答题</b>
              <div v-for="(item,index) in homeworkData.passage" :key="index+3333">
                <el-row>
                  <el-col :span="1">{{index + 1}} .</el-col>
                  <el-col :span="23">{{item.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1" :span="20">
                    <el-input
                      type="textarea"
                      v-model="ansData.passage[index].answer"
                      :autosize="{minRows:5}"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="homeworkData.schoose!==undefined&&homeworkData.program.length>0">
              <b>程序题</b>
              <div v-for="(item,index) in homeworkData.program" :key="index+3333">
                <el-row>
                  <el-col :span="1">{{index + 1}} .</el-col>
                  <el-col :span="23">{{item.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1" :span="20">
                    <el-input
                      type="textarea"
                      v-model="ansData.program[index].answer"
                      :autosize="{minRows:5}"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      time: '',
      timelimit: true,
      sid: window.sessionStorage.getItem('token'),
      currentCourse: '',
      courseInfo: [],
      alertVisible: false,
      homeworkData: {},
      ansData: {}
    }
  },
  created() {
    this.getCourse()
    this.loading = false
  },
  methods: {
    async getCourse() {
      const { data: course } = await this.$http.get('/student/getcourse', {
        params: { sid: this.sid }
      })
      this.courseInfo = course
      this.currentCourse = course[0].cid + ''
      this.getHomework()
    },
    async getHomework() {
      this.timelimit = true
      const { data: res } = await this.$http.get('/student/gethomework', {
        params: { cid: this.currentCourse }
      })
      const { data: ans } = await this.$http.get('/student/getans', {
        params: { cid: this.currentCourse, sid: this.sid }
      })
      this.ansData = ans
      if (typeof res === 'string') this.alertVisible = true
      else {
        this.alertVisible = false
        this.homeworkData = res
        this.time = new Date()
        if (this.time < new Date(this.homeworkData.finishtime)) {
          this.timelimit = false
        }
      }
    },
    async save() {
      this.ansData['sid'] = this.sid
      this.loading = true
      const { data: res } = await this.$http.post('/homework', this.ansData)
      if (res !== '保存成功') this.$message.error('保存失败')
      else this.$message.success('保存成功')
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
