<template>
    <Row class="margin-top-10">
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="工作流的状态分布"
                                 :srcdata="stateReport"
                                 divid="report-workflowdist-state-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="工作流的负责组分布"
                                 :srcdata="managerReport"
                                 divid="report-workflowdist-manager-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
    </Row>
</template>

<script>
  import {formatDate} from '@/libs/filters';
  import reportAxisGraph from "../components/report-axis-graph";

  export default {
    components: {reportAxisGraph},
    data() {
      return {
        stateReport: [],
        managerReport: [],
        showReport: false,
      };
    },
    computed: {},
    methods: {
      sortItemByName(a, b) {
        return a.name - b.name;
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
            type: 'WORKFLOWDIST'
          }
        };
        this.$http.get('/system/statistic/info', params).then((res) => {
          if (res) {
            this.stateReport = [];
            this.managerReport = [];
            if (res.report) {
              this.saveToReport(this.stateReport, res.report.stateMap);
              this.saveToReport(this.managerReport, res.report.managerMap);
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
