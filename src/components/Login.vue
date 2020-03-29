<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图标区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 学号或工号 -->
        <el-form-item prop="id">
          <el-input v-model="loginForm.id" prefix-icon="el-icon-user-solid" placeholder="学号或工号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-unlock"
            type="password"
            show-password
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- 身份 -->
        <el-radio-group v-model="loginForm.identity">
          <el-radio :label="'student'">学生</el-radio>
          <el-radio :label="'teacher'">教师</el-radio>
          <el-radio :label="'assistant'">助教</el-radio>
        </el-radio-group>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :loading="loginLoading">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        id: '',
        password: '',
        identity: 'student'
      },
      loginFormRules: {
        name: [
          { required: true, message: '请输入学号或工号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      },
      loginLoading: false
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        this.loginLoading = true
        const { data: res } = await this.$http.post('/login', this.loginForm)
        this.loginLoading = false
        if (!res) return this.$message.error('用户不存在或密码错误')
        console.log(res.id)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.id)
        this.$router.push('/' + this.loginForm.identity)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  // background-color: #2b4b6b;
  background: url('../assets/bg.jpg') no-repeat ;
  background-size: 100% 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  // border: 5px solid #3c9fd8;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .el-radio-group {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
}
</style>
