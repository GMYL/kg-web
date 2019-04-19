<template>
    <Row class="margin-top-10">
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="知识图谱的词性分布"
                                 :srcdata="natureReport"
                                 divid="report-graphdist-nature-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="知识图谱的节点权重分布"
                                 :srcdata="nodeWeightReport"
                                 divid="report-graphdist-nodeweight-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="知识图谱的边权重分布"
                                 :srcdata="linkWeightReport"
                                 divid="report-graphdist-linkweight-report"
                                 areacolor="#10A6FF"/>
            </div>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <div v-if="showReport" class="line-chart-con">
                <reportAxisGraph graphname="知识图谱的边类型分布"
                                 :srcdata="linkTypeReport"
                                 divid="report-graphdist-linktype-report"
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
        natureReport: [],
        nodeWeightReport: [],
        linkWeightReport: [],
        linkTypeReport: [],
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
            type: 'GRAPHDIST'
          }
        };
        this.$http.get('/system/statistic/info', params).then((res) => {
          if (res) {
            this.natureReport = [];
            this.nodeWeightReport = [];
            this.linkWeightReport = [];
            this.linkTypeReport = [];
            if (res.report) {
              this.saveToReport(this.natureReport, res.report.natureMap);
              this.saveToReport(this.nodeWeightReport, res.report.nodeWeightMap);
              this.saveToReport(this.linkWeightReport, res.report.linkWeightMap);
              this.saveToReport(this.linkTypeReport, res.report.linkTypeMap);
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
