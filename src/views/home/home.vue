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
              <Row class="margin-top-8">
                <i-col span="8">
                  <p class="notwrap">上次登录时间:</p>
                </i-col>
                <i-col span="16" class="padding-left-8">{{ userStatus.lastLoginData }}</i-col>
              </Row>
              <Row class="margin-top-8">
                <i-col span="8">
                  <p class="notwrap">上次登陆IP:</p>
                </i-col>
                <i-col span="16" class="padding-left-8">{{ userStatus.lastLoginIp }}</i-col>
              </Row>
            </i-col>
          </Row>
        </i-col>
        <i-col :md="24" :lg="16">
          <Row :gutter="5">
            <!-- <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <a @click="goAllUser"  title="点击查看所有用户">
                <infor-card
                  id-name="user_sum_count"
                  :end-val="count.sumUser"
                  iconType="android-person-add"
                  color="#2d8cf0"
                  intro-text="用户总数"
                ></infor-card>
              </a>
            </i-col> -->
            <!-- <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <infor-card
                id-name="user_created_count"
                :end-val="count.createUser"
                iconType="android-person-add"
                color="#00C1DE"
                intro-text="最近七天新增用户"
              ></infor-card>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <infor-card
                id-name="collection_count"
                :end-val="count.loginUser"
                iconType="android-person-add"
                color="#ffd572"
                intro-text="今日登录人数"
              ></infor-card>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <a  title="10分钟更新一次">
              <infor-card
                id-name="visit_count"
                :end-val="count.visit"
                iconType="ios-eye"
                color="#64d572"
                :iconSize="50"
                intro-text="今日服务调用量"
              ></infor-card>
              </a>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <a @click="goMyWork"  title="点击查看待我处理的业务">
                <infor-card
                  id-name="unfinishedWorkflow"
                  :end-val="workflows.unfinishedWorkflow"
                  iconType="android-document"
                  color="#2d8cf0"
                  :iconSize="50"
                  intro-text="还未处理的业务"
                ></infor-card>
              </a>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <infor-card
                id-name="finishedWorkflow"
                :end-val="workflows.finishedWorkflow"
                iconType="ios-folder"
                color="#64d572"
                :iconSize="50"
                intro-text="已处理的业务"
              ></infor-card>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <a @click="goMyQa" title="点击查看待我处理的问题">
                <infor-card
                  id-name="unfinishedQuestion"
                  :end-val="workflows.unfinishedQuestion"
                  iconType="chatbox"
                  color="#2d8cf0"
                  :iconSize="50"
                  intro-text="还未处理的问题"
                ></infor-card>
              </a>
            </i-col>
            <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
              <infor-card
                id-name="finishedQuestion"
                :end-val="workflows.finishedQuestion"
                iconType="chatbox-working"
                color="#64d572"
                :iconSize="50"
                intro-text="已处理的问题"
              ></infor-card>
            </i-col> -->
          </Row>
        </i-col>
      </Row>
      <Row class="margin-top-10">
        <!-- <Card :bordered="false" :dis-hover="true">
          <p slot="title" class="card-title">
            <Icon type="ios-shuffle-strong"></Icon>7日服务调用量
          </p>
          <div v-if="showDayVisit" class="line-chart-con">
            <service-requests :visit="dayVisit" divid="service_request_day" areacolor="#10A6FF"/>
          </div>
        </Card> -->
      </Row>
      <Row class="margin-top-10">
        <!-- <Card :bordered="false" :dis-hover="true">
          <p slot="title" class="card-title">
            <Icon type="ios-shuffle-strong"></Icon>24小时服务调用量
          </p>
          <div v-if="showHourVisit" class="line-chart-con">
            <service-requests :visit="hourVisit" divid="service_request_hour" areacolor="#0C17A6"/>
          </div>
        </Card> -->
      </Row>
    </Card>
  </div>
</template>

<script>
import inforCard from "./components/inforCard.vue";
import { formatFullDate } from "@/libs/filters";
import serviceRequests from "./components/serviceRequests.vue";

export default {
  name: "home",
  components: {
    inforCard,
    serviceRequests
  },
  data() {
    return {
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
      // this.$http.get("/system/info/homecount").then(res => {
      //   if (res) {
      //     this.count = res;
      //   }
      // });
      this.$http.get("/user/lastLogin").then(res => {
        if (res) {
          this.userStatus = res;
          this.userStatus.lastLoginData = res.lastLoginDate
            ? formatFullDate(res.lastLoginDate)
            : "-";
        }
      });
      // this.$http.get("/dictionary/belongToMe").then(res => {
      //   if (res) {
      //     this.workflows = res.data;
      //   }
      // });
      // // 获取天级别的访问量
      // let day1 = new Date();
      // day1.setTime(day1.getTime() - 7 * 24 * 60 * 60 * 1000);
      // let postDay = {
      //   timeStart: day1,
      //   period: "day"
      // };
      // this.$http.post("/system/visitstatus/period", postDay).then(res => {
      //   if (res) {
      //     this.dayVisit = res;
      //     this.showDayVisit = true;
      //   }
      // });
      // // 获取小时级的访问量
      // let hour = new Date();
      // hour.setTime(hour.getTime() - 24 * 60 * 60 * 1000);
      // let postHour = {
      //   timeStart: hour,
      //   period: "hour"
      // };
      // this.$http.post("/system/visitstatus/period", postHour).then(res => {
      //   if (res) {
      //     this.hourVisit = res.map(item => {
      //       item.id = item.id.substring(5);
      //       return item;
      //     });
      //     this.showHourVisit = true;
      //   }
      // });
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
