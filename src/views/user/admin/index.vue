<!--内部员工-->
<template>
  <div>
    <Row>
      <i-col span="24" style="padding-right: 12px;">
        <Card>
          <p slot="title">
            <Icon type="ios-list-outline"></Icon>内部员工列表
          </p>
          <Button slot="extra" type="primary" shape="circle" @click="freshData">
            <Icon type="ios-loop-strong"></Icon>刷新
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
      <!--<Modal v-model="editUserModal" cancel-text="" ok-text="关闭窗口" width="800"-->
      <!--@on-ok="freshData" @on-cancel="freshData" :closable="false">-->
      <!--<userUpdateEditor :onclose="editUserModal" :srcdata.sync="editUserData"/>-->
      <!--</Modal>-->
      <Modal v-model="editUserModal" width="1200" :closable="false">
        <userUpdateEditor
          :closemodal.sync="editUserModal"
          :srcdata="editUserData"
          :editablee="true"
        />
        <div slot="footer"></div>
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
          title: "用户名",
          key: "userName"
        },
        {
          title: "真实姓名",
          key: "trueName"
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
          title: "职位",
          align: "center",
          key: "position"
        },
        {
          title: "注册日期",
          align: "center",
          key: "regDate",
          render: (h, params) => {
            if (params.row.regDate) {
              return formatDate(params.row.regDate);
            } else {
              return "-";
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
      userDatas: [],
      modal3: false, //  定义mode3
      modal4: false, //  定义mode4
      groupDate: [],
      rolesDate: [],
      filterData: {
        valid: true,
        group: ["internalStaff"],
        page: {
          pageNumber: 1,
          totalSize: 10,
          pageSize: 10
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "allroles",
      "allmodules",
      "allgroups",
      "allrolesArray",
      "allgroupsArray"
    ])
  },
  methods: {
    handleEdit(val) {
      this.editUserModal = true;
      this.editUserData = val;
    },
    getData() {
      this.$http.post("/user/edit/query", this.filterData).then(res => {
        this.userDatas = res.list.map(item => {
          return item;
        });
        this.filterData.page.totalSize = res.totalSize;
        this.filterData.page.pageSize = res.pageSize;
        this.$Notice.success({
          title: "已获取最新用户数据",
          duration: 1
        });
      });
    },
    freshData() {
      this.filterData = {
        group: ["internalStaff"],
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
        group: ["internalStaff"],
        pageNumber: 1,
        totalSize: 0,
        pageSize: 10
      };
      this.getData();
    },
    viewsGroup(data) {
      this.modal4 = true;
      this.groupDate = data;
    },
    viewsRoles(data) {
      this.modal3 = true;
      this.rolesDate = data;
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
}

.edit-selector p label {
  padding-top: 10px;
  font-weight: 600;
  font-size: 15px;
}
</style>