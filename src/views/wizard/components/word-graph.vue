<template>
    <!--<p>{{ wordlist }}</p>-->
    <div style="width:100%;height:100%;" id="word_graph_all"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'wordGraph',
    props: ['wordlist', 'closemodal', 'freshGraph', 'picknode', 'picklink'],
    data() {
      return {
        wordGraphShow: {},
        revNodes: {},
        revLinks: {},
        // timer: [],
        // tempLinks: [],
        // tempData: [],
        // switch:false,
        // counter:0,
        option: {
          title: {
            text: '知识图谱',
            textStyle:
              {
                color: 'rgba(0, 0, 0, 0.8)',
                fontSize: 20
              },
          },
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
          // legend: {
          //   left: 'center',
          //   top: 'top',
          //   orient: 'horizontal',
          //   data: tagLegends
          // },
          backgroundColor: 'rgba(196, 196, 196, 0.1)',
          series: [{
            type: 'graph',
            layout: 'force',//力引导布局
            //  layout: 'circular',//环形布局
            animation: false,//是否开启动画。
            roam: true,//整体是否可拖动
            // draggable: true,//节点是否可拖动
            focusNodeAdjacency: true,//关联节点高亮
            symbol: 'circle',
            label: {
              normal: {
                show: true,
                formatter: item => {
                  return item ? item.name + '\n[' + item.data.nature + ']:' + item.value : '';
                },
                textStyle: {
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '12',
                  fontFamily: 'Consolas'
                }
              }
            },
            categories: [],
            force: {//力引导布局
              //initLayout: 'circular',
              edgeLength: 160,
              repulsion: 500,
              layoutAnimation: true,//默认为true因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
              // gravity: -0.05 // 不要引力，全部是斥力，让节点尽可能都相互排斥
            },
            // circular: {//环形布局
            //         rotateLabel: true
            // },
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
          case 'ncs':
            return 'rgba(176,164,227, 0.9)';
          case 'n':
            return 'rgba(158, 208, 72, 0.9)';
          case 'v':
          case 'vn':
            return 'rgba(68, 206, 246, 0.9)';
          case 'a':
            return 'rgba(242, 190, 69, 0.8)';
          default:
            return 'rgba(161, 175, 201, 0.9)';
        }
      },
      handlePick(params) {
        // 判断点击的是点还是连接线
        switch (params.dataType) {
          case 'node':
            if (params.data.srcid) {
              this.$emit('update:picknode', this.revNodes[params.data.srcid]);
            }
            break;
          case 'edge':
            if (params.data.srcid) {
              this.$emit('update:picklink', this.revLinks[params.data.srcid]);
            }
            break;
          default:
            break;
        }
        console.log(params);
      },
      handleExtend(params) {
        // 判断点击的是点还是连接线
        switch (params.dataType) {
          case 'node':
            this.wordlist.push(params.data.name);
            this.$http.get('/wizard/node/getNodeAndLinksById', {
              params: {
                id: params.data.srcid,
                level: 1
              }
            }).then(res => {
              res.data.forEach(word => {
                this.revNodes[word.id] = word;
              });
              res.links.forEach(link => {
                this.revLinks[link.id] = link;
              });
              this.generateGraph();
            });
            break;
          case 'edge':
            break;
          default:
            break;
        }
        console.log(params);
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
      // getElevatorList(){
      //   this.option.series[0].links[this.counter]=this.tempLinks[this.counter]
      //   this.counter=this.counter+1
      //   this.wordGraphShow.setOption(this.option);
      //   console.log(this.counter+"-"+this.tempLinks.length)
      //   console.log(this.timer)
      //   if(this.counter==this.tempLinks.length){

      //     this.timer.forEach((timer) => {clearTimeout(timer)})//关闭定时器
      //     this.timer=[]
      //     this.tempLinks=[];
      //     this.counter=0
      //     this.switch=false
      //   }
      // },
      generateGraph() {
        // 这个方法是只按照当前的点集展示图形
        this.option.series[0].data = [];
        this.option.series[0].links = [];
        let natureMap = {};
        for (let key in this.revNodes) {
          let word = this.revNodes[key];
          natureMap[word.nature ? word.nature : '-'] = '';
          this.option.series[0].data.push({
            srcid: word.id,
            name: word.word,
            value: word.weight,
            nature: word.nature ? word.nature : '-',
            symbolSize: word.weight * 10 + 30,
            category: word.nature ? word.nature : '-'
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
            case 'synonym':
              link.symbol = null;
              link.symbolSize = null;
              link.lineStyle = {
                normal: {
                  color: 'rgba(255,33,33,' + link.weight / 0.6 + ')',
                  opacity: 0.9,
                  width: 2,
                }
              };
              break;
            case 'parent':
              link.symbol = ['circle', 'arrow'];
              link.symbolSize = [3, 13];
              link.lineStyle = {
                normal: {
                  color: 'rgba(23,124,176, ' + link.weight / 0.6 + ')',
                  opacity: 1,
                  width: 2,
                }
              };
              break;
            default:
              break;
          }
          this.option.series[0].links.push({
            srcid: link.id,
            source: link.start,
            target: link.end,
            value: link.weight,
            label: {
              normal: {
                show: true,
                //formatter: '● {c}'
                formatter: '{c}'
              }
            },
            symbol: link.symbol,
            symbolSize: link.symbolSize,
            lineStyle: link.lineStyle
          });
        }
        // console.log("this.revLinks.length")
        // if(this.tempLinks.length<10){
        //   this.option.series[0].links=this.tempLinks;
        //   this.tempLinks=[];
        // }else{
        //    console.log("timer:"+this.timer)
        //    if(!this.switch){
        //       this.switch=true
        //       this.timer.push(setInterval(this.getElevatorList, 1000));
        //       console.log("timer:"+this.timer)
        //    }
        // }
        // // 所有点都需要和中心点建立联系
        // let mainNode = {
        //   name: '中心节点',
        //   value: 1,
        //   // x: 0,
        //   // y: 0,
        //   symbolSize: 0,
        //   // fixed: true,
        //   label: {
        //     normal: {
        //       show: false,
        //     }
        //   }
        // };
        // this.option.series[0].data.forEach(node => {
        //   this.option.series[0].links.push({
        //     source: mainNode.name,
        //     target: node.name,
        //     value: 0,
        //     lineStyle: {
        //       normal: {
        //         opacity: 0.9,
        //         width: 0
        //       }
        //     }
        //   });
        // });
        // this.option.series[0].data.push(mainNode);
        // 最后是展示图形
        console.log(JSON.stringify(this.option));
        console.log(this.option);
        this.wordGraphShow.setOption(this.option);
        window.onresize = this.wordGraphShow.resize;
        // window.addEventListener('resize', function () {
        //   this.wordGraphShow.resize();
        // });
      },
    },
    mounted() {
      this.wordGraphShow = echarts.init(document.getElementById('word_graph_all'));
      this.wordGraphShow.setOption(this.option);
      // 加入单击pick事件
      this.wordGraphShow.on('click', this.handlePick);
      // 加入双击扩展显示事件
      this.wordGraphShow.on('dblclick', this.handleExtend);
      this.showGraph();
    }
//     ,
//     destroyed(){
//       console.log('销毁')

      
//       this.timer.forEach((timer) => {clearTimeout(timer)})//关闭定时器
//       this.timer = []
//       this.tempLinks=[];
//       this.counter=0
//       this.switch=false

//       console.log('销毁成功')
      
//     },
//     beforeDestroy() {
//     if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
//         this.timer.forEach((timer) => {clearTimeout(timer)})//关闭定时器
//     }
// }
  };
</script>
