<!-- 数据展示标准折线图 -->
<template>
    <div style="width:100%;height:100%;" :id="divid"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'axisGraphData',
    props: ['graphname', 'srcdata', 'divid', 'areacolor'],
    mounted() {
      const option = {
        title: {
          text: this.graphname,
          backgroundColor: '#fff'
        },
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
          data: this.srcdata ? this.srcdata.map(item => item.id) : []
        }],
        yAxis: [{type: 'value'}],
        series: [{
          type: 'line',
          data: this.srcdata ? this.srcdata.map(item => item.count) : [],
          markPoint: {
            data: [
              {type: 'max', name: '最大值'}
            ]
          },
          markLine: {
            data: [
              [{type: 'average', name: '平均值'}, {
                type: 'average', name: '平均值', x: '90%', label: {
                  normal: {
                    position: 'end',
                    formatter: '{b} : {c}'
                  }
                },
              }]
            ]
          }
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