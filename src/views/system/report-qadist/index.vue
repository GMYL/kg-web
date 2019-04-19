<template>
    <Row class="margin-top-10">
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="问题的时间分布"
                                 :srcdata="timeReport"
                                 divid="report-qadist-time-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="问题的访问数量分布"
                                :srcdata="visitReport"
                                divid="report-qadist-visit-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="问题的类型分布"
                                :srcdata="typeReport"
                                divid="report-qadist-type-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="问题的暗标题数量分布"
                                 :srcdata="darkTitleReport"
                                 divid="report-qadist-darktitle-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
    </Row>
</template>

<script>
  import {formatDate} from '@/libs/filters';
  import reportAxisGraph from "../components/report-axis-graph";
  import reportPieGraph from "../components/report-pie-graph";

  export default {
    components: {reportAxisGraph, reportPieGraph},
    data() {
      return {
        timeReport: [],
        visitReport: [],
        typeReport: [],
        darkTitleReport: [],
        showReport: false,
      };
    },
    computed: {},
    methods: {
      sortItemByName(a, b) {
        return a.name.replace(/-/g, '') - b.name.replace(/-/g, '');
      },
      saveToReport(report, tarMap) {
        if (tarMap) {
          for (let item in tarMap) {
            report.push({
              id: item,
              name: item,
              count: tarMap[item]
            });
          }
          report.sort(this.sortItemByName);
        }
      },
      getReportData() {
        let params = {
          params: {
            type: 'QADIST'
          }
        };
        this.$http.get('/system/statistic/info', params).then((res) => {
          if (res) {
            this.timeReport = [];
            this.visitReport = [];
            this.typeReport = [];
            this.darkTitleReport = [];
            if (res.report) {
              this.saveToReport(this.timeReport, res.report.timeMap);
              this.saveToReport(this.visitReport, res.report.visitMap);
              this.saveToReport(this.typeReport, res.report.typeMap);
              this.saveToReport(this.darkTitleReport, res.report.darkTitleMap);
              this.showReport = true;
            }
          }
        });
      }
    },
    created() {
    },
    mounted() {
      this.getReportData();
    }
  };
</script>

<style lang="less" scoped>
    .line-chart-con {
        height: 400px;
    }
</style>
