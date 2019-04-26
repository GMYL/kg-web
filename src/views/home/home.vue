<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
  <div class="home-main">
    <Card>
      <Row :gutter="10">
        <i-col :md="24" :lg="8">
          <Row class-name="home-page-row1" :gutter="10">
            <i-col :md="12" :lg="24" :style="{marginBottom: '10px'}">
              <Row type="flex" class="user-infor">
                <i-col span="8">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="avatorPath">
                  </Row>
                </i-col>
                <i-col span="16" style="padding-left:6px;">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                      <b class="card-user-infor-name">{{ welcomeMsg }}</b>
                      <b class="card-user-infor-name">{{ this.$store.getters.user.nickName }}</b>
                      <p>{{ this.$store.getters.user.userName }}</p>
                    </div>
                  </Row>
                </i-col>
              </Row>
              <div class="line-gray"></div>
            </i-col>
          </Row>
        </i-col>
        <i-col :md="24" :lg="16">
            <Row class="margin-top-30">
                <i-col span="8">
                  <p class="notwrap">上次登录时间:</p>
                </i-col>
                <i-col span="16" class="padding-left-8">{{ userStatus.lastLoginData }}</i-col>
            </Row>
            <Row class="margin-top-30">
                <i-col span="8">
                  <p class="notwrap">上次登陆IP:</p>
                </i-col>
                <i-col span="16" class="padding-left-8">{{ userStatus.lastLoginIp }}</i-col>
            </Row>
        </i-col>
      </Row>
      <Row class="margin-top-10">
        <Card :bordered="false"  dis-hover >
              <div class="word-graph-div" style="height:800px" v-if="showGraph">
                  <word-Graph v-if="showGraph"
                              :wordlist="wordlist"
                              :closemodal.sync="showGraph"
                              :freshGraph.sync="freshGraph"
                              :picknode.sync="pickNode"
                              :picklink.sync="pickLink"/>
              </div>
        </Card>
      </Row>
      <Row class="margin-top-10">
      </Row>
    </Card>
  </div>
</template>

<script>
import wordGraph from '../wizard/components/word-graph';
import inforCard from "./components/inforCard.vue";
import { formatFullDate } from "@/libs/filters";
import serviceRequests from "./components/serviceRequests.vue";

export default {
  name: "home",
  components: {
    wordGraph,
    inforCard,
    serviceRequests
  },
  data() {
    return {
      wordlist: ['F0396', 'I0186','F0519'],
      showGraph: true,
      freshGraph: 0,
      pickNode: {},
      pickLink: {
          start: '',
          end: ''
        },
      count: {
        sumUser: 0,
        createUser: 0,
        loginUser: 0,
        visit: 0
      },
      userStatus: {},
      workflows: {
        unfinishedWorkflow: 0,
        finishedWorkflow: 0,
        unfinishedQuestion: 0,
        finishedQuestion: 0
      },
      dayVisit: [],
      showDayVisit: false,
      hourVisit: [],
      showHourVisit: false
    };
  },
  computed: {
    avatorPath() {
      return this.$store.state.user.user.logo;
    },
    welcomeMsg() {
      let now = new Date(),
        hour = now.getHours();
      if (hour < 6) return "凌晨好，";
      else if (hour < 9) return "早上好，";
      else if (hour < 12) return "上午好，";
      else if (hour < 14) return "中午好，";
      else if (hour < 19) return "下午好，";
      else if (hour < 22) return "晚上好，";
      else return "夜里好，";
    }
  },
  methods: {
    addNewToDoItem() {
      this.showAddNewTodo = true;
    },
    addNew() {
      if (this.newToDoItemValue.length !== 0) {
        this.toDoList.unshift({
          title: this.newToDoItemValue
        });
        setTimeout(() => {
          this.newToDoItemValue = "";
        }, 200);
        this.showAddNewTodo = false;
      } else {
        this.$Message.error("请输入待办事项内容");
      }
    },
    getCount() {
      this.$http.get("/user/lastLogin").then(res => {
        if (res) {
          this.userStatus = res;
          this.userStatus.lastLoginData = res.lastLoginDate
            ? formatFullDate(res.lastLoginDate)
            : "-";
        }
      });
      
    },
    goMyWork() {
      this.$router.push({ name: "work_solve" });
    },
    goMyQa() {
      this.$router.push({ name: "qa_solve" });
    },
    goAllUser() {
      this.$router.push({ name: "user_list" });
    }
  },
  mounted() {
    this.getCount();
  }
};
</script>
