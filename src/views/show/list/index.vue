<template>
    <div>
        <Row>
            <i-col span="25" style="padding-right: 12px;">
               <Card :bordered="false" style="margin-top:10px;" dis-hover>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        添加关键词
                    </p>
                    <Button slot="extra" type="success" shape="circle"  @click="showGraphClick">
                        显示
                    </Button>
                    <Button slot="extra" type="warning" shape="circle" @click="clearPickedWord">
                        清空
                    </Button>
                    <Form :label-width="50">
                        <FormItem label="导入" v-show="showRestoreProgress">
                            <Progress :percent="restoreProgress" status="active"></Progress>
                        </FormItem>
                        <FormItem label="添加词">
                            <i-input v-model="wordinput" style="width: 200px" @on-enter="handleAddWord">
                                <Button slot="append" @click="handleAddWord">
                                    添加
                                </Button>
                            </i-input>
                        </FormItem>
                        <FormItem label="被选词">
                            <Tag v-for="item in wordlist" :key="item" :name="item" type="dot" color="green"
                                 closable
                                 @on-close="handleWordClose">{{ item }}
                            </Tag>
                        </FormItem>
                    </Form>
                </Card>
                <Card :bordered="false" dis-hover>
                    <div class="word-graph-div" :style="graphDivStyle" v-if="showGraph">
                        <word-Graph v-if="showGraph"
                                    :wordlist="wordlist"
                                    :closemodal.sync="showGraph"
                                    :freshGraph.sync="freshGraph"
                                    :picknode.sync="pickNode"
                                    :picklink.sync="pickLink"/>
                    </div>
                </Card>
            </i-col>
            <!-- <i-col span="5" style="padding-right: 12px;"> -->
                <!-- <Card :bordered="false" style="margin-top:10px;" dis-hover>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        显示
                    </p>
                    <Button slot="extra" type="success" shape="circle" @click="showGraphClick">
                        显示
                    </Button>
                    <Button slot="extra" type="warning" shape="circle" @click="clearPickedWord">
                        清空
                    </Button>
                    <Form :label-width="50">
                        <FormItem label="导入" v-show="showRestoreProgress">
                            <Progress :percent="restoreProgress" status="active"></Progress>
                        </FormItem>
                        <FormItem label="添加词">
                            <i-input v-model="wordinput" @on-enter="handleAddWord">
                                <Button slot="append" @click="handleAddWord">
                                    添加
                                </Button>
                            </i-input>
                        </FormItem>
                        <FormItem label="被选词">
                            <Tag v-for="item in wordlist" :key="item" :name="item" type="dot" color="green"
                                 closable
                                 @on-close="handleWordClose">{{ item }}
                            </Tag>
                        </FormItem>
                    </Form>
                </Card> -->
            <!-- </i-col> -->
        </Row>
    </div>
</template>
<script>
  import wordGraph from '../../wizard/components/word-graph';
  // import wordGraph from '../components/word-graph';
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {
      ICol,
      wordGraph
    },
    data() {
      return {
        wordlist: ['F0396', 'S0494','F0519'],
        wordinput: '',
        questioninput: '',
        pickNode: {},
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
        toDeleteLinkNode: '',
        toDeleteLinkNodeList: [],
        showGraph: true,
        freshGraph: 0,
        showWordLinkTable: false,
        showRestoreProgress: false,
        restoreProgress: 0
      };
    },
    methods: {
      clearPickedWord() {
        this.wordlist = [];
      },
      handleAddWord() {
        this.wordlist.push(this.wordinput);
        this.wordinput = '';
      },
      handleWordClose(event, name) {
        const index = this.wordlist.indexOf(name);
        this.wordlist.splice(index, 1);
      },
      showGraphClick() {
        this.freshGraph++;
      },
      submitNodeUpdate() {
        this.$http.post('/wizard/node/update', this.pickNode).then(() => {
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
        this.addNode.type = 'law'
        this.$http.put('/wizard/node', this.addNode).then(() => {
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
        this.$http.delete('/wizard/node/' + this.pickNode.id).then(() => {
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
      deleteAllLinkByNode() {
        // 删除一个节点对应的所有边，但保留这一节点
        this.$http.delete('/wizard/node/deleteAllLinkByNode', {params: {id: this.pickNode.id}}).then(() => {
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
      handleAllRelateLinks() {
        // 处理该节点相关的所有连线
        this.showWordLinkTable = true;
      },
      clearNodeAdd() {
        this.addNode = {
          word: '',
          weight: '',
          nature: ''
        };
      },
      submitLinkUpdate() {
        this.$http.post('/wizard/link/update', this.pickLink).then(() => {
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
      submitLinkAdd() {
        this.$http.put('/wizard/link', this.addLink).then(() => {
          this.$Notice.success({
            title: '新增连线成功',
          });
          this.freshGraph++;
        }, err => {
          this.$Notice.error({
            title: '新增失败',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      deleteLink() {
        this.$http.delete('/wizard/link/' + this.pickLink.id).then(() => {
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
      clearLink() {
        this.addLink = {
          start: '',
          end: '',
          weight: 1.0,
          tip: '',
          type: 'synonym'
        };
      },
      reverseLink() {
        this.$http.get('/wizard/link/reverseLink/' + this.pickLink.id).then((res) => {
          this.$Notice.success({
            title: '转置成功',
            desc: res
          });
          this.pickLink = res;
          this.freshGraph++;
        }, err => {
          this.$Notice.error({
            title: '转置成功',
            desc: err.errMsg ? err.errMsg : err
          });
        });
      },
      clearPickedWordToDelete() {
        this.toDeleteLinkNodeList = [];
      },
      handleAddWordToDelete() {
        this.toDeleteLinkNodeList.push(this.toDeleteLinkNode);
        this.toDeleteLinkNode = '';
      },
      handleWordCloseToDelete(event, name) {
        const index = this.toDeleteLinkNodeList.indexOf(name);
        this.toDeleteLinkNodeList.splice(index, 1);
      },
      deleteAllRelateLinks() {
        this.$http.post('/wizard/link/deleteAllRelateLinks', this.toDeleteLinkNodeList).then(res => {
          this.$Notice.success({
            title: '删除所选的这些节点之间的所有边成功',
            content: res
          });
          this.freshGraph++;
        });
      },
    },
    computed: {
      graphDivStyle: function () {
        console.log(window.innerHeight);
        return {
          height: (window.innerHeight - 120) + 'px'
        };
      }
    },
    watch: {
      showWordLinkTable(newVal, oldVal) {
        if (oldVal && (!newVal)) {
          this.showGraphClick();
        }
      },
      pickNode(newVal, oldVal) {
        this.toDeleteLinkNode = newVal.word;
      }
    },
    created() {
      this.$nextTick(() => {
        this.showGraphClick();
      });
    },
    mounted() {
    }
  };
</script>