<template>
  <div>
    <el-card body-style="min-height: 500px" v-loading.fullscreen.lock="loading">
      已存模板
      <el-button type="primary" size="medium" icon="el-icon-plus" circle @click="createTemOpen"></el-button>
      <el-input
        placeholder="查找模板"
        prefix-icon="el-icon-search"
        v-model="info.kword"
        @change="getTem"
        style="width: 300px;margin-left: 30px"
        clearable
      ></el-input>
      <!-- 模板列表区域 -->
      <el-table :data="temData" border>
        <el-table-column type="index" width="40">
          <template slot-scope="scope">{{(info.pagenum-1)*info.pagesize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="name" label="模板" width="180"></el-table-column>
        <el-table-column prop="cname" label="课程" width="180"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="200">
          <template slot-scope="scope">{{ scope.row.createtime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              icon="el-icon-view"
              :underline="false"
              @click="detail(scope.row.id)"
            >查看</el-link>
            <el-link
              type="warning"
              icon="el-icon-edit"
              :underline="false"
              @click="update(scope.row.id,scope.row.cname,scope.row.cid)"
            >修改</el-link>
            <el-link
              type="danger"
              icon="el-icon-delete"
              :underline="false"
              @click="del(scope.row.id)"
            >删除</el-link>
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
      <!-- 添加模板对话框 -->
      <el-dialog title="新建模板" :visible.sync="createVisible" width="50%" :before-close="createClose">
        <el-form :model="temForm" ref="temFormRef" label-width="70px" :rules="temFormRules">
          <el-form-item :label="'模板名'" :prop="'name'">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input v-model="temForm.name" ref="inputRef"></el-input>
              </el-col>
              <el-col :span="10">
                <el-form-item :prop="'cid'">
                  <el-select v-model="temForm.cid" clearable placeholder="课程名">
                    <el-option
                      v-for="item in courseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 新增单项选择题 -->
          <span>单项选择题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addschoose"></el-button>
          <el-form :model="temForm" ref="schooseRef" label-width="70px">
            <div v-for="(item, index) in temForm.schoose" :key="1111+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'schoose.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delschoose(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'schoose.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addschoose"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'A.'"
                :prop="'schoose.' + index + '.choosea'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosea" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'B.'"
                :prop="'schoose.' + index + '.chooseb'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.chooseb" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'C.'"
                :prop="'schoose.' + index + '.choosec'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosec" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'D.'"
                :prop="'schoose.' + index + '.choosed'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosed" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'答案'"
                :prop="'schoose.' + index + '.ckey'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change','focus']}"
                size="small"
              >
                <el-radio v-model="item.ckey" label="A">A</el-radio>
                <el-radio v-model="item.ckey" label="B">B</el-radio>
                <el-radio v-model="item.ckey" label="C">C</el-radio>
                <el-radio v-model="item.ckey" label="D">D</el-radio>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 新增多项选择题 -->
          <span>多项选择题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addmchoose"></el-button>
          <el-form :model="temForm" ref="mchooseRef" label-width="70px">
            <div v-for="(item, index) in temForm.mchoose" :key="2222+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'mchoose.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delmchoose(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'mchoose.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addmchoose"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'A.'"
                :prop="'mchoose.' + index + '.choosea'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosea" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'B.'"
                :prop="'mchoose.' + index + '.chooseb'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.chooseb" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'C.'"
                :prop="'mchoose.' + index + '.choosec'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosec" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'D.'"
                :prop="'mchoose.' + index + '.choosed'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosed" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'答案'"
                :prop="'mchoose.' + index + '.ckey'"
                :rules="{required: true, type: 'array', min: 2, message: '至少为2项', trigger: 'change'}"
                size="small"
              >
                <el-checkbox-group v-model="item.ckey">
                  <el-checkbox label="A"></el-checkbox>
                  <el-checkbox label="B"></el-checkbox>
                  <el-checkbox label="C"></el-checkbox>
                  <el-checkbox label="D"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 新增判断题 -->
          <span>判断题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addjudge"></el-button>
          <el-form :model="temForm" ref="judgeRef" label-width="70px">
            <div v-for="(item, index) in temForm.judge" :key="3333+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'judge.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="deljudge(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'judge.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addjudge"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item :label="'答案'" size="small">
                <el-radio v-model="item.ckey" :label="0">错误</el-radio>
                <el-radio v-model="item.ckey" :label="1">正确</el-radio>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 新增简答题 -->
          <span>简答题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addpassage"></el-button>
          <el-form :model="temForm" ref="passageRef" label-width="70px">
            <div v-for="(item, index) in temForm.passage" :key="4444+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'passage.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delpassage(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'passage.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
                {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addpassage"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item :label="'答案'">
                <el-input v-model="item.ckey" type="textarea" autosize></el-input>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 新增程序题 -->
          <span>程序题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addprogram"></el-button>
          <el-form :model="temForm" ref="programRef" label-width="70px">
            <div v-for="(item, index) in temForm.program" :key="5555+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'program.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delprogram(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'program.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addprogram"
                  ></el-button>
                </el-col>
              </el-form-item>
            </div>
          </el-form>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createClose">取 消</el-button>
          <el-button type="primary" @click="putTemForm" :loading="putTemLoading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 显示模板对话框 -->
      <el-dialog
        :title="temInfo.name"
        :visible.sync="detailVisible"
        width="50%"
        @close="detailClose"
      >
        <p v-if="temInfo.schoose!==undefined&&temInfo.schoose.length>0">单项选择题</p>
        <div v-for="(item,index) in temInfo.schoose" :key="index+1111" style="margin-top:10px">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="22">{{item.title}}({{item.point}}分)</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey==='A'?'red':''}"
            >{{'A.'+item.choosea}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey==='B'?'red':''}"
            >{{'B.'+item.chooseb}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey==='C'?'red':''}"
            >{{'C.'+item.choosec}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey==='D'?'red':''}"
            >{{'D.'+item.choosed}}</el-col>
          </el-row>
        </div>
        <p v-if="temInfo.mchoose!==undefined&&temInfo.mchoose.length>0">多项选择题</p>
        <div v-for="(item,index) in temInfo.mchoose" :key="index+2222" style="margin-top:10px">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="22">{{item.title}}({{item.point}}分)</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey.includes('A')?'red':''}"
            >{{'A.'+item.choosea}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey.includes('B')?'red':''}"
            >{{'B.'+item.chooseb}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey.includes('C')?'red':''}"
            >{{'C.'+item.choosec}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="22"
              :offset="1"
              :style="{'color':item.ckey.includes('D')?'red':''}"
            >{{'D.'+item.choosed}}</el-col>
          </el-row>
        </div>
        <p v-if="temInfo.judge!==undefined&&temInfo.judge.length>0">判断题</p>
        <div v-for="(item,index) in temInfo.judge" :key="index+3333">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="22">
              {{item.title}}({{item.point}}分)
              <span v-if="item.ckey===0">×</span>
              <span v-else-if="item.ckey===1">√</span>
            </el-col>
          </el-row>
        </div>
        <p v-if="temInfo.passage!==undefined&&temInfo.passage.length>0">简答题</p>
        <div v-for="(item,index) in temInfo.passage" :key="index+4444">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="22">{{item.title}}({{item.point}}分)</el-col>
          </el-row>
          <el-row v-if="item.ckey!==''">
            <el-col :span="2">答案：</el-col>
            <el-col :span="21">{{item.ckey}}</el-col>
          </el-row>
        </div>
        <p v-if="temInfo.program!==undefined&&temInfo.program.length>0">程序题</p>
        <div v-for="(item,index) in temInfo.program" :key="index+5555">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="22">{{item.title}}({{item.point}}分)</el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-row :gutter="15" style="margin-bottom:15px;padding-left:10px">
            <el-col :span="7">
              <el-input v-model="publishData.name" placeholder="作业名"></el-input>
            </el-col>
            <el-col :span="8">
              <el-select v-model="publishData.class" placeholder="发布到的班级" clearable>
                <el-option v-for="item in classes" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="publishData.finishtime" type="datetime" placeholder="截止日期"></el-date-picker>
            </el-col>
          </el-row>
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="addHomework" :loading="publishHomeworkLoading">发布作业</el-button>
        </span>
      </el-dialog>
      <!-- 修改模板对话框 -->
      <el-dialog title="修改模板" :visible.sync="updateVisible" width="50%" :before-close="updateClose">
        <el-form :model="updateInfo" ref="updateInfoRef" label-width="70px" :rules="temFormRules">
          <el-form-item :label="'模板名'" :prop="'name'">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input v-model="updateInfo.name" ref="inputRef"></el-input>
              </el-col>
              <el-col :span="10">
                <el-form-item :prop="'cid'">
                  <el-select v-model="updateInfo.cid" clearable placeholder="课程名">
                    <el-option
                      v-for="item in courseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 修改单项选择题 -->
          <span>单项选择题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addschoose"></el-button>
          <el-form :model="updateInfo" ref="schooseRef" label-width="70px">
            <div v-for="(item, index) in updateInfo.schoose" :key="1111+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'schoose.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delschoose(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'schoose.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addschoose"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'A.'"
                :prop="'schoose.' + index + '.choosea'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosea" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'B.'"
                :prop="'schoose.' + index + '.chooseb'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.chooseb" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'C.'"
                :prop="'schoose.' + index + '.choosec'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosec" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'D.'"
                :prop="'schoose.' + index + '.choosed'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosed" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'答案'"
                :prop="'schoose.' + index + '.ckey'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change','focus']}"
                size="small"
              >
                <el-radio v-model="item.ckey" label="A">A</el-radio>
                <el-radio v-model="item.ckey" label="B">B</el-radio>
                <el-radio v-model="item.ckey" label="C">C</el-radio>
                <el-radio v-model="item.ckey" label="D">D</el-radio>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 修改多项选择题 -->
          <span>多项选择题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addmchoose"></el-button>
          <el-form :model="updateInfo" ref="mchooseRef" label-width="70px">
            <div v-for="(item, index) in updateInfo.mchoose" :key="2222+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'mchoose.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delmchoose(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'mchoose.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addmchoose"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'A.'"
                :prop="'mchoose.' + index + '.choosea'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosea" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'B.'"
                :prop="'mchoose.' + index + '.chooseb'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.chooseb" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'C.'"
                :prop="'mchoose.' + index + '.choosec'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosec" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'D.'"
                :prop="'mchoose.' + index + '.choosed'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
                size="small"
              >
                <el-input v-model="item.choosed" clearable></el-input>
              </el-form-item>
              <el-form-item
                :label="'答案'"
                :prop="'mchoose.' + index + '.ckey'"
                :rules="{required: true, type: 'array', min: 2, message: '至少为2项', trigger: 'change'}"
                size="small"
              >
                <el-checkbox-group v-model="item.ckey">
                  <el-checkbox label="A"></el-checkbox>
                  <el-checkbox label="B"></el-checkbox>
                  <el-checkbox label="C"></el-checkbox>
                  <el-checkbox label="D"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 修改判断题 -->
          <span>判断题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addjudge"></el-button>
          <el-form :model="updateInfo" ref="judgeRef" label-width="70px">
            <div v-for="(item, index) in updateInfo.judge" :key="3333+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'judge.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="deljudge(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'judge.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addjudge"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item :label="'答案'" size="small">
                <el-radio v-model="item.ckey" :label="0">错误</el-radio>
                <el-radio v-model="item.ckey" :label="1">正确</el-radio>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 修改简答题 -->
          <span>简答题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addpassage"></el-button>
          <el-form :model="updateInfo" ref="passageRef" label-width="70px">
            <div v-for="(item, index) in updateInfo.passage" :key="4444+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'passage.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delpassage(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'passage.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
                {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addpassage"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item :label="'答案'">
                <el-input v-model="item.ckey" type="textarea" autosize></el-input>
              </el-form-item>
            </div>
          </el-form>
          <br />
          <!-- 修改程序题 -->
          <span>程序题</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addprogram"></el-button>
          <el-form :model="updateInfo" ref="programRef" label-width="70px">
            <div v-for="(item, index) in updateInfo.program" :key="5555+index">
              <el-form-item
                :label="index+1 + '. 题干'"
                :prop="'program.' + index + '.title'"
                :rules="{required: true, message: '内容不能为空', trigger: ['blur','change']}"
              >
                <el-col :span="22">
                  <el-input v-model="item.title" type="textarea" autosize clearable></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    circle
                    @click="delprogram(item)"
                  ></el-button>
                </el-col>
              </el-form-item>
              <el-form-item
                :label="'分值'"
                :prop="'program.' + index + '.point'"
                :rules="[{required: true, message: '内容不能为空', trigger: ['blur','change']},
              {type: 'number', message: '必须输入数字'}]"
                size="small"
              >
                <el-col :span="10">
                  <el-input v-model.number="item.point" clearable></el-input>
                </el-col>
                <el-col :span="1" :offset="12">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="addprogram"
                  ></el-button>
                </el-col>
              </el-form-item>
            </div>
          </el-form>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateClose">取 消</el-button>
          <el-button type="primary" @click="putUpdate" :loading="updateLoading">修 改</el-button>
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
      temData: [],
      info: { teid: 0, kword: '', pagenum: 1, pagesize: 10 },
      total: 0,
      createVisible: false,
      detailVisible: false,
      updateVisible: false,
      putTemLoading: false,
      updateLoading: false,
      publishHomeworkLoading: false,
      temForm: {
        cid: '',
        teid: window.sessionStorage.getItem('token'),
        name: '',
        schoose: [],
        mchoose: [],
        judge: [],
        passage: [],
        program: []
      },
      temFormRules: {
        name: {
          required: true,
          message: '模板名不能为空',
          trigger: ['blur', 'change']
        },
        cid: {
          required: true,
          message: '课程不能为空',
          trigger: 'change'
        }
      },
      courseList: [],
      temInfo: {},
      classes: [],
      publishData: { class: '', tid: 0, finishtime: '', name: '' },
      updateInfo: {}
    }
  },
  created() {
    this.info.teid = window.sessionStorage.getItem('token')
    this.getTem()
    this.getCourse()
    this.loading = false
  },
  methods: {
    async getTem() {
      const { data: res } = await this.$http.get('/homework/getTem', {
        params: this.info
      })
      this.temData = res.templates
      this.info.pagenum = res.pagenum
      this.total = res.total
    },
    async getCourse() {
      const { data: res } = await this.$http.get('teacher/getcourse', {
        params: { teid: this.info.teid }
      })
      this.courseList = res
    },
    sizeChange(newsize) {
      this.info.pagesize = newsize
      this.getTem()
    },
    currentChange(newpage) {
      this.info.pagenum = newpage
      this.getTem()
    },
    async createTemOpen() {
      this.createVisible = true
      this.$nextTick(_ => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    createClose(done) {
      this.$confirm('关闭后，数据不保存，确认关闭？')
        .then(_ => {
          this.temForm = {
            cid: '',
            teid: window.sessionStorage.getItem('token'),
            name: '',
            schoose: [],
            mchoose: [],
            judge: [],
            passage: [],
            program: []
          }
          this.createVisible = false
          done()
        })
        .catch(_ => {})
    },
    updateClose(done) {
      this.$confirm('关闭后，数据不保存，确认关闭？')
        .then(_ => {
          this.updateInfo = {}
          this.updateVisible = false
          done()
        })
        .catch(_ => {})
    },
    putTemForm() {
      this.$refs.temFormRef.validate(valid => {
        if (!valid) {
          this.$message.warning('有必填项未填写')
          return false
        }
        this.$refs.schooseRef.validate(svalid => {
          if (!svalid) {
            this.$message.warning('有必填项未填写')
            return false
          }
          this.$refs.mchooseRef.validate(mvalid => {
            if (!mvalid) {
              this.$message.warning('有必填项未填写')
              return false
            }
            this.$refs.judgeRef.validate(jvalid => {
              if (!jvalid) {
                this.$message.warning('有必填项未填写')
                return false
              }
              this.$refs.passageRef.validate(pvalid => {
                if (!pvalid) {
                  this.$message.warning('有必填项未填写')
                  return false
                }
                this.$refs.programRef.validate(async prvalid => {
                  if (!prvalid) {
                    this.$message.warning('有必填项未填写')
                    return false
                  }
                  this.putTemLoading = true
                  const { data: res } = await this.$http.put(
                    '/homework/setTem',
                    this.temForm
                  )
                  if (res !== '添加成功') this.$message.error('添加失败')
                  else this.$message.success('添加成功')
                  this.putTemLoading = false
                  this.createVisible = false
                  this.temForm = {
                    cid: '',
                    teid: window.sessionStorage.getItem('token'),
                    name: '',
                    schoose: [],
                    mchoose: [],
                    judge: [],
                    passage: [],
                    program: []
                  }
                  this.getTem()
                })
              })
            })
          })
        })
      })
    },
    async detail(tid) {
      this.publishData.tid = tid
      const { data: res } = await this.$http.get(`/homework/${tid}`)
      this.temInfo = res.info
      this.classes = res.classes
      this.detailVisible = true
    },
    async del(tid) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该模板, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`/homework/${tid}`)
      this.getTem()
      if (res !== '删除成功') return this.$message.error('删除失败')
      this.$message.success('删除成功')
    },
    delschoose(item) {
      var index = this.temForm.schoose.indexOf(item)
      if (index !== -1) this.temForm.schoose.splice(index, 1)
    },
    delmchoose(item) {
      var index = this.temForm.mchoose.indexOf(item)
      if (index !== -1) this.temForm.mchoose.splice(index, 1)
    },
    deljudge(item) {
      var index = this.temForm.judge.indexOf(item)
      if (index !== -1) this.temForm.judge.splice(index, 1)
    },
    delpassage(item) {
      var index = this.temForm.passage.indexOf(item)
      if (index !== -1) this.temForm.passage.splice(index, 1)
    },
    delprogram(item) {
      var index = this.temForm.program.indexOf(item)
      if (index !== -1) this.temForm.program.splice(index, 1)
    },
    addschoose() {
      this.temForm.schoose.push({
        title: '',
        point: '',
        types: 0,
        choosea: '',
        chooseb: '',
        choosec: '',
        choosed: '',
        ckey: 'A'
      })
    },
    addmchoose() {
      this.temForm.mchoose.push({
        title: '',
        point: '',
        types: 1,
        choosea: '',
        chooseb: '',
        choosec: '',
        choosed: '',
        ckey: []
      })
    },
    addjudge() {
      this.temForm.judge.push({
        title: '',
        point: '',
        ckey: 0
      })
    },
    addpassage() {
      this.temForm.passage.push({
        types: 0,
        title: '',
        point: '',
        ckey: ''
      })
    },
    addprogram() {
      this.temForm.program.push({
        types: 1,
        title: '',
        point: '',
        ckey: ''
      })
    },
    async addHomework() {
      if (this.publishData.name === '') {
        return this.$message.warning('未填写作业名')
      }
      if (this.publishData.class === '') {
        return this.$message.warning('未选择班级')
      }
      if (this.publishData.finishtime === '') {
        return this.$message.warning('未选择截止时间')
      }
      this.publishHomeworkLoading = true
      const { data: res } = await this.$http.put(
        `/homework/${this.publishData.tid}`,
        {
          class: this.publishData.class,
          finishtime: this.publishData.finishtime,
          name: this.publishData.name
        }
      )
      if (res !== '发布成功') return this.$message.error('发布失败')
      this.publishHomeworkLoading = false
      this.detailVisible = false
      this.publishData.class = ''
      this.publishData.finishtime = ''
      this.$message.success('发布成功')
    },
    detailClose() {
      this.detailVisible = false
      this.publishData.class = ''
      this.publishData.finishtime = ''
      this.publishData.name = ''
    },
    async update(tid, cname, cid) {
      const { data: res } = await this.$http.get(`/homework/${tid}`)
      res.info.mchoose.forEach(item => {
        item.ckey = item.ckey.split(',')
      })
      this.updateInfo = res.info
      this.updateInfo['cname'] = cname
      this.updateInfo['cid'] = cid
      this.updateInfo['tid'] = tid
      this.updateVisible = true
    },
    putUpdate() {
      this.$refs.updateInfoRef.validate(valid => {
        if (!valid) {
          this.$message.warning('有必填项未填写')
          return false
        }
        this.$refs.schooseRef.validate(svalid => {
          if (!svalid) {
            this.$message.warning('有必填项未填写')
            return false
          }
          this.$refs.mchooseRef.validate(mvalid => {
            if (!mvalid) {
              this.$message.warning('有必填项未填写')
              return false
            }
            this.$refs.judgeRef.validate(jvalid => {
              if (!jvalid) {
                this.$message.warning('有必填项未填写')
                return false
              }
              this.$refs.passageRef.validate(pvalid => {
                if (!pvalid) {
                  this.$message.warning('有必填项未填写')
                  return false
                }
                this.$refs.programRef.validate(async prvalid => {
                  if (!prvalid) {
                    this.$message.warning('有必填项未填写')
                    return false
                  }
                  this.updateLoading = true
                  const { data: res } = await this.$http.put(
                    '/homework/updateTem',
                    this.updateInfo
                  )
                  if (res !== '更新成功') this.$message.error('修改失败')
                  else this.$message.success('修改成功')
                  this.updateLoading = false
                  this.updateVisible = false
                  this.updateInfo = {}
                  this.getTem()
                })
              })
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: auto;
  width: 810px;
  margin: 10px 0;
}
.el-link {
  margin: 0 5px;
}
.el-button {
  margin-left: 20px;
  margin-bottom: 10px;
}
.el-pagination {
  margin-left: 160px;
}
</style>
