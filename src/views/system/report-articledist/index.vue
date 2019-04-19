<template>
    <Row class="margin-top-10">
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="文章创建时间分布"
                                 :srcdata="createReport"
                                 divid="report-articledist-create-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="文章发布时间分布"
                                 :srcdata="publishReport"
                                 divid="report-articledist-publish-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="文章访问数量分布"
                                :srcdata="visitReport"
                                divid="report-articledist-visit-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="文章作者分布"
                                :srcdata="authorReport"
                                divid="report-articledist-author-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="文章状态分布"
                                :srcdata="stateReport"
                                divid="report-articledist-state-report"
                                areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportPieGraph graphname="文章标签数量分布"
                                :srcdata="labelReport"
                                divid="report-articledist-label-report"
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
        createReport: [],
        publishReport: [],
        visitReport: [],
        authorReport: [],
        stateReport: [],
        labelReport: [],
        showReport: false,
      };
    },
    computed: {},
    methods: {
      sortItemByName(a, b) {
        console.log(a);
        console.log(a.name.replace('-', ''));
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
            type: 'ARTICLEDIST'
          }
        };
        this.$http.get('/system/statistic/info', params).then((res) => {
          if (res) {
            this.createReport = [];
            this.publishReport = [];
            this.visitReport = [];
            this.authorReport = [];
            this.stateReport = [];
            this.labelReport = [];
            if (res.report) {
              this.saveToReport(this.createReport, res.report.createMap);
              this.saveToReport(this.publishReport, res.report.publishTime);
              this.saveToReport(this.visitReport, res.report.visitMap);
              this.saveToReport(this.authorReport, res.report.authorMap);
              this.saveToReport(this.stateReport, res.report.stateMap);
              this.saveToReport(this.labelReport, res.report.labelMap);
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
