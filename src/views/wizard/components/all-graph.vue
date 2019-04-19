<template>
    <div style="width:100%;height:100%;">
        <div style="width:100%;height:100%;" id="all_graph_all"></div>
        <Modal v-model="extend.showModal" ok-text="扩展节点" cancel-text="取消" @on-ok="handleExtend">
            <Card :bordered="false" :dis-hover="true">
                <Form :label-width="80">
                    <FormItem label="节点id">
                        <i-input v-model="extend.node.id" readonly/>
                    </FormItem>
                    <FormItem label="节点类型">
                        <i-input v-model="extend.node.type" readonly/>
                    </FormItem>
                    <FormItem label="扩展层数">
                        <i-input v-model="extend.level" readonly/>
                    </FormItem>
                    <FormItem label="扩展类型">
                        <i-select v-model="extend.linkType">
                            <!--<Option v-for="item in linktypes" :value="item" :key="item">{{ item }}</Option>-->
                            <Option value="all">全部（all）</Option>
                            <Option value="synonym">近义词(synonym)</Option>
                            <Option value="parent">父节点(parent)</Option>
                            <Option value="child">子节点(child)</Option>
                            <Option value="w2v">算法-w2v(w2v)</Option>
                        </i-select>
                    </FormItem>
                </Form>
            </Card>
        </Modal>
    </div>
</template>

<script>
  import echarts from 'echarts';
  import util from '@/libs/util';

  export default {
    name: 'allGraph',
    props: ['legend', 'linktypes', 'wordlist', 'closemodal', 'freshGraph', 'picknode', 'revnodes'],
    data() {
      return {
        wordGraphShow: {},
        myRevNodes: {},
        revLinks: {},
        extend: {
          showModal: false,
          linkType: '',
          level: 1,
          node: {
            id: '',
            type: 'unknown',
            name: '',
          }
        },
        option: {
          title: {
            text: '知识图谱',
            textStyle: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontSize: 20
            },
          },
          legend: {
            data: this.legend
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
            type: 'graph',
            layout: 'force',
            roam: true,
            focusNodeAdjacency: true,
            symbol: 'circle',
            label: {
              normal: {
                show: true,
                formatter: item => util.graph.formatterNodeByType(item.data.type, item),
                textStyle: {
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '12',
                  fontFamily: 'Consolas'
                }
              }
            },
            categories: [],
            force: {
              //initLayout: 'circular',
              edgeLength: 160,
              repulsion: 500,
              // gravity: -0.05 // 不要引力，全部是斥力，让节点尽可能都相互排斥
            },
            data: [],
            links: [],
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
      handlePick(params) {
        console.log(params);
        // 判断点击的是点还是连接线
        switch (params.dataType) {
          case 'node':
            if (params.data.srcid) {
              console.log(this.myRevNodes[params.data.id]);
              this.$emit('update:picknode', this.myRevNodes[params.data.id]);
            }
            break;
          case 'edge':
            if (params.data.source) {
              this.$emit('update:picknode', this.myRevNodes[params.data.source]);
            }
            break;
          default:
            break;
        }
      },
      clickExtend(params) {
        this.extend.showModal = true;
        this.extend.node = params.data;
      },
      handleExtend() {
        console.log(this.extend.node.type);
        switch (this.extend.node.type) {
          case 'word':
          case 'law':
            this.wordlist.push(this.extend.node.id);
            this.$http.get('/groot/node/getNodeAndLinksById', {
              params: {
                id: this.extend.node.id,
                linktype: this.extend.linkType,
                level: 1
              }
            }).then(res => {
              for (let nkey in res) {
                let node = res[nkey];
                this.myRevNodes[nkey] = node;
                for (let lkey in node.links) {
                  let link = node.links[lkey];
                  link.source = node.id;
                  link.target = link.to;
                  this.revLinks[node.id + "-" + link.to] = link;
                }
              }
              this.generateGraph();
            });
            break;
          case 'unknown':
            break;
          default:
            break;
        }
      },
      showGraph() {
        // 这个方法是完全重新加载整张图
        if (this.wordlist && this.wordlist.length > 0) {
          this.$http.post('/groot/node/getNodeByList/id-word', this.wordlist).then(res => {
            this.$Notice.success({
              title: '从服务器加载数据成功'
            });
            this.myRevNodes = {};
            this.revLinks = {};
            for (let nkey in res) {
              let node = res[nkey];
              this.myRevNodes[nkey] = node;
              for (let lkey in node.links) {
                let link = node.links[lkey];
                link.source = node.id;
                link.target = link.to;
                this.revLinks[node.id + "-" + link.to] = link;
              }
            }
            this.generateGraph();
          });
        }
      },
      generateGraph() {
        // 重置legend点集
        this.option.legend.data = this.legend;
        this.option.series[0].categories = this.legend.map(l => {
          return {
            name: l,
            itemStyle: {
              normal: {
                color: util.graph.pickNodeColorByType(l)
              }
            }
          };
        });
        // 这个方法是只按照当前的点集展示图形
        this.option.series[0].data = [];
        this.option.series[0].links = [];
        for (let key in this.myRevNodes) {
          let word = this.myRevNodes[key];
          word.srcid = word.id;
          word.name = word.word ? word.word : word.name ? word.name : word.id;
          word.value = word.weight;
          word.symbolSize = word.weight * 10 + 30;
          word.category = word.type ? word.type : 'unknown';
          this.option.series[0].data.push(word);
        }
        for (let key in this.revLinks) {
          let link = this.revLinks[key];
          link.lineStyle = util.graph.pickLinkStyleByType(link.type, link.weight);
          switch (link.type) {
            case 'synonym':
            case 'parent':
              link.symbol = ['circle', 'arrow'];
              link.symbolSize = [3, 13];
              break;
            default:
              link.symbol = null;
              link.symbolSize = null;
              break;
          }
          link.srcid = link.id;
          link.value = link.weight;
          link.label = {
            normal: {
              show: true,
              formatter: item => {
                return Math.round(item.value * 100) / 100;
              }
            }
          };
          this.option.series[0].links.push(link);
        }
        // 同步myRevNodes
        this.$emit('update:revnodes', this.myRevNodes);
        // 最后是展示图形
        this.wordGraphShow.setOption(this.option);
        window.onresize = this.wordGraphShow.resize;
      },
    },
    mounted() {
      this.wordGraphShow = echarts.init(document.getElementById('all_graph_all'));
      this.wordGraphShow.setOption(this.option);
      // 加入单击pick事件
      this.wordGraphShow.on('click', this.handlePick);
      // 加入双击扩展显示事件
      this.wordGraphShow.on('dblclick', this.clickExtend);
    }
  };
</script>
