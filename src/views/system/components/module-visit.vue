<template>
    <div style="width:100%;height:100%;" :id="divid"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'moduleVisit',
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
        series: this.visit && this.visit[0] && this.visit[0].moduleVisit ? this.visit[0].moduleVisit.map(item => {
            return {
              vid: item.id,
              name: item.name,
              type: 'line',
              stack: '总量',
              data: this.visit ? this.visit.map(item2 => {
                if (item2.moduleVisit) {
                  let tarBean = item2.moduleVisit.filter(item3 => item3.id === item.id);
                  return tarBean ? tarBean[0].count : 0;
                } else {
                  return 0;
                }
              }) : []
            };
          }
        ) : []
      };
      const serviceRequestCharts = echarts.init(document.getElementById(this.divid));
      serviceRequestCharts.setOption(option);
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize();
      });
    }
  };
</script>