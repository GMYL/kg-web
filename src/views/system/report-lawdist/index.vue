<template>
    <Row class="margin-top-10">
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="法规的时间分布"
                                 :srcdata="timeReport"
                                 divid="report-lawdist-time-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="法规的访问数量分布"
                                 :srcdata="visitReport"
                                 divid="report-lawdist-visit-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="法规的有效性分布"
                                :srcdata="validReport"
                                divid="report-lawdist-valid-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="法规的类型分布"
                                :srcdata="typeReport"
                                divid="report-lawdist-type-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="相关法规分布"
                                 :srcdata="attachReport"
                                 divid="report-lawdist-attach-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="法规的附件分布"
                                :srcdata="annexesReport"
                                divid="report-lawdist-annexes-report"
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
        validReport: [],
        typeReport: [],
        attachReport: [],
        annexesReport: [],
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
            type: 'LAWDIST'
          }
        };
        this.$http.get('/system/statistic/info', params).then((res) => {
          if (res) {
            this.timeReport = [];
            this.visitReport = [];
            this.validReport = [];
            this.typeReport = [];
            this.attachReport = [];
            this.annexesReport = [];
            if (res.report) {
              this.saveToReport(this.timeReport, res.report.timeMap);
              this.saveToReport(this.visitReport, res.report.visitMap);
              this.saveToReport(this.validReport, res.report.validMap);
              this.saveToReport(this.typeReport, res.report.typeMap);
              this.saveToReport(this.attachReport, res.report.attachMap);
              this.saveToReport(this.annexesReport, res.report.annexesMap);
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
