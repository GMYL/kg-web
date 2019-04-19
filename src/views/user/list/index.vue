<!--用户列表-->
<template>
  <div>
    <Row>
      <i-col span="19" style="padding-right: 12px;">
        <Card>
          <p slot="title">
            <Icon type="ios-list-outline"></Icon>用户列表
          </p>
          <Button slot="extra" type="success" shape="circle" @click="modal2 = true">
            <Icon type="plus"></Icon>添加
          </Button>
          <Button slot="extra" type="primary" shape="circle" @click="freshData">
            <Icon type="ios-loop-strong"></Icon>刷新用户列表
          </Button>
          <div class="filterTool">
            <div class="toolBar">
              <ButtonGroup>
                <Button
                  @click="filterData.valid=null;getFresh()"
                  :type="filterData.valid===null?'primary':null"
                >全部</Button>
                <Button
                  @click="filterData.valid=true;getFresh()"
                  :type="filterData.valid===true?'primary':null"
                >有效用户</Button>
                <Button
                  @click="filterData.valid=false;getFresh()"
                  :type="filterData.valid===false?'primary':null"
                >失效用户</Button>
              </ButtonGroup>
            </div>
          </div>
          <Table highlight-row :columns="columnsList" :data="userDatas" border></Table>
          <Page
            v-show="filterData.page.totalSize > 10"
            :total="filterData.page.totalSize"
            show-sizer
            @on-change="getPageData"
            @on-page-size-change="setPageSize"
            :current="filterData.page.pageNumber"
            class="pageTool"
            :page-size-opts="[10,20,50,100,200,500,1000]"
          ></Page>
        </Card>
      </i-col>
      <i-col span="5" style>
        <Card>
          <p slot="title">
            <Icon type="ios-list-outline"></Icon>条件查询
          </p>
          <Button slot="extra" type="primary" shape="circle" @click="searchClick">
            <Icon type="ios-search"></Icon>查询
          </Button>
          <Form :label-width="60">
            <FormItem label="登录账号">
              <Input v-model="searchData.userName"/>
            </FormItem>
            <FormItem label="真实姓名">
              <Input v-model="searchData.trueName"/>
            </FormItem>
            <FormItem label="手机号">
              <Input v-model="searchData.phoneNum"/>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="searchData.email"/>
            </FormItem>
            <FormItem label="注册时间">
              <DatePicker
                v-model="searchData.regDate"
                type="daterange"
                placement="bottom-start"
                placeholder="选择时间范围"
              ></DatePicker>
            </FormItem>
          </Form>
        </Card>
        <br>
        <Card :bordered="false" :dis-hover="true">
          <p slot="title">
            <Icon type="navicon-round"></Icon>用户组
          </p>
          <!-- <Button type="success" shape="circle" @click="onlyAdmins" slot="extra">仅管理员</Button> -->
          <Button type="primary" shape="circle" @click="pickAllGroups" slot="extra">全选</Button>
          <div class="edit-selector">
            <CheckboxGroup v-model="userGroupPick">
              <p v-for="item in allgroups" :key="item.id">
                <Checkbox :label="item.id">{{ item.name }}</Checkbox>
              </p>
            </CheckboxGroup>
          </div>
        </Card>
      </i-col>
      <Modal v-model="editUserModal" width="1200" :closable="false">
        <userUpdateEditor
          :closemodal.sync="editUserModal"
          :srcdata="editUserData"
          :editablee="true"
        />
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="modal2" title="添加" @on-ok="addData" width="450">
        <Form :model="addItemData" label-position="left" :label-width="110">
          <FormItem label="(必填) 登录账号">
            <Input
              v-model="addItemData.userName"
              placeholder="请填写登录账号"
              clearable
              style="width: 200px"
            />
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </FormItem>
          <FormItem label="(必填) 登录密码">
            <Input
              v-model="addItemData.password"
              placeholder="请填写登录密码"
              clearable
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="真实姓名">
            <Input
              v-model="addItemData.trueName"
              placeholder="请填写真实姓名"
              clearable
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="addItemData.gender">
              <Radio label="男"></Radio>
              <Radio label="女"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="手机号">
            <Input
              v-model="addItemData.phoneNum"
              placeholder="请填写手机号"
              clearable
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="邮箱">
            <Input v-model="addItemData.email" placeholder="请填写邮箱" clearable style="width: 200px"/>
          </FormItem>
          <FormItem label="用户组">
            <div style="max-height: 200px;overflow:auto;">
              <CheckboxGroup v-model="addItemData.group">
                <p v-for="item in allgroups" :key="item.id">
                  <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                </p>
              </CheckboxGroup>
            </div>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="modal4" title="包含用户组信息" width="220">
        <Row>
          <i-col span="12">
            <h3>包含用户组：</h3>
            <p v-for="item in groupDate" :key="item">
              <Tag class="fooo">{{ allgroupsArray[item] == null ? item : allgroupsArray[item] }}</Tag>
            </p>
          </i-col>
        </Row>
      </Modal>
      <Modal v-model="modal3" title="包含角色信息" width="220">
        <Row>
          <i-col span="12">
            <h3>包含角色：</h3>
            <p v-for="item in rolesDate" :key="item">
              <Tag class="fooo">{{ allrolesArray[item] == null ? item : allrolesArray[item] }}</Tag>
            </p>
          </i-col>
        </Row>
      </Modal>
    </Row>
  </div>
</template>

<script>
import { formatDate } from "@/libs/filters";
import { mapGetters } from "vuex";
import userUpdateEditor from "../components/user-update-editor";

export default {
  components: { userUpdateEditor },
  data() {
    return {
      editUserModal: false,
      editUserData: {
        id: "",
        roleId: "",
        roles: ""
      },
      columnsList: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "登录账号",
          key: "userName",
          width: 170
        },
        {
          title: "真实姓名",
          key: "trueName",
          width: 95
        },
        {
          title: "手机号",
          align: "center",
          key: "phoneNum",
          width: 130,
          render: (h, params) => {
            if (params && params.row.phoneNum) {
              if (params.row.phoneNum.substring(0, 5) === "unset") {
                return "";
              } else {
                return h('span', params.row.phoneNum);
              }
            }
          }
        },
        {
          title: "邮箱",
          key: "email",
          render: (h, params) => {
            if (params && params.row.email) {
              if (params.row.email.substring(0, 5) === "unset") {
                return "";
              } else {
                return h('span', params.row.email);
              }
            }
          }
        },
        {
          title: "微信",
          align: "center",
          key: "wechat"
        },
        {
          title: "公司",
          align: "center",
          key: "company"
        },
        {
          title: "注册日期",
          align: "center",
          key: "regDate",
          width: 75,
          render: (h, params) => {
            if (params.row.regDate) {
              return formatDate(params.row.regDate);
            } else {
              return "-";
            }
          }
        },
        {
          title: "有效性",
          align: "center",
          key: "valid",
          width: 95,
          render: (h, params) => {
            if (params && params.row) {
              return params.row.valid
                ? h("Tag", { props: { color: "green" } }, "有效")
                : h("Tag", { props: { color: "red" } }, "失效");
            }
          }
        },
        {
          title: "角色",
          align: "center",
          key: "roles",
          width: 80,
          render: (h, params) => {
            if (params.row.roles != null && params.row.roles.length > 0) {
              return h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.viewsRoles(params.row.roles);
                    }
                  }
                },
                "详细"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    size: "small"
                  }
                },
                "无信息"
              );
            }
          }
        },
        {
          title: "用户组",
          align: "center",
          key: "group",
          width: 80,
          render: (h, params) => {
            if (params.row.group != null && params.row.group.length > 0) {
              return h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.viewsGroup(params.row.group);
                    }
                  }
                },
                "详细"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    size: "small"
                  }
                },
                "无信息"
              );
            }
          }
        },
        {
          title: "操作",
          align: "center",
          width: 80,
          key: "handle",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      searchData: {
        id: null,
        userName: null,
        phoneNum: null,
        email: null,
        regDate: null
      },
      addItemData: {group:[]}, //  定义添加数据
      ruleInline: {
        userName: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      },
      modal2: false, //  定义mode2
      modal3: false, //  定义mode3
      modal4: false, //  定义mode4
      groupDate: [],
      rolesDate: [],
      // userGroupPick: this.$store.getters.allgroups.filter(g => ['sim', 'tmp'].indexOf(g.id) === -1).map(g => g.id),
      userGroupPick: [],
      userDatas: [],
      filterData: {
        valid: true,
        page: {
          pageNumber: 1,
          totalSize: 10,
          pageSize: 10
        }
      }
    };
  },
  computed: {
    ...mapGetters(["allroles", "allmodules", "allgroups", "allrolesArray", "allgroupsArray"])
  },
  methods: {
    handleEdit(val) {
      this.editUserModal = true;
      this.editUserData = val;
    },
    searchClick() {
      for (let k in this.searchData) {
        let val = this.searchData[k];
        if (val) {
          this.filterData[k] = this.searchData[k];
        } else {
          this.filterData[k] = null;
        }
      }
      if (
        !(
          this.filterData.regDate &&
          this.filterData.regDate[0] &&
          this.filterData.regDate[1]
        )
      ) {
        this.filterData.regDate = null;
      }
      // this.searchDataSearching = true;
      this.getData();
    },
    pickAllGroups() {
      //  用户组全选及取消全选
      if (this.userGroupPick.length !== this.allgroups.length) {
        this.userGroupPick = this.allgroups.map(item => item.id);
      } else {
        this.userGroupPick = [];
      }
    },
    // onlyAdmins() {
    //   if (this.userGroupPick.length === 0 || this.userGroupPick[0] !== '后台用户') {
    //     this.userGroupPick = ['后台用户'];
    //   } else {
    //     this.userGroupPick = [];
    //   }
    // },
    viewsGroup(data) {
      this.modal4 = true;
      this.groupDate = data;
    },
    viewsRoles(data) {
      this.modal3 = true;
      this.rolesDate = data;
    },
    freshData() {
      this.filterData = {
        valid: true,
        page: {
          pageNumber: 1,
          totalSize: 0,
          pageSize: 10
        }
      };
      this.getData();
    },
    getFresh() {
      this.filterData.page = {
        pageNumber: 1,
        totalSize: 0,
        pageSize: 10
      };
      this.getData();
    },
    addData() {
      let obj = this.$data.addItemData;
      if (obj.userName == null && obj.password == null) {
        this.$Message.error("账号或密码不能为空!");
      } else {
        this.$http.put("/user", obj).then(
          res => {
            this.$Notice.success({
              title: "添加成功"
            });
            //  成功后数据置为空
            this.addItemData = {group:[]};
            this.getData();
          },
          error => {
            this.$Notice.error({
              title: "添加失败"
            });
          }
        );
      }
    },
    getData() {
      this.$http.post("/user/edit/query", this.filterData).then(res => {
        this.userDatas = res.list.map(item => {
          return item;
        });
        this.filterData.page.totalSize = res.totalSize;
        this.$Notice.success({
          title: "已获取最新用户数据",
          duration: 1
        });
      });
    },
    getPageData(val) {
      this.filterData.page.pageNumber = val;
      this.getData();
    },
    setPageSize(val) {
      this.filterData.page.pageSize = val;
      this.getData();
    }
  },
  watch: {
    userGroupPick: function(newval, oldval) {
      //  用户组的筛选
      if (newval.length > 0) {
        this.filterData.group = newval;
      } else {
        delete this.filterData.group;
      }
      this.getData();
    },
    editUserModal: function(newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        this.freshData();
      }
    }
  },
  created() {
    // 查看store中是否请求过roles(角色)数据，没有的话请求数据
    if (!this.$store.state.user.getRoles) {
      this.$store.dispatch("init_user_roles");
    }
    // 查看store中是否请求过group（用户组）数据，没有的话请求数据
    if (!this.$store.state.user.getGroup) {
      this.$store.dispatch("init_user_groups");
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.edit-selector {
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
}

.edit-selector p label {
  padding-top: 10px;
  font-weight: 600;
  font-size: 15px;
}

.fooo {
  font-size: 14px;
  width: 120px;
}
</style>
