<template>
    <div style="width:100%;height:100%;" :id="divid"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'serviceRequests',
    props: ['visit', 'divid', 'areacolor'],
    mounted() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.visit ? this.visit.map(item => item.id) : []
        }],
        yAxis: [{type: 'value'}],
        series: [{
          name: '服务调用',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {color: this.areacolor}},
          data: this.visit ? this.visit.map(item => item.count) : []
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