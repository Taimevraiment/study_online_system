<template>
  <div>
    <el-card body-style="min-height:500px">
      <el-tabs v-model="currentCourse" @tab-click="getClasses" type="card">
        <el-tab-pane
          v-for="item in courseInfo"
          :key="item.cid"
          :label="item.cname"
          :name="item.cid + ''"
        ></el-tab-pane>
      </el-tabs>
      <el-tabs v-model="currentClass" tab-position="left" @tab-click="getStu">
        <el-tab-pane v-for="item in classes" :key="item" :label="item" :name="item">
          <span>学号</span>
          <span style="position:absolute;left:120px">姓名</span>
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in stuList" :key="index">
              <template slot="title">
                <span>{{item.sid}}</span>
                <span style="position:absolute;left:120px">{{item.name}}</span>
              </template>
              <el-table :data="item.info" show-summary v-loading.fullscreen.lock="loading">
                <el-table-column label="作业" prop="name"></el-table-column>
                <el-table-column label="截止时间">
                  <template slot-scope="scope">{{scope.row.finishtime | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="成绩" prop="mark"></el-table-column>
                <el-table-column label="满分" prop="point"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
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
      teid: window.sessionStorage.getItem('token'),
      currentCourse: '',
      currentClass: '',
      currentStu: '',
      homeworkname: '',
      courseInfo: [],
      classes: [],
      stuList: []
    }
  },
  created() {
    this.getCourse()
    this.loading = false
  },
  methods: {
    async getCourse() {
      const { data: course } = await this.$http.get(
        '/teacher/getmarkingcourse',
        {
          params: { teid: this.teid }
        }
      )
      this.courseInfo = course
      this.currentCourse = course[0].cid + ''
      this.getClasses()
    },
    getClasses() {
      this.courseInfo.some(item => {
        if (parseInt(this.currentCourse) === item.cid) {
          return (this.classes = item.classes)
        }
      })
      this.currentClass = this.classes[0]
      this.getStu()
    },
    async getStu() {
      const { data: res } = await this.$http.get('/student/score', {
        params: { classes: this.currentClass, cid: this.currentCourse }
      })
      this.stuList = res
    }
  }
}
</script>

<style lang="less" scoped>
</style>
