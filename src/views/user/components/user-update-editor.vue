<!--修改用户的角色及用户组-->
<template>
    <div>
        <Row>
            <i-col span="6">
                <div class="margin-top-10">
                    <Card :bordered="false" :dis-hover="true">
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            用户组
                        </p>
                        <div class="edit-selector">
                            <CheckboxGroup v-model="editData.group">
                                <p v-for="item in allgroups" :key="item.id">
                                    <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                                </p>
                            </CheckboxGroup>
                        </div>
                    </Card>
                </div>
            </i-col>
            <i-col span="12">
                <Card :bordered="false" :dis-hover="true">
                    <Form :label-width="100" inline>
                        <!--<FormItem label="id" class="edit-form-item">-->
                            <!--<div class="preview-content-con" v-html="editData.id"></div>-->
                        <!--</FormItem>-->
                        <FormItem label="头像" class="edit-form-item">
                            <img :src="editData.logo" style="width:100px;">
                        </FormItem>
                        <FormItem label="头像地址" class="edit-form-item">
                            <Input v-model="editData.logo"/>
                        </FormItem>
                        <FormItem label="登陆账号" class="edit-form-item">
                            <Input v-model="editData.userName"/>
                        </FormItem>
                         <FormItem label="登陆密码" class="edit-form-item">
                            <Input v-model="editData.password"/>
                        </FormItem>
                        <FormItem label="手机号" class="edit-form-item">
                            <Input v-model="editData.phoneNum"/>
                        </FormItem>
                        <FormItem label="邮箱" class="edit-form-item">
                            <Input v-model="editData.email"/>
                        </FormItem>
                        <FormItem label="微信号" class="edit-form-item">
                            <Input v-model="editData.wechat"/>
                        </FormItem>
                        <FormItem label="个人简介" class="edit-form-item">
                            <Input v-model="editData.profile"/>
                        </FormItem>
                        <FormItem label="用户等级" class="edit-form-item">
                            <Input v-model="editData.level"/>
                        </FormItem>
                        <FormItem label="注册日期" class="edit-form-item">
                            <DatePicker type="date" v-model="editData.regDate" readonly>
                            </DatePicker>
                        </FormItem>
                        <FormItem label="出生日期" class="edit-form-item">
                            <DatePicker type="date" v-model="editData.birthday">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="性别" class="edit-form-item">
                            <RadioGroup v-model="editData.gender">
                                <Radio label="男"></Radio>
                                <Radio label="女"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否有效" class="edit-form-item">
                            <i-switch v-model="editData.valid" size="large">
                                <span slot="open">有效</span>
                                <span slot="close">无效</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="公司" class="edit-form-item">
                            <Input v-model="editData.company"/>
                        </FormItem>
                        <FormItem label="职位" class="edit-form-item">
                            <Input v-model="editData.position"/>
                        </FormItem>
                        <FormItem label="昵称" class="edit-form-item">
                            <Input v-model="editData.nickName"/>
                        </FormItem>
                        <FormItem label="真实姓名" class="edit-form-item">
                            <Input v-model="editData.trueName"/>
                        </FormItem>
                    </Form>
                </Card>
            </i-col>
            <i-col span="6">
                <div class="margin-top-10">
                    <Card :bordered="false" :dis-hover="true">
                        <Button type="primary" @click="freshEditor">刷新</Button>
                        <Button v-if="editablee" type="success" @click="handlePublish">提交修改</Button>
                        <Button type="ghost" @click="closeEditor">关闭</Button>
                    </Card>
                    <Card :bordered="false" :dis-hover="true">
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            用户角色
                        </p>
                        <div class="edit-selector">
                            <CheckboxGroup v-model="editData.roles">
                                <p v-for="item in allroles" :key="item.id">
                                    <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                                </p>
                            </CheckboxGroup>
                        </div>
                    </Card>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {formatDate,formatFullDate} from '@/libs/filters';
  import ISwitch from "iview/src/components/switch/switch";

  export default {
    name: 'user-update-editor',
    components: {ISwitch},
    props: ['srcdata', 'closemodal', 'editablee'],
    data() {
      return {
        fullSrc: {},
        lastUserEditId: '',
        userGroups: '',
        userRoles: ''
      };
    },
    computed: {
      editData() {
        if (this.srcdata && this.srcdata.id && this.srcdata.id !== this.lastUserEditId) {
          this.$http.get('/user/edit/get/' + this.srcdata.id).then(res => {
            this.fullSrc = res;
            this.fullSrc.regDate = formatFullDate(this.fullSrc.regDate);
            this.fullSrc.birthday = this.fullSrc.birthday ? formatDate(this.fullSrc.birthday) : '';
            this.lastUserEditId = this.srcdata.id;
          });
        }
        return this.fullSrc;
      },
      ...mapGetters(['allroles', 'allmodules', 'allgroups'])
    },
    methods: {
      freshEditor() {
        this.lastUserEditId = '';
        this.editData;
      },
      closeEditor() {
        this.$emit('update:closemodal', false);
      },
      findCategoryParents(theObject, item) {
        if (item && item.parent && item.parent !== 'root') {
          theObject[item.parent] = item.parent;
          this.findCategoryParents(this.articleCategoryMap[item.parent]);
        }
      },
      setCategory(selected) {
        let nodes = {}, arr = [];
        selected.map(item => {
          this.findCategoryParents(nodes, item);
          nodes[item.id] = item.id;
        });
        for (let i in nodes) {
          arr.push(nodes[i]);
        }
        this.editData.categorys = arr;
      },
      handlePublish() {
        this.$http.post('/user/edit/update', this.fullSrc).then(() => {
          this.$Notice.success({
            title: '修改用户信息成功',
            duration: 1
          });
          this.endPost();
          this.$emit('update:closemodal', false);
        }).catch(err => {
          this.$Notice.error({
            title: '修改用户信息失败',
            desc: err.msg
          });
        });
      },
      endPost() {
        //  更新用户组信息到store
        this.$store.dispatch('init_user_groups');
        //  更新后台管理用户到store（不同于网站用户）
        this.$store.dispatch('init_user_admins');
      }
    },
    created() {
    },
    mounted() {
    }
  };
</script>
<style lang="less" scoped>
    .edit-form-item {
        width: 400px;
    }

    .edit-selector {
        max-height: 600px;
        overflow:auto;
    }   
    .edit-scroll {
        height: 500px;
    }

    .edit-selector p label {
        padding-top: 10px;
        font-weight: 500;
        font-size: 13px;
    }
</style>
