<template>
  <div class="site-wrapper site-page--first-login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <h2 class="first-login-title">首次登录</h2>
        <p class="first-login-desc">
          您好 <em>{{ name }}</em> ，请修改初始登录密码！
        </p>
        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="dataRule"
          @keyup.enter.native="dataFormSubmit()"
          label-width="100px"
        >
          <el-form-item label="初始密码" prop="initPass">
            <el-input
              v-model="dataForm.initPass"
              type="password"
              :placeholder="placeholderInitPass"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="新的密码" prop="newPass">
            <el-input
              v-model="dataForm.newPass"
              type="password"
              :placeholder="placeholderNewPass"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPass">
            <el-input
              v-model="dataForm.confirmPass"
              type="password"
              placeholder="请再次输入新密码"
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="edit-button"
              @click="submitForm('dataForm')"
            >
              提交
            </el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
            <!-- <p>
              注意：点击【提交】弹出的<em>PIN重试</em>的输入框中请请输入新的PIN码！
            </p> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validPassword } from '@/utils/validate'
import { password } from '@/api/permission/user'
import gm from '@/utils/gm'

export default {
  name: 'FirstLogin',
  data() {
    var validateInitPass = (rule, value, callback) => {
      if (!validPassword(value, false)) {
        callback(new Error(this.placeholderInitPass))
      } else {
        callback()
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error(this.placeholderNewPass))
      } else if (this.dataForm.initPass === value) {
        callback(new Error('新密码不能与初始密码相同'))
      } else {
        callback()
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      if (this.dataForm.newPass !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dataForm: {
        initPass: '',
        newPass: '',
        confirmPass: ''
      },
      dataRule: {
        initPass: [
          {
            required: true,
            validator: validateInitPass,
            trigger: 'blur'
          }
        ],
        newPass: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            validator: validateNewPass,
            trigger: 'blur'
          }
        ],
        confirmPass: [
          {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            validator: validateConfirmPass,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['name', 'settings']),
    placeholderInitPass: {
      get() {
        return this.LB.placeholder.PASSWD_INIT
      }
    },
    placeholderNewPass: {
      get() {
        return this.settings.complexPassword
          ? this.LB.placeholder.PASSWD_NEW_C
          : this.LB.placeholder.PASSWD_NEW_S
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            password: gm.sm3(this.dataForm.initPass),
            newPassword: gm.sm3(this.dataForm.newPass)
          }
          password(data)
            .then(({ code, msg }) => {
              if (code === 200) {
                // 3.修改后台密码成功，退出重新登录
                this.successAction()
              } else {
                // 4.修改后台密码失败，恢复原密码
                this.modifUkeyPin(this.dataForm.newPin, this.dataForm.initPin)
                this.$alert('修改PIN码失败，错误：' + data.msg, '修改PIN码', {
                  type: 'error'
                })
              }
            })
            .catch(reason => {
              // 4.修改后台密码异常，恢复原密码
              console.error(reason)
              this.modifUkeyPin(this.dataForm.newPin, this.dataForm.initPin)
              this.$alert(
                '修改PIN码失败，错误：' + reason.message,
                '修改PIN码',
                {
                  type: 'error'
                }
              )
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.site-wrapper.site-page--first-login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;

  .site-content__wrapper {
    padding: 0;
    margin: 0;
    background-color: #fff;
  }

  .site-content {
    position: fixed;
    top: 5%;
    left: 50%;
    z-index: 2;
    padding: 30px;
    text-align: center;
    transform: translate(-50%, 0);
  }

  .first-login-title {
    margin: 20px 0 15px;
    font-size: 3em;
    font-weight: 50;
    color: rgb(55, 71, 79);
  }

  .first-login-desc {
    margin: 0 0 30px;
    font-size: 26px;
    text-transform: uppercase;
    color: rgb(118, 131, 143);

    > em {
      font-style: normal;
      color: #409eff;
    }
  }

  .first-login-btn-gohome {
    margin-left: 30px;
  }
}
</style>
