<template>
  <div>
    <el-card body-style="min-height:500px" v-loading.fullscreen.lock="loading">
      <el-tabs v-model="currentCourse" @tab-click="getClasses" type="card">
        <el-tab-pane
          v-for="item in courseInfo"
          :key="item.cid"
          :label="item.cname"
          :name="item.cid + ''"
        ></el-tab-pane>
      </el-tabs>
      <el-tabs v-model="currentClass" tab-position="left" @tab-click="getPublished">
        <el-tab-pane v-for="item in classes" :key="item" :label="item" :name="item">
          <el-alert v-if="alertVisible" title="未发布作业" :closable="false" show-icon></el-alert>
          <el-table v-else :data="publishedList">
            <el-table-column label="作业名" prop="name"></el-table-column>
            <el-table-column label="模板名" prop="tname"></el-table-column>
            <el-table-column label="截止时间">
              <template slot-scope="scope">{{scope.row.finishtime | dateFormat}}</template>
            </el-table-column>
          </el-table>
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
      aid: window.sessionStorage.getItem('token'),
      alertVisible: false,
      currentCourse: '',
      currentClass: '',
      courseInfo: [],
      classes: [],
      publishedList: []
    }
  },
  created() {
    this.getCourse()
    this.loading = false
  },
  methods: {
    async getCourse() {
      const { data: course } = await this.$http.get('/assis/getcourse', {
        params: { aid: this.aid }
      })
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
      this.getPublished()
    },
    async getPublished() {
      const { data: res } = await this.$http.get('/assis/published', {
        params: { classes: this.currentClass, cid: this.currentCourse }
      })
      this.alertVisible = false
      if (typeof res === 'string') this.alertVisible = true
      else this.publishedList = res
    }
  }
}
</script>

<style lang="less" scoped>
</style>
