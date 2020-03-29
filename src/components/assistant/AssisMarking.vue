<template>
  <div>
    <el-card body-style="min-height: 500px" v-loading.fullscreen.lock="loading">
      <el-tabs v-model="currentCourse" @tab-click="getMarking">
        <el-tab-pane
          v-for="item in courseInfo"
          :key="item.cid"
          :label="item.cname"
          :name="item.cid + ''"
        >
          <el-alert v-if="alertVisible" title="无未批阅作业" :closable="false" show-icon></el-alert>
          <!-- 未批阅作业列表 -->
          <el-table v-else :data="markingList">
            <el-table-column prop="sid" label="学号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="classes" label="班级"></el-table-column>
            <el-table-column prop="homeworkname" label="作业"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  icon="el-icon-edit"
                  :underline="false"
                  @click="detail(scope.row.tid,scope.row.sid,scope.row.homeworkname,scope.row.name,scope.row.ansid)"
                >批阅</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 批阅界面 -->
      <el-dialog
        :title="detailInfo.homeworkname+' | '+detailInfo.name"
        :visible.sync="markingVisible"
        width="50%"
      >
        <div v-if="detailInfo.schoose!==undefined&&detailInfo.schoose.length>0">
          <b>单项选择题（得分：{{detailInfo.score.schoose}}分）</b>
          <div v-for="(item,index) in detailInfo.schoose" :key="index+1111">
            <el-col
              :span="4"
              :style="{'color':item.isTrue===0?'red':'green'}"
            >{{index+1}}.{{item.answer}}</el-col>
          </div>
        </div>
        <br />
        <div v-if="detailInfo.mchoose!==undefined&&detailInfo.mchoose.length>0">
          <b>多项选择题（得分：{{detailInfo.score.mchoose}}分）</b>
          <div v-for="(item,index) in detailInfo.mchoose" :key="index+2222">
            <el-col
              :span="4"
              :style="{'color':item.isTrue===0?'red':'green'}"
            >{{index+1}}.{{item.answer}}</el-col>
          </div>
        </div>
        <br />
        <div v-if="detailInfo.judge!==undefined&&detailInfo.judge.length>0">
          <b>判断题（得分：{{detailInfo.score.judge}}分）</b>
          <div v-for="(item,index) in detailInfo.judge" :key="index+3333">
            <el-col
              :span="4"
              :style="{'color':item.isTrue===0?'red':'green'}"
            >{{index+1}}.{{item.answer===0?'×':''}}{{item.answer===1?'√':''}}</el-col>
          </div>
          <br />
        </div>
        <div v-if="detailInfo.passage!==undefined&&detailInfo.passage.length>0">
          <b>简答题</b>
          <div v-for="(item,index) in detailInfo.passage" :key="index+4444">
            <el-row>
              <el-col :span="1">{{index+1}}.</el-col>
              <el-col :span="18">{{item.answer}}</el-col>
              <el-col :span="5" :offset="item.answer===''?18:0">
                <el-input-number
                  size="mini"
                  v-model="item.isTrue"
                  placeholder="得分"
                  :min="0"
                  :max="item.point"
                ></el-input-number>
              </el-col>
            </el-row>
            <el-row>参考答案：{{item.ckey}}（分值：{{item.point}}分）</el-row>
          </div>
        </div>
        <br />
        <!-- 程序题暂时保留 -->
        <!-- <div v-if="detailInfo.program!==undefined&&detailInfo.program.length>0">
          <b>程序题</b>
          <div v-for="(item,index) in detailInfo.program" :key="index+5555">
            <el-row>
              <el-col :span="1">{{index+1}}.</el-col>
              <el-col :span="18">{{item.answer}}</el-col>
              <el-col :span="5" :offset="item.answer===''?18:0">
                <el-input-number
                  size="mini"
                  v-model="item.isTrue"
                  placeholder="得分"
                  :min="0"
                  :max="item.point"
                ></el-input-number>
              </el-col>
            </el-row>
            <el-row>参考答案：{{item.ckey}}（分值：{{item.point}}分）</el-row>
          </div>
        </div>-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="markingVisible = false">取 消</el-button>
          <el-button type="primary" @click="mark" :loading="markingLoading">完 成</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      currentCourse: '',
      aid: window.sessionStorage.getItem('token'),
      courseInfo: {},
      alertVisible: false,
      markingVisible: false,
      markingLoading: false,
      markingList: [],
      detailInfo: {}
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
      this.getMarking()
    },
    async getMarking() {
      const { data: marking } = await this.$http.get('/assis/marking', {
        params: { cid: this.currentCourse }
      })
      if (typeof marking === 'string') this.alertVisible = true
      else {
        this.markingList = marking
        this.alertVisible = false
      }
    },
    async detail(tid, sid, homeworkname, name, ansid) {
      const { data: res } = await this.$http.get('/assis/detail', {
        params: { tid: tid, sid: sid }
      })
      this.detailInfo = res
      this.detailInfo['homeworkname'] = homeworkname
      this.detailInfo['name'] = name
      this.detailInfo['ansid'] = ansid
      this.detailInfo['sid'] = sid
      this.detailInfo['cid'] = parseInt(this.currentCourse)
      this.markingVisible = true
    },
    async mark() {
      const confirmRes = await this.$confirm(
        '完成后将不能修改批阅结果，确定继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('已取消')
      this.markingLoading = true
      const { data: res } = await this.$http.post('/assis', this.detailInfo)
      if (res !== '批阅完成') this.$message.error('操作失败')
      else this.$message.success('批阅完成')
      this.markingLoading = false
      this.markingVisible = false
      this.getMarking()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
