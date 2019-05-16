<!--扩展词管理-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <Card>
                <Row slot="title">
                    <i-col span="2" style="height: 24px; padding-top: 10px;">
                        <Icon type="navicon-round"></Icon>
                        扩展词典
                    </i-col>
                    <i-col span="10">
                        <!-- <Select v-model="filterData.excelType" @on-change="freshData" style="width:220px" clearable
                                placeholder="请选择">
                            <Option value="问答">问答</Option>
                            <Option value="法规">法规</Option>
                            <Option value="文章">文章</Option>
                        </Select> -->
                        <Input type="text" v-model="filterData.word" style="width: 250px" @on-enter="freshData"
                               clearable placeholder="请输入扩展词"/>
                        <Button type="info" icon="ios-search" @click="freshData"></Button>
                    </i-col>
                </Row>
                <Button slot="extra" type="success" shape="circle" @click="modal2 = true">
                    <Icon type="plus"></Icon>
                    添加
                </Button>
                <!-- <Button slot="extra" type="success" shape="circle" @click="createTodayBackup">
                    <Icon type="ios-loop-strong"></Icon>
                    更新服务器扩展词典
                </Button>
                <Button slot="extra" type="success" shape="circle" @click="updateWeightDictory">
                    <Icon type="ios-loop-strong"></Icon>
                    更新智能问答权重词典
                </Button> -->
                <Button slot="extra" type="primary" shape="circle" @click="freshData">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </Button>
                <div style="padding-bottom: 200px;">
                    <Table highlight-row border ref="selection" :columns="mainColumns" :data="mainData"
                           @on-selection-change="selectAry" ellipsis ></Table>
                    <br/>
                    <Page v-show="filterData.page.totalSize > 10" :total="filterData.page.totalSize"
                          @on-change="getPageData"
                          @on-page-size-change="setPageSize" :current="filterData.page.pageNumber" class="pageTool"
                          show-sizer :page-size="20" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                </div>
                <Modal v-model="modal1" title="扩展词典详情">
                    <!-- <p v-show="dataDetal.excelType">
                        <Tag class="fooo">类型</Tag>
                        <span v-text="dataDetal.excelType"></span></p> -->
                    <p v-show="dataDetal.word">
                        <Tag class="fooo">扩展词</Tag>
                        <span v-text="dataDetal.word"></span></p>
                    <p v-show="dataDetal.weight">
                        <Tag class="fooo">权重</Tag>
                        <span v-text="dataDetal.weight"></span></p>
                    <p v-show="dataDetal.synonyms">
                        <Tag class="fooo">近义词</Tag>
                        <span v-text="dataDetal.synonyms"></span></p>
                    <p v-show="dataDetal.createTime">
                        <Tag class="fooo">创建时间</Tag>
                        <span v-text="dataDetal.dateTime"></span></p>
                    <p v-show="dataDetal.updateTime">
                        <Tag class="fooo">修改时间</Tag>
                        <span v-text="dataDetal.dateUpdateTime"></span></p>
                </Modal>
                <Modal v-model="modal2" title="添加" @on-ok="addData">
                    <Form :model="addItemData" label-position="left" :label-width="100">
                        <FormItem label="(必填) 扩展词">
                            <Input v-model="addItemData.word" placeholder="填写扩展词"/>
                        </FormItem>
                        <FormItem label="(必填) 权重">
                            <Input v-model="addItemData.weight" placeholder="填写权重"/>
                        </FormItem>
                        <FormItem label="词性">
                            <Input v-model="addItemData.nature" placeholder="词性"/>
                        </FormItem>
                        <!-- <FormItem label="类型">
                            <Select v-model="addItemData.excelType" style="width:220px" clearable placeholder="请选择">
                                <Option value="问答">问答</Option>
                                <Option value="法规">法规</Option>
                                <Option value="文章">文章</Option>
                            </Select>
                        </FormItem> -->
                        <!-- <h1>
                          想要增加问答词信息。<br>
                          1.进入知识图谱。<br>2.增加相关词信息。<br>3.知识图谱页面更新问答库
                        </h1> -->
                    </Form>
                </Modal>
                <Modal v-model="modal3" title="修改" @on-ok="updateEditor">
                    <Form :model="editmainData" label-position="left" :label-width="100">
                        <FormItem label="(必填) 扩展词">
                            <Input disabled v-model="editmainData.word" placeholder="填写扩展词"/>
                        </FormItem>
                        <FormItem label="(必填) 权重">
                            <Input disabled v-model="editmainData.weight" placeholder="填写权重"/>
                        </FormItem>
                        <FormItem label="词性">
                            <Input disabled v-model="addItemData.nature" placeholder="词性"/>
                        </FormItem>
                        <!-- <FormItem label="类型">
                            <Select v-model="editmainData.excelType" style="width:220px" clearable placeholder="请选择">
                                <Option value="问答">问答</Option>
                                <Option value="法规">法规</Option>
                                <Option value="文章">文章</Option>
                            </Select>
                        </FormItem> -->
                        <!-- <h1>
                          想要修改问答词信息。<br>
                          1.进入知识图谱。<br>2.修改相关词信息。<br>3.知识图谱页面更新问答库
                        </h1> -->
                    </Form>
                </Modal>
                <Modal v-model="modal4" title="按照分类删除" @on-ok="delData">
                    <Form :model="delItemData" label-position="left" :label-width="100">
                        <FormItem label="类型">
                            <Select v-model="delItemData.excelType" style="width:220px" clearable placeholder="请选择">
                                <Option value="问答">问答</Option>
                                <Option value="法规">法规</Option>
                                <Option value="文章">文章</Option>
                            </Select>
                            <br>
                            <br>
                            <p style="color:red; width:220px;">选择分类后点击确定会将此分类下的所有关键词都会删除！</p>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal v-model="deleteConfirm" title="提示" @on-ok="deleteOk" @on-cancel="cancelDelete">
                    <p>是否确认删除
                        <Tag>{{editmainData.word}}</Tag>
                        ？
                    </p>
                    <!-- <h1>
                          想要删除问答词信息。<br>
                          1.进入知识图谱。<br>2.删除相关词信息。<br>3.知识图谱页面更新问答库
                    </h1> -->
                </Modal>
            </Card>
        </i-col>
    </Row>
</template>

<script>
  import {formatDate, formatFullDate} from '@/libs/filters';
  import ICol from 'iview/src/components/grid/col';
  // import {mapGetters} from 'vuex';

  export default {
    components: {ICol},
    data() {
      return {
        mainColumns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 100
        }, {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 200,
          render: (h, params) => {
            if (params.row.createTime) {
              return formatFullDate(params.row.createTime);
            }
          }
        }, {
          title: '扩展词',
          key: 'word',
          align: 'center'
        }, {
          title: '近义词',
          key: 'synonyms',
          render: (h, params) => {
            if (params.row && params.row.synonyms) {
              let synonmList = [];
              for (let synonym in params.row.synonyms) {
                synonmList.push(synonym + ":" + params.row.synonyms[synonym]);
              }
              return h('div', synonmList.map(item => {
                return h('Tag', {
                  style: {
                    marginRight: '2px'
                  }
                }, item);
              }));
            }
          }
        }, {
          title: '词性',
          key: 'nature',
          align: 'center'
        }, {
          title: '权重',
          key: 'weight',
          align: 'center',
          width: 120
        }, {
          title: '出现次数',
          key: 'occurNum',
          align: 'center',
          width: 120
        }, 
        // {
        //   title: '类型',
        //   key: 'excelType',
        //   align: 'center',
        //   width: 80
        // }, 
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  shape: 'circle'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.views(params.row);
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  shape: 'circle'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.changeTab(params.row);
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  shape: 'circle'
                },
                style: {
                  marginRight: '5px'
                },
                // on: {
                //   click: () => {
                //     this.deleteEditor(params.row);
                //   }
                // }
                on: {
                  click: () => {
                    this.deleteConfirm = true;
                    this.deleteParems = params.row.id;
                    this.$data.editmainData = params.row;
                  }
                }
              }, '删除')
            ]);
          }
        }],
        mainData: [],
        dataDetal: {}, //  定义单条数据
        addItemData: {
          age: ''
        }, //  定义添加数据
        delItemData: {}, //  定义按照类型删除数据
        editmainData: {}, //  定义修改数据
        modal1: false, //  定义model
        modal2: false, //  定义mode2
        modal3: false, //  定义mode3
        modal4: false, //  定义mode4
        deleteConfirm: false,//定义确认删除模板
        expertIdAry: [], //  定义选中id数组
        age: '',
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 10,
            pageSize: 10
          },
          sortKey: 'updateTime',
          asc: false
        }
      };
    },
    computed: {},
    methods: {
      getData() {
        this.$http.post('/dict/query', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.pageSize = res.pageSize;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      handleSelectAll(status) {
        //  全选
        this.$refs.selection.selectAll(status);
      },
      deleteEditor(rowData) {
        this.$http.delete('/dict/' + rowData.id).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.getData();
        });
      },
      delSum() {
        //  批量删除
        this.$http.delete('/dict/all', {data: this.expertIdAry}).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.getData();
        });
      },
      updateEditor() {
        // this.$http.post('/dict/update', this.$data.editmainData).then(() => {
          this.$Notice.success({
            title: '无效修改'
          });
        // });
      },
      addData() {
        let obj = this.$data.addItemData;
        // this.$http.put('/dict', obj).then(() => {
          this.$Notice.success({
            title: '无效添加'
          });
          //  成功后数据置为空
          this.addItemData = {};
          // this.getData();
        // });
      },
      delData() {
        let obj = this.$data.delItemData;
        this.$http.delete('/dict/deltype/' + obj.excelType).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          //  成功后数据置为空
          this.delItemData = {};
          this.getData();
        });
      },
      views(data) {
        this.modal1 = true;
        data.regDate = formatDate(data.regDate);
        this.dataDetal = data;
      },
      freshData() {
        this.filterData.page.pageNumber = 1;
        this.getData();
      },
      deleteOk() {
        // this.$http.delete('/dict/' + this.deleteParems).then(() => {
          this.$Notice.success({
            title: '无效删除',
          });
          // this.freshData();
        // });
      },
      cancelDelete() {
        this.deleteConfirm = false;
      },
      searchClick() {
        let obj = this.$data.filterData;
        this.$http.get("/dict/query/" + obj).then((res) => {
          this.mainData = res.list.map((val) => {
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.pageSize = res.pageSize;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      getPageData(val) {
        this.$data.filterData.page.pageNumber = val;
        this.getData();
      },
      setPageSize(val) {
        this.$data.filterData.page.pageSize = val;
        this.getData();
      },
      changeTab(rowData) {
        this.modal3 = true;
        this.$data.editmainData = rowData;
      },
      selectAry(selection) {
        this.expertIdAry = selection.map(val => {
          return val.id;
        });
      },
      changeValue(val, a) {
        if (val != "" && a != "" && a == 2) {
          if (isNaN(parseInt(val))) {
            return this.editmainData.age = "";
          } else {
            return this.editmainData.age = parseInt(val);
          }
        } else if (val != "" && a != "" && a == 1) {
          if (isNaN(parseInt(val))) {
            return this.addItemData.age = "";
          } else {
            return this.addItemData.age = parseInt(val);
          }
        }
      },
      views(data) {
        this.modal1 = true;
        this.dataDetal = data;
        this.dataDetal.dateTime = formatFullDate(this.dataDetal.createTime);
        this.dataDetal.dateUpdateTime = formatFullDate(this.dataDetal.updateTime);
      },
      createTodayBackup() {
        this.$Modal.confirm({
          title: "请确认更新词典以及所有",
          content: "生成过程大概需要30秒左右，生成完毕后会有提示，过程中请不要再次点击，确认生成请点击确认",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.get('/dict/upesqa').then(res => {
              this.$Message.success('生成完毕' + res);
              this.getData();
            });
          },
          onCancel: () => {
            this.$Modal.remove();
          }
        });
      },
      updateWeightDictory() {
        this.$Modal.confirm({
          title: "请确认更新智能问答的权重词词典",
          content: "生成过程大概需要30秒左右，生成完毕后会有提示，过程中请不要再次点击，确认生成请点击确认",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.get('/dict/refreshDictionary').then(res => {
              this.$Message.success('生成完毕' + res);
              this.getData();
            });
          },
          onCancel: () => {
            this.$Modal.remove();
          }
        });
      }
    },

    created() {

    },
    mounted() {
      this.getData();
    }
  };
</script>

<style lang="less">
    .fooo {
        font-size: 14px;
        width: 80px;
    }
</style>
