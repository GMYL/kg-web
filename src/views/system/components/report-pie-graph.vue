<!-- 数据展示标准饼图 -->
<template>
    <div style="width:100%;height:100%;" :id="divid"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'pieGraphData',
    props: ['graphname', 'srcdata', 'divid', 'areacolor'],
    mounted() {
      const option = {
        title: {
          text: this.graphname,
          backgroundColor: '#fff'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.srcdata ? this.srcdata.map(i => i.name) : [],
        },
        series: [{
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: this.srcdata ? this.srcdata.map(i => {
            return {
              name: i.name,
              value: i.count
            }
          }) : [],
        }]
      };
      const serviceRequestCharts = echarts.init(document.getElementById(this.divid));
      serviceRequestCharts.setOption(option);
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize();
      });
    }
  };
</script>