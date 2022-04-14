<template>
  <!--通过类名设置背景图片-->
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!--头部背景-->
      <div class="title-container">
        <h3 class="title">
          <img alt="" src="@/assets/common/login-logo.png">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          auto-complete="on"
          name="username"
          placeholder="请输入手机号"
          tabindex="1"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 事件的修饰符：@keyup.enter.native  enter按键的修饰符、native监听组件的原生事件 -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          auto-complete="on"
          name="password"
          placeholder="请输入密码"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="loginBtn" style="width:100%;margin-bottom:30px;" type="primary" @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      // 校验成功 执行callback
      // 校验失败 执行callback(new Error('错误信息'))
      /* if (!validUsername(value)) {
       callback(new Error('Please enter the correct user name'))
       } else {
       callback()
       }*/
      validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
    /* const validatePassword = (rule, value, callback) => {
     if (value.length < 6) {
     callback(new Error('The password can not be less than 6 digits'))
     } else {
     callback()
     }
     }*/
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        // trigger 校验的触发方式blur/change
        // validate 自定义函数
        mobile: [
          {
            required: true,
            trigger: 'blur',
            message: '手机号不能为空'
          },
          {
            validator: validateMobile,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          },
          {
            trigger: 'blur',
            min: 6,
            max: 16,
            message: '密码长度为6-16位之间'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['user/login']), // 引入方法
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // 表单的手动校验
      this.$refs.loginForm.validate(async isOk => {
        // 是否校验通过 只有校验通过之后才去调用action
        if (isOk) {
          try {
            this.loading = true
            await this['user/login'](this.loginForm)
            // 应该是登录成功之后
            // async标记的函数实际上是一个promise对象
            // await下面的代码都是成功执行的代码
            this.$router.push('/')
            /* this.loading = false*/
          } catch (error) {
            console.log(error)
            /* this.loading = false*/
          } finally {
            // 无论执行try还是catch 都去关闭转圈
            this.loading = false
          }
        }
      })
      // ref可以获取到一个元素的dom对象
      // ref作用到组件上的时候，可以获取该组件的实例 this
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg');
  background-position: center;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    color: #fff
  }

  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
