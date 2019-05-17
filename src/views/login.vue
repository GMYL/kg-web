<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <i-input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="password">
                            <i-input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </i-input>
                        </FormItem>
                        <p>游客账号:admin  密码:admin</p>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                        <p>若登陆反应，系统正在更新维护</p>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [{required: true, message: '账号不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
        }
      };
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('login', this.form).then(res => {
              let last = JSON.stringify(res); // 将JSON对象转化为JSON字符
              this.$Notice.success({
                title: '登陆成功',
                desc: '欢迎' + res.userName
              });
              if( this.form.userName == "admin"){
                this.$router.push({name: 'show_list'});
              }else{
                this.$router.push({name: 'home_index'});
              }
            });
          }
        });
      }
    }
  };
</script>

<style>

</style>
