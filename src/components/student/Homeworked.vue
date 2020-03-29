<template>
  <div>
    <el-card body-style="min-height:500px">
      <el-tabs
        v-model="info.currentCourse"
        @tab-click="getHomework"
        v-loading.fullscreen.lock="loading"
      >
        <el-tab-pane
          v-for="item in courseInfo"
          :key="item.cid"
          :label="item.cname"
          :name="item.cid + ''"
        >
          <!-- 成绩查看 -->
          <el-table :data="homeworkList">
            <el-table-column type="index">
              <template slot-scope="scope">{{(info.pagenum-1)*info.pagesize+scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="name" label="作业名"></el-table-column>
            <el-table-column label="截止时间">
              <template slot-scope="scope">{{scope.row.finishtime | dateFormat}}</template>
            </el-table-column>
            <el-table-column label="成绩/满分">
              <template slot-scope="scope">{{scope.row.mark + '/' + scope.row.point}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  icon="el-icon-view"
                  :underline="false"
                  @click="detail(scope.row.tid,scope.row.name,scope.row.mark)"
                >查看</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="info.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="info.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
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
      info: {
        loading: true,
        sid: window.sessionStorage.getItem('token'),
        pagenum: 1,
        pagesize: 10,
        currentCourse: ''
      },
      courseInfo: '',
      homeworkList: [],
      total: 0,
      detailVisible: false,
      detailList: {}
    }
  },
  created() {
    this.getCourse()
    this.loading = false
  },
  methods: {
    async getCourse() {
      const { data: course } = await this.$http.get('/student/getcourse', {
        params: { sid: this.info.sid }
      })
      this.courseInfo = course
      this.info.currentCourse = course[0].cid + ''
      this.getHomework()
    },
    async getHomework() {
      const { data: res } = await this.$http.get('/student/homeworked', {
        params: this.info
      })
      this.homeworkList = res.info
      this.info.pagenum = res.pagenum
      this.total = res.total
    },
    async detail(tid, name, mark) {
      this.detailVisible = true
      const { data: res } = await this.$http.get('/student/detail', {
        params: { tid: tid, sid: this.info.sid }
      })
      this.detailList = res
      this.detailList['name'] = name
      this.detailList['mark'] = mark
    },
    sizeChange(newsize) {
      this.info.pagesize = newsize
      this.getHomework()
    },
    currentChange(newpage) {
      this.info.pagenum = newpage
      this.getHomework()
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
</style>
