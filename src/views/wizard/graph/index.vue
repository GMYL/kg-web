<template>
    <div>
        <Row>
            <i-col span="19" style="padding-right: 12px;">
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
            <i-col span="5" style="padding-right: 12px;">
                <Card :bordered="false" dis-hover>
                    <Tabs value="tabNodeUpdate" size="small">
                        <TabPane label="修改节点" name="tabNodeUpdate">
                            <Form :label-width="50">
                                <FormItem label="编号" v-show="false">
                                    <i-input v-model="pickNode.id" disabled/>
                                </FormItem>
                                <FormItem label="实体">
                                    <i-input v-model="pickNode.word" disabled/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="3" :min="0" :step="0.1" v-model="pickNode.weight"></InputNumber>
                                </FormItem>
                                <FormItem label="属性">
                                    <i-input v-model="pickNode.nature" disabled/>
                                </FormItem>
                                <FormItem label="操作">
                                    <Button type="success" @click="submitNodeUpdate">
                                        提交修改
                                    </Button>
                                    <Button type="error" @click="deleteNode">
                                        删除节点
                                    </Button>
                                    <Button type="error" @click="deleteAllLinkByNode">
                                        删除所有边
                                    </Button>
                                    <Button type="primary" @click="handleAllRelateLinks">
                                        处理连线
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="新建节点" name="tabNodeAdd">
                            <Form :label-width="50">
                                <FormItem label="实体">
                                    <i-input v-model="addNode.word"/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="3" :min="0" :step="0.1" v-model="addNode.weight"></InputNumber>
                                </FormItem>
                                <FormItem label="属性">
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
                        <TabPane label="帮助" name="tabNodeHelp">
                            <Alert>如果对应该名称的节点不要了，请删掉该节点并重建，不要修改这个节点的词名</Alert>
                            <Alert>单词节点的id号和节点名称一致</Alert>
                            <Alert type="success">ncs是税法相关的最特殊节点</Alert>
                        </TabPane>
                    </Tabs>
                </Card>
                <Card :bordered="false" style="margin-top:10px;" dis-hover>
                    <Tabs value="tabLinkUpdate" size="small">
                        <TabPane label="修改连线" name="tabLinkUpdate">
                            <Form :label-width="50">
                                <FormItem label="编号" v-show="false">
                                    <i-input v-model="pickLink.id" disabled/>
                                </FormItem>
                                <FormItem label="起点">
                                    <i-input v-model="pickLink.start" disabled/>
                                </FormItem>
                                <FormItem label="终点">
                                    <i-input v-model="pickLink.end" disabled/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="2" :min="0" :step="0.1" v-model="pickLink.weight"></InputNumber>
                                    <!--<i-input v-model="pickLink.weight"/>-->
                                </FormItem>
                                <FormItem label="关系属性" disabled>
                                    <i-input v-model="pickLink.nature"/>
                                </FormItem>
                                <FormItem label="类型">
                                    <Row>
                                        <i-col span="8">
                                            <i-select v-model="pickLink.type">
                                                <Option value="attribute">属性关系</Option>
                                                <Option value="type">分类关系</Option>
                                                <Option value="item">条款关系</Option>
                                            </i-select>
                                        </i-col>
                                        <i-col span="12" style="margin-left: 5px;">
                                            <RadioGroup v-model="pickLink.type">
                                                <Radio label="attribute"></Radio>
                                                <Radio label="parent"></Radio>
                                                <Radio label="item"></Radio>
                                            </RadioGroup>
                                        </i-col>
                                    </Row>
                                </FormItem>
                                <FormItem label="操作">
                                    <Button type="success" @click="submitLinkUpdate">
                                        提交修改
                                    </Button>
                                    <Button type="error" @click="deleteLink">
                                        删除连线
                                    </Button>
                                    <Button type="primary" @click="reverseLink">
                                        转置连线
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="新建连线" name="tabLinkAdd">
                            <Form :label-width="50">
                                <FormItem label="起点">
                                    <i-input v-model="addLink.start"/>
                                </FormItem>
                                <FormItem label="终点">
                                    <i-input v-model="addLink.end"/>
                                </FormItem>
                                <FormItem label="权重">
                                    <InputNumber :max="2" :min="0" :step="0.1" v-model="addLink.weight"></InputNumber>
                                    <!--<i-input v-model="addLink.weight"/>-->
                                </FormItem>
                                <FormItem label="关系属性">
                                    <i-input v-model="addLink.nature"/>
                                </FormItem>
                                <FormItem label="类型">
                                    <Row>
                                        <i-col span="8">
                                            <i-select v-model="addLink.type">
                                                <Option value="attribute">属性关系</Option>
                                                <Option value="type">分类关系</Option>
                                                <Option value="item">条款关系</Option>
                                            </i-select>
                                        </i-col>
                                        <i-col span="12" style="margin-left: 5px;">
                                            <RadioGroup v-model="addLink.type">
                                                <Radio label="attribute"></Radio>
                                                <Radio label="parent"></Radio>
                                                <Radio label="item"></Radio>
                                            </RadioGroup>
                                        </i-col>
                                    </Row>
                                </FormItem>
                                <FormItem label="操作">
                                    <Button type="success" @click="submitLinkAdd">
                                        新增
                                    </Button>
                                    <Button type="error" @click="clearLink">
                                        清空
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="其它操作" name="otherHandler">
                            <Form :label-width="50">
                                <FormItem label="添加词">
                                    <i-input v-model="toDeleteLinkNode" @on-enter="handleAddWordToDelete">
                                        <Button slot="append" @click="handleAddWordToDelete">
                                            添加
                                        </Button>
                                    </i-input>
                                </FormItem>
                                <FormItem label="被选词">
                                    <Tag v-for="item in toDeleteLinkNodeList" :key="item" :name="item" type="dot"
                                         color="red"
                                         closable
                                         @on-close="handleWordCloseToDelete">{{ item }}
                                    </Tag>
                                </FormItem>
                                <FormItem label="操作">
                                    <Button type="error" @click="deleteAllRelateLinks">
                                        删除这些节点对应的所有边
                                    </Button>
                                    <Button type="warning" @click="clearPickedWordToDelete">
                                        清空
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="帮助" name="tabLinkHelp">
                            <Alert>节点的编号是自动生成的</Alert>
                            <Alert>如果该连线不要了，请删掉该连线，不要修改这个连线的起点和终点</Alert>
                            <Alert type="warning">两个点之间关系目前支持三种</Alert>
                        </TabPane>
                    </Tabs>
                </Card>
                <Card :bordered="false" style="margin-top:10px;" dis-hover>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        显示
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="createFileTxt">
                        导出图中法规关键字
                    </Button>
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
                </Card>
            </i-col>
        </Row>
        <!-- 修改所选节点对应的边 -->
        <Modal v-model="showWordLinkTable" width="800">
            <wordLinkTable :mainnode="pickNode"
                           :closemodal.sync="showWordLinkTable"
                           style="margin-top: 20px;margin-right: 15px;margin-left: 15px;">
            </wordLinkTable>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<script>
  import wordGraph from '../components/word-graph';
  import wordLinkTable from '../components/word-link-table';
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {
      ICol,
      wordGraph,
      wordLinkTable
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
      createFileTxt() {
        if (this.wordlist && this.wordlist.length > 0) {
          this.$http.post('/wizard/node/downFileTxt', this.wordlist).then(res => {
            this.$Notice.success({
              title: '导出法规关键词成功'
            });
          window.open("http://www.aqielu.cn/kg/static/download/laws.txt", '_blank');
          //  window.open(res.data, '_blank');
          });
        }
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