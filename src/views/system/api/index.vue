<template>
    <Card>
        <Row class="margin-top-10">
            <Card :bordered="false" :dis-hover="true">
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    7日各个服务调用量
                </p>
                <div v-if="showDayInfo" class="line-chart-con">
                    <module-visit :visit="dayInfo"
                                  divid="service_request_day"
                                  areacolor="#10A6FF"/>
                </div>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Card :bordered="false" :dis-hover="true">
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    24小时各个服务调用量
                </p>
                <div v-if="showHourInfo" class="line-chart-con">
                    <module-visit :visit="hourInfo"
                                  divid="service_request_hour"
                                  areacolor="#0C17A6"/>
                </div>
            </Card>
        </Row>
    </Card>
</template>

<script>
  import {formatDate} from '@/libs/filters';
  import ModuleVisit from "../components/module-visit";

  export default {
    components: {ModuleVisit},
    data() {
      return {
        dayInfo: [],
        showDayInfo: false,
        hourInfo: [],
        showHourInfo: false
      };
    },
    computed: {},
    methods: {
      getDayData() {
        // 获取天级别的访问量
        let day1 = new Date();
        day1.setTime(day1.getTime() - 7 * 24 * 60 * 60 * 1000);
        let postDay = {
          timeStart: day1,
          period: "day"
        };
        this.$http.post('/system/info/period', postDay).then((res) => {
          if (res) {
            this.dayInfo = res;
            this.showDayInfo = true;
          }
        });
      },
      getHourData() {
        // 获取小时级的访问量
        let hour = new Date();
        hour.setTime(hour.getTime() - 24 * 60 * 60 * 1000);
        let postHour = {
          timeStart: hour,
          period: "hour"
        };
        this.$http.post('/system/info/period', postHour).then((res) => {
          if (res) {
            this.hourInfo = res.map(item => {
              item.id = item.id.substring(5);
              return item;
            });
            this.showHourInfo = true;
          }
        });
      }
    },
    created() {
    },
    mounted() {
      this.getHourData();
      this.getDayData();
    }
  };
</script>

<style lang="less" scoped>
    .line-chart-con {
        height: 400px;
    }
</style>
