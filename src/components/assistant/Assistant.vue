<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/logo.png" alt />
        <span>在线学习系统</span>
      </div>
      <p>
        <el-button type="primary" @click="passwordVisible=true">修改密码</el-button>
        <el-button type="info" @click="logout">退出</el-button>
      </p>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#1a90f0"
          router
          :default-active="this.$route.fullPath"
        >
          <el-menu-item index="/assispublished">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>已发布作业</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/assismarking">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>未批阅作业</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/assismarked">
            <template slot="title">
              <i class="el-icon-document-checked"></i>
              <span>已批阅作业</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
        <el-dialog title="修改密码" :visible.sync="passwordVisible" width="50%">
          <el-form :model="pswdForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="旧密码">
              <el-input type="password" v-model="pswdForm.oldPass" clearable show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input type="password" v-model="pswdForm.password" clearable show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="pswdForm.checkPass" clearable show-password></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updatePassword" :loading="passLoading">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (
        value !== undefined &&
        (value.length < 6 || value.length > 15)
      ) {
        callback(new Error('长度在6到15个字符'))
      } else if (value === this.id) {
        callback(new Error('不能为初始密码'))
      } else {
        if (this.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pswdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      id: window.sessionStorage.getItem('token'),
      passwordVisible: false,
      passLoading: false,
      pswdForm: { oldPass: '', password: '', checkPass: '' },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    updatePassword() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        const { data: info } = await this.$http.get('/assis/getname', {
          params: { id: this.id }
        })
        if (info.password !== this.pswdForm.oldPass) {
          return this.$message.warning('旧密码不正确')
        }
        this.passLoading = true
        const { data: res } = await this.$http.put('/assis/password', {
          pswd: this.pswdForm.password,
          aid: this.id
        })
        if (res !== '修改成功') this.$message.error('修改失败')
        else {
          this.$message.success(res)
          this.passwordVisible = false
        }
        this.passLoading = false
      })
    }
  }
}
</script>

<style lang="less" scope>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      margin-left: 10px;
    }
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  /deep/ .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
</style>
