<template>
    <div>
        <Row>
            <i-col span="19" style="padding-right: 12px;">
                <Card :bordered="false" dis-hover>
                    <div class="word-graph-div" :style="graphDivStyle" v-if="showGraph">
                        <all-Graph v-if="showGraph"
                                   :legend="graphLegend"
                                   :linktypes="graphlinktypes"
                                   :wordlist="wordlist"
                                   :closemodal.sync="showGraph"
                                   :freshGraph.sync="freshGraph"
                                   :picknode.sync="pickNode"
                                   :revnodes.sync="revNodes"
                        />
                    </div>
                </Card>
            </i-col>
            <i-col span="5" style="padding-right: 12px;">
                <Card :bordered="false" dis-hover>
                    <Tabs value="tabNodeUpdate" size="small">
                        <TabPane label="修改节点" name="tabNodeUpdate">
                            <Form :label-width="40">
                                <FormItem label="编号">
                                    <i-input v-model="pickNode.id" readonly/>
                                </FormItem>
                                <FormItem label="类型">
                                    <i-input v-model="pickNode.type" readonly/>
                                </FormItem>
                                <FormItem label="词名" v-if="pickNode.type==='word'">
                                    <i-input v-model="pickNode.word"/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="3" :min="0" :step="0.1" v-model="pickNode.weight"></InputNumber>
                                </FormItem>
                                <!--<FormItem label="边">
                                    <Table :border="true"
                                           size="small"
                                           :columns="linkTableColumns"
                                           :data="pickNode.links"></Table>
                                </FormItem>-->
                                <FormItem label="操作">
                                    <Button type="success" @click="submitNodeUpdate">
                                        提交修改
                                    </Button>
                                    <Button type="error" @click="deleteNode">
                                        删除节点
                                    </Button>
                                </FormItem>
                            </Form>
                            <Table :border="true"
                                   size="small"
                                   :columns="linkTableColumns"
                                   :data="pickNode.links"></Table>
                        </TabPane>
                        <TabPane label="新建节点" name="tabNodeAdd">
                            <Form :label-width="50">
                                <FormItem label="节点号">
                                    <i-input v-model="addNode.id"/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="3" :min="0" :step="0.1" v-model="addNode.weight"></InputNumber>
                                    <!--<i-input v-model="addNode.weight"/>-->
                                </FormItem>
                                <FormItem label="词性">
                                    <i-input v-model="addNode.nature"/>
                                </FormItem>
                                <FormItem label="操作">
                                    <Button type="success" @click="submitNodeAdd">
                                        新增
                                    </Button>
                                    <Button type="warning" @click="clearNodeAdd">
                                        清空
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Card>
                <Card :bordered="false" style="margin-top:10px;" dis-hover>
                    <Tabs value="tabOps" size="small">
                        <TabPane label="被选节点" name="tabOpsPicked">
                            <Form :label-width="50">
                                <FormItem label="添加词">
                                    <i-input v-model="wordinput" @on-enter="handleAddWord">
                                        <Button slot="append" @click="handleAddWord">
                                            添加
                                        </Button>
                                    </i-input>
                                </FormItem>
                                <FormItem label="被选词">
                                    <Tag v-for="item in wordlist"
                                         :key="item"
                                         :name="item"
                                         type="dot"
                                         color="green"
                                         closable
                                         @on-close="handleWordClose">{{ item }}
                                    </Tag>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="操作" name="tabOpsButton">
                            <Button type="primary" @click="showGrootStats=true">
                                显示缓存状态
                            </Button>
                        </TabPane>
                    </Tabs>
                </Card>
            </i-col>
        </Row>
        <Modal v-model="editLinkModal" :mask-closable="false" @on-ok="submitLinkUpdate">
            <Form :label-width="50">
                <FormItem label="起点">
                    <i-input v-model="editLink.source">
                        <span slot="append">{{ revNodes[editLink.source]?revNodes[editLink.source].name:"未知" }}</span>
                    </i-input>
                </FormItem>
                <FormItem label="终点">
                    <i-input v-model="editLink.to">
                        <span slot="append">{{ revNodes[editLink.to]?revNodes[editLink.to].name:"未知" }}</span>
                    </i-input>
                </FormItem>
                <FormItem label="权重">
                    <InputNumber :max="3" :min="0" :step="0.1" v-model="editLink.weight"></InputNumber>
                </FormItem>
                <FormItem label="类型">
                    <i-select v-model="editLink.type">
                        <Option v-for="item in graphlinktypes" :value="item" :key="item">{{ item }}</Option>
                    </i-select>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showGrootStats" :mask-closable="false" id="grootStatsModal">
            <grootStats :closemodal.sync="showGrootStats"/>
        </Modal>
    </div>
</template>
<script>
  import allGraph from '../components/all-graph';
  import grootStats from '../components/groot-stats';
  import ICol from "iview/src/components/grid/col";
  import {mapGetters} from 'vuex';

  export default {
    components: {
      ICol,
      allGraph,
      grootStats
    },
    data() {
      return {
        wordlist: ['税法'],
        wordinput: '',
        pickNode: {},
        revNodes: {},
        linkTableColumns: [{
          title: '终点',
          key: 'to',
          render: (h, params) => {
            return this.revNodes && this.revNodes[params.row.to]
              ? this.revNodes[params.row.to].name
              : h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.wordlist.push(params.row.to);
                    }
                  }
                },
                params.row.to
              );
          }
        }, {
          title: '权重',
          key: 'weight',
          render: (h, params) => {
            return (params.row.weight + "").substr(0, 5);
          }
        }, {
          title: '类型',
          key: 'type',
          editable: true
        }, {
          title: "操作",
          key: "action",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "warning",
                  size: "small",
                }, style: {
                  marginRight: '1px'
                }, on: {
                  click: () => {
                    this.editLink = params.row;
                    this.editLinkModal = true;
                  }
                }
              }, "修改"),
              h("Button", {
                props: {
                  type: "error",
                  size: "small",
                }, style: {
                  marginRight: '1px'
                }, on: {
                  click: () => {
                    let postBean = {
                      source: params.row.source,
                      to: params.row.to,
                      updateType: "delete-link"
                    };
                    this.$http.post('/groot/node/update', postBean).then(() => {
                      this.$Notice.success({
                        title: '修改成功',
                      });
                      this.freshGraph++;
                      this.pickNode = {};
                    }, err => {
                      this.$Notice.error({
                        title: '修改失败',
                        desc: err.errMsg ? err.errMsg : err
                      });
                    });
                  }
                }
              }, "删除")]);
          }
        }],
        pickLink: {
          start: '',
          end: ''
        },
        addNode: {
          word: '',
          weight: 1.0,
          nature: ''
        },
        addLink: {
          start: '',
          end: '',
          weight: 0.3,
          tip: '',
          type: 'synonym'
        },
        showGraph: true,
        editLinkModal: false,
        editLink: {},
        freshGraph: 0,
        graphLegend: this.myenums && this.myenums['HBGrootNodeType'],
        graphlinktypes: this.myenums && this.myenums['HBGrootLinkType'],
        showGrootStats: false
      };
    },
    methods: {
      handleAddWord() {
        this.wordlist.push(this.wordinput);
        this.wordinput = '';
      },
      showGraphClick() {
        this.freshGraph++;
      },
      submitNodeUpdate() {
        this.$http.post('/groot/node/update', this.pickNode).then(() => {
          this.$Notice.success({
            title: '修改成功',
          });
          this.freshGraph++;
        }, err => {
          this.$Notice.error({
            title: '修改失败',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      submitNodeAdd() {
        this.$http.put('/groot/node', this.addNode).then(() => {
          this.$Notice.success({
            title: '新增节点成功',
          });
          this.wordlist.push(this.addNode.word);
          this.freshGraph++;
        }, err => {
          this.$Notice.error({
            title: '新增失败',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      deleteNode() {
        this.$http.delete('/groot/node/' + this.pickNode.id).then(() => {
          this.$Notice.success({
            title: '删除成功',
          });
          this.freshGraph++;
        }, err => {
          this.$Notice.error({
            title: '删除失败',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      clearNodeAdd() {
        this.addNode = {
          word: '',
          weight: '',
          nature: ''
        };
      },
      submitLinkUpdate() {
        let postBean = {
          source: this.editLink.source,
          to: this.editLink.to,
          weight: this.editLink.weight,
          type: this.editLink.type,
          updateType: "update-link"
        };
        this.$http.post('/groot/node/update', postBean).then(() => {
          this.$Notice.success({
            title: '修改成功',
          });
          this.freshGraph++;
          this.pickNode = {};
        }, err => {
          this.$Notice.error({
            title: '修改失败',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      clearLink() {
        this.addLink = {
          start: '',
          end: '',
          weight: 1.0,
          tip: '',
          type: 'synonym'
        };
      },
      handleWordClose(event, name) {
        const index = this.wordlist.indexOf(name);
        this.wordlist.splice(index, 1);
      },
    },
    computed: {
      graphDivStyle: function () {
        return {
          height: (window.innerHeight - 120) + 'px'
        };
      },
      ...mapGetters(["myenums"])
    },
    watch: {
      showWordLinkTable(newVal, oldVal) {
        if (oldVal && (!newVal)) {
          this.showGraphClick();
        }
      },
    },
    created() {
      // 加载节点的类型种类
      this.$store.dispatch('get_myenum_modules', 'HBGrootLinkType').then(res0 => {
        this.graphlinktypes = res0 && res0['data'].map(e => e.toLowerCase());
        this.$store.dispatch('get_myenum_modules', 'HBGrootNodeType').then(res => {
          this.graphLegend = res && res['data'].map(e => e.toLowerCase());
          this.freshGraph++; // WARN 注意图的显示只能有一个触发点，就是这里，从这里触发图刷新
        });
      });
    },
    mounted() {
    }
  };
</script>
<style lang="less">
    .ivu-form .ivu-form-item-label {
        //padding: 5px 12px 5px 0;
    }

    .ivu-form-item {
        margin-bottom: 12px;
    }

    .ivu-table {
        font-size: 12px;
    }

    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }

    .ivu-btn-small {
        padding: 2px 2px;
    }
</style>