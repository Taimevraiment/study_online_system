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
      <el-tabs v-model="currentClass" tab-position="left" @tab-click="getMarked">
        <el-tab-pane v-for="item in classes" :key="item" :label="item" :name="item">
          <el-alert v-if="alertVisible" title="无已批阅作业" :closable="false" show-icon></el-alert>
          <el-collapse v-else accordion>
            <el-collapse-item v-for="(item,index) in markedList" :key="index">
              <template slot="title">{{item.homeworkname}}</template>
              <el-table :data="item.scoreInfo">
                <el-table-column label="学号" prop="id"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="批阅时间">
                  <template slot-scope="scope">{{scope.row.createtime | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="成绩" prop="mark" sortable></el-table-column>
                <el-table-column label="满分" prop="point"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-link
                      type="primary"
                      icon="el-icon-view"
                      :underline="false"
                      @click="detail(scope.row.tid,item.homeworkname,scope.row.mark,scope.row.id)"
                    >查看</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
      <!-- 查看详情 -->
      <el-dialog :title="detailList.name" :visible.sync="detailVisible" width="50%" center>
        <center>成绩：{{detailList.mark}}</center>
        <div v-if="detailList.schoose!==undefined&&detailList.schoose.length>0">
          <b>单项选择题</b>
          <div v-for="(item,index) in detailList.schoose" :key="index+1111">
            <el-row>
              <el-col :span="1">{{index + 1}} .</el-col>
              <el-col :span="23">{{item.title}}({{item.point}}分)答案：{{item.ckey}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer==='A'?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">A.</el-col>
              <el-col :span="23">{{item.choosea}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer==='B'?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">B.</el-col>
              <el-col :span="23">{{item.chooseb}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer==='C'?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">C.</el-col>
              <el-col :span="23">{{item.choosec}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer==='D'?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">D.</el-col>
              <el-col :span="23">{{item.choosed}}</el-col>
            </el-row>
          </div>
        </div>
        <div v-if="detailList.mchoose!==undefined&&detailList.mchoose.length>0">
          <b>多项选择题</b>
          <div v-for="(item,index) in detailList.mchoose" :key="index+2222">
            <el-row>
              <el-col :span="1">{{index + 1}} .</el-col>
              <el-col :span="23">{{item.title}}({{item.point}}分)答案：{{item.ckey}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer.includes('A')?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">A.</el-col>
              <el-col :span="23">{{item.choosea}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer.includes('B')?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">B.</el-col>
              <el-col :span="23">{{item.chooseb}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer.includes('C')?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">C.</el-col>
              <el-col :span="23">{{item.choosec}}</el-col>
            </el-row>
            <el-row :style="{'color':item.answer.includes('D')?item.isTrue===1?'#2EDC1E':'red':''}">
              <el-col :span="1">D.</el-col>
              <el-col :span="23">{{item.choosed}}</el-col>
            </el-row>
          </div>
        </div>
        <div v-if="detailList.judge!==undefined&&detailList.judge.length>0">
          <b>判断题</b>
          <div v-for="(item,index) in detailList.judge" :key="index+3333">
            <el-row :style="{'color':item.isTrue===1?'#2EDC1E':'red'}">
              <el-col :span="1">{{index + 1}} .</el-col>
              <el-col :span="23">{{item.title}}({{item.point}}分)答案：{{item.ckey===0?'错误':'正确'}}</el-col>
            </el-row>
          </div>
        </div>
        <div v-if="detailList.passage!==undefined&&detailList.passage.length>0">
          <b>简答题</b>
          <div v-for="(item,index) in detailList.passage" :key="index+4444">
            <el-row>
              <el-col :span="1">{{index + 1}} .</el-col>
              <el-col :span="23">{{item.title}}({{item.point}}分)</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">回答：</el-col>
              <el-col :span="22">{{item.answer}}(得分：{{item.isTrue}}分)</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">答案：</el-col>
              <el-col :span="22">{{item.ckey}}</el-col>
            </el-row>
          </div>
        </div>
        <!-- 程序题部分暂未做 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailVisible = false">确 定</el-button>
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
      teid: window.sessionStorage.getItem('token'),
      alertVisible: false,
      detailVisible: false,
      currentCourse: '',
      currentClass: '',
      courseInfo: [],
      classes: [],
      markedList: [],
      detailList: []
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
      this.getMarked()
    },
    async getMarked() {
      const { data: res } = await this.$http.get('/assis/marked', {
        params: { classes: this.currentClass, cid: this.currentCourse }
      })
      if (res === '') this.alertVisible = true
      else this.alertVisible = false
      this.markedList = res
    },
    async detail(tid, name, mark, sid) {
      this.detailVisible = true
      const { data: res } = await this.$http.get('/student/detail', {
        params: { tid: tid, sid: sid }
      })
      this.detailList = res
      this.detailList['name'] = name
      this.detailList['mark'] = mark
    }
  }
}
</script>

<style lang="less" scoped>
</style>
