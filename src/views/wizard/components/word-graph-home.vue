<template>
    <!--<p>{{ wordlist }}</p>-->
    <div style="width:100%;height:100%;" id="word_graph_all"></div>
</template>

<script>
  import echarts from 'echarts';
  import 'echarts-gl';

  export default {
    name: 'wordGraph',
    props: ['wordlist', 'closemodal', 'freshGraph', 'picknode', 'picklink'],
    data() {
      return {
        wordGraphShow: {},
        revNodes: {},
        revLinks: {},
        option: {
          title: {
            text: '知识图谱',
            textStyle:
              {
                color: 'rgba(0, 0, 0, 0.8)',
                fontSize: 20
              },
          },
          tooltip: {
            show : true,   //默认显示
            showContent:true, //是否显示提示框浮层
            trigger:'item',//触发类型，默认数据项触发
            triggerOn:'click',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
            alwaysShowContent:false, //默认离开提示框区域隐藏，true为一直显示
            showDelay:0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
            hideDelay:200,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
            enterable:false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
            position:'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
            confine:false,//是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
            transitionDuration:0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
            formatter: item => {
                  return item ? item.name : '';
                },
            extraCssText:'background:red;white-space:pre-wrap'
            
          },
          // legend: [{
          //   selectedMode: 'single',
          // }],
          legend: {
            data: []
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          backgroundColor: 'rgba(196, 196, 196, 0.1)',
          series: [{
            type: 'graphGL',
            layout: 'forceAtlas2',//力引导布局
            animation: false,//是否开启动画。
            roam: true,//整体是否可拖动
            draggable: true,//节点是否可拖动
            focusNodeAdjacency: false,//关联节点高亮
            hoverAnimation:false,  //是否开启鼠标 hover 节点的提示动画效果。
            symbol: 'circle',
            label: {
              normal: {
                show: true,
                formatter: item => {
                  return item ? item.name.substr(0, 13) : '';
                },
                textStyle: {
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '12',
                  fontFamily: 'Consolas'
                }
              }
            },
            categories: [],//图谱顶部的分类
            forceAtlas2: {
                GPU:false,
                steps: 1,
                stopThreshold: 0,
                jitterTolerence: 10,
                edgeWeight: [0.2, 1],
                gravity: 0,
                edgeWeightInfluence: 1,
                scaling: 100,
                repulsionByDegree:true,
                preventOverlap:true
            },
            data: [],
            links: []
          }]
        }
      };
    },
    watch: {
      wordlist: function (newVal, oldVal) {
        this.showGraph();
      },
      freshGraph: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.showGraph();
        }
      },
    },
    methods: {
      switchColor: (nature) => {
        switch (nature) {
          case '发文日期':
            return 'rgba(176,164,227, 0.9)';
          case '法规编号':
            return 'rgba(158, 208, 72, 0.9)';
          case '所属类别':
            return 'rgba(242, 190, 69, 0.8)';
          case '标题':
            return 'rgba(44, 154, 206, 0.94)';
          case '相关文件':
            return 'rgba(68, 206, 246, 0.9)';
          case '内容':
            return 'rgba(35, 125, 130, 0.9)';
          case '有效性':
            return 'rgba(76, 121, 177, 0.9)';
          case '失效依据':
            return 'rgba(43, 102, 119, 0.9)';
          case '发文号':
            return 'rgba(55, 165, 159, 0.9)';
          default:
            return 'rgba(161, 175, 201, 0.9)';
        }
      },
      switchCategorie: (nature) => {
        switch (nature) {
          case 'date':
            return '发文日期';
          case 'id':
            return '法规编号';
          case 'excelType':
            return '所属类别';
          case 'name':
            return '标题';
          case 'attaches':
            return '相关文件';
          case 'contents':
            return '内容';
          case 'valid':
            return '有效性';
          case 'gist':
            return '失效依据';
          case 'no':
            return '发文号';
          default:
            return '-';
        }
      },
      showGraph() {
        // 这个方法是完全重新加载整张图
        if (this.wordlist && this.wordlist.length > 0) {
          this.$http.post('/wizard/node/getNodeAndLinkByIdList', this.wordlist).then(res => {
            this.$Notice.success({
              title: '从服务器加载分类成功'
            });
            this.revNodes = {};
            this.revLinks = {};
            res.data.forEach(word => {
              this.revNodes[word.word] = word;
            });
            res.links.forEach(link => {
              this.revLinks[link.id] = link;
            });
            this.generateGraph();
          });
        }
      },
      generateGraph() {
        // 这个方法是只按照当前的点集展示图形
        this.option.series[0].data = [];
        this.option.series[0].links = [];
        let natureMap = {};
        for (let key in this.revNodes) {
          let word = this.revNodes[key];
          natureMap[this.switchCategorie(word.nature)] = '';
          this.option.series[0].data.push({
            srcid: word.word,
            name: word.word,
            value: word.weight,
            nature: this.switchCategorie(word.nature),
            symbolSize: word.weight * 10 + 30,
            // category: word.nature ? word.nature : '-',
            category: this.switchCategorie(word.nature),
          });
        }
        for (let key in natureMap) {
          this.option.legend.data.push(key);
          this.option.series[0].categories.push({
            name: key,
            itemStyle: {
              normal: {
                color: this.switchColor(key)
              }
            }
          });
        }
        for (let key in this.revLinks) {
          let link = this.revLinks[key];
          switch (link.type) {
            case 'attribute':
              link.symbol = null;
              link.symbolSize = null;
              link.lineStyle = {
                  color: 'rgba(255,33,33,1)',
                  opacity: 0.9,
                  width: 2,
                  // type:'dotted'  //线的类型可选：'solid' 'dashed' 'dotted'
              };
              break;
            case 'type':
              link.symbol = ['circle', 'arrow'];
              link.symbolSize = [3, 13];
              link.lineStyle = {
                  color: 'rgba(23,124,176, 1)',
                  opacity: 1,
                  width: 2,
              };
              break;
            default:
              break;
          }
          this.option.series[0].links.push({
            srcid: link.id,
            source: link.start,
            target: link.end,
            value: link.nature,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            },
            symbol: link.symbol,
            symbolSize: link.symbolSize,
            lineStyle: link.lineStyle
          });
        }
        this.wordGraphShow.setOption(this.option);
        window.onresize = this.wordGraphShow.resize;
      },
    },
    mounted() {
      this.wordGraphShow = echarts.init(document.getElementById('word_graph_all'));
      this.wordGraphShow.setOption(this.option);
      this.showGraph();
    }
  };
</script>
