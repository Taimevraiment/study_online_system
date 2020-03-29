<template>
  <div>
    <h3>欢迎你，{{ name }}</h3>
    <el-dialog
      title="请修改你的密码"
      :visible.sync="passwordVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="pswdForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
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
  </div>
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
      name: '',
      id: 0,
      passwordVisible: false,
      passLoading: false,
      pswdForm: { password: '', checkPass: '' },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.id = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/assis/getname', {
        params: { id: this.id }
      })
      this.name = res.name
      if (res.password === res.id.toString()) this.passwordVisible = true
      else this.passwordVisible = false
    },
    async updatePassword() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
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
    },
    handleClose() {
      this.$message.warning('请先修改密码')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
