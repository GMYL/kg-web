<!--系统模块管理-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <Row>
                        <i-col span="6">
                            <Input v-model="filterData.id" style="width: 200px" placeholder="请输入编号"></Input>
                            <!-- <Input v-model="filterData.id" placeholder="请输入待查询的编号"/> -->
                            <Input v-model="filterData.name" style="width: 200px" placeholder="请输入待查询的名称"/>
                        </i-col>
                        <i-col span="6">
                            <Button type="primary" icon="ios-search" @click="freshData">查询</Button>
                        </i-col>
                    </Row>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        权限列表
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <Button slot="extra" type="primary" shape="circle" @click="modal2 = true">
                        <Icon type="plus"></Icon>
                        添加
                    </Button>
                    <div>
                        <Table highlight-row :columns="mainColumns" :data="mainData"></Table>
                        <Page :total="filterData.page.totalSize" @on-change="getPageData"
                              @on-page-size-change="setPageSize" class="pageTool" show-sizer :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                    </div>
                </Card>
            </i-col>
            <!--<i-col span="12" class="padding-left-10">-->
            <!--<Card>-->
            <!--<p slot="title"> 修改 </p>-->
            <!--<Form :model="editmainData" label-position="left" :label-width="100">-->
            <!--<FormItem>-->
            <!--<Button type="error" @click="deleteEditor">删除</Button>-->
            <!--<Button type="warning" @click="updateEditor">修改</Button>-->
            <!--<Button type="success" @click="addEditor">添加</Button>-->
            <!--</FormItem>-->
            <!--<FormItem label="id">-->
            <!--<Input v-model="editmainData.id"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="urls">-->
            <!--<Input v-model="editmainData.urls"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="parent">-->
            <!--<Input v-model="editmainData.parent"></Input>-->
            <!--</FormItem>-->
            <!--</Form>-->
            <!--</Card>-->
            <!--</i-col>-->
            <Modal v-model="modal1" title="修改" @on-ok="updateEditor" width="800">
                <Form :model="editmainData" label-position="left" :label-width="100">
                    <FormItem label="编号">
                        <Input disabled type="text" v-model="editmainData.id"/>
                    </FormItem>
                    <FormItem label="名称">
                        <Input type="text" v-model="editmainData.name"/>
                    </FormItem>
                    <FormItem label="记录访问日志">
                        <i-switch v-model="editmainData.record" size="large">
                            <span slot="open">记录</span>
                            <span slot="close">不记</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="过滤规则">
                        <Row type="flex" justify="center">
                            <i-col span="2">
                                <Input disabled v-model="editTempData._index" placeholder="序号"/>
                            </i-col>
                            <i-col span="4">
                                <Select v-model="editTempData.method">
                                    <Option v-for="item in methodList" :value="item" :key="item">{{ item }}
                                    </Option>
                                </Select>
                            </i-col>
                            <i-col span="12">
                                <Input v-model="editTempData.url" placeholder="url"/>
                            </i-col>
                            <i-col span="2">
                                <Button type="success" @click="addTempToUrl">新增</Button>
                            </i-col>
                            <i-col span="2">
                                <Button type="primary" @click="updateTempToUrl">修改</Button>
                            </i-col>
                        </Row>
                        <Table :columns="editColomn" :data="editmainData.urls" size="small"></Table>
                        <!--<Select v-model="editmainData" style="width:200px">
                            <Option v-for="item in editmainDa" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                   v-model="editmainData.urlLink"></Input>-->
                    </FormItem>
                    <FormItem label="模块说明">
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               v-model="editmainData.feature"/>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Cascader v-model="editmainData.categoryList" :data="categoryData" filterable></Cascader>
                    </FormItem>
                </Form>
            </Modal>
            <Modal v-model="modal2" title="添加" @on-ok="addEditor" width="800">
                <Form :model="editmainData" label-position="left" :label-width="100">
                    <FormItem label="编号">
                        <Input v-model="addData.id"/>
                    </FormItem>
                    <FormItem label="名称">
                        <Input v-model="addData.name"/>
                    </FormItem>
                    <FormItem label="是否记录访问日志">
                        <i-switch v-model="addData.record" size="large">
                            <span slot="open">记录</span>
                            <span slot="close">不记</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="过滤规则">
                        <Row type="flex" justify="center">
                            <i-col span="2">
                                <Input disabled v-model="addTempData._index" placeholder="序号"/>
                            </i-col>
                            <i-col span="4">
                                <Select v-model="addTempData.method">
                                    <Option v-for="item in methodList" :value="item" :key="item">{{ item }}
                                    </Option>
                                </Select>
                            </i-col>
                            <i-col span="12">
                                <Input v-model="addTempData.url" placeholder="url"/>
                            </i-col>
                            <i-col span="2">
                                <Button type="success" @click="addTempToUrlByAdd">新增</Button>
                            </i-col>
                            <i-col span="2">
                                <Button type="primary" @click="updateTempToUrlByAdd">修改</Button>
                            </i-col>
                        </Row>
                        <Table :columns="addColomn" :data="addData.urls" size="small"></Table>
                        <!--<Select v-model="editmainData" style="width:200px">
                            <Option v-for="item in editmainDa" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                   v-model="editmainData.urlLink"></Input>-->
                    </FormItem>
                    <FormItem label="模块说明">
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               v-model="addData.feature"/>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Cascader v-model="addData.categoryList" :data="categoryData" filterable></Cascader>
                    </FormItem>
                </Form>
            </Modal>
            <Modal v-model="modal3" title="删除" @on-ok="deleteEditor">
                <Row type="flex" justify="center" align="middle" class="code-row-bg">
                    <i-col span="4">
                        <Icon type="information-circled" color="red" size="60"></Icon>
                    </i-col>
                    <i-col span="20">
                        <h4>确定要删除
                            <Tag v-text="editmainData.name"></Tag>
                            ?
                        </h4>
                    </i-col>
                </Row>
            </Modal>
        </i-col>
    </Row>
</template>

<script>
  import {formatDate} from '@/libs/filters';

  export default {
    components: {},
    data() {
      return {
        dataName: 'module',
        modal1: false,
        modal2: false,
        modal3: false,
        mainColumns: [{
          title: '编号',
          key: 'id',
          width: 160
        }, {
          title: '名称',
          key: 'name',
          width: 160
        }, {
          title: 'urls',
          key: 'urls',
          render: (h, params) => {
            if (params.row.urls) {
              return params.row.urls.map(item => {
                let itemShowVal = item.method;
                let propcolor = 'default';
                switch (item.method) {
                  case 'ALL':
                    propcolor = 'yellow';
                    break;
                  case 'PUT':
                    propcolor = 'blue';
                    break;
                  case 'GET':
                  case 'POST':
                    propcolor = 'green';
                    break;
                  case 'DELETE':
                    propcolor = 'red';
                    break;
                  default:
                    propcolor = 'green';
                    break;
                }
                return h('p', [h('Tag', {
                  props: {color: propcolor},
                  style: {fontSize: '14px', minWidth: '70px'}
                }, itemShowVal), h('span', {
                  style: {
                    fontSize: '14px',
                    fontFamily: 'Consolas Verdana',
                    marginLeft: '18px'
                  }
                }, item.url)]);
              });
            }
          }
        }, {
          title: '记录',
          key: 'record',
          width: 80,
          render: (h, params) => {
            return params.row.record
              ? h('Tag', {props: {color: 'green'}}, '记录')
              : h('Tag', {props: {color: 'red'}}, '不记');
          }
        }, {
          title: '功能',
          key: 'feature'
        }, {
          title: '操作',
          key: 'acction',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '6px'
                },
                on: {
                  click: () => {
                    this.modal1 = true;
                    this.editmainData = JSON.parse(JSON.stringify(params.row));
                    var tmp = ""
                    console.log("*-*-*-*-*-*-*-*",this.editTempData.category)
                    if (this.editmainData.category != null && this.editmainData.category != ""){
                      this.editmainData.categoryList = []
                      var tmpList = this.editmainData.category.split("-")
                      for(var item in tmpList){
                        if (tmp == "") {
                          tmp += tmpList[item]
                        } else {
                          tmp += "-"
                          tmp += tmpList[item]
                        }
                        
                        this.editmainData.categoryList.push(tmp)
                      }
                      console.log(this.editmainData.categoryList)
                    }
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.modal3 = true;
                    this.editmainData = JSON.parse(JSON.stringify(params.row));
                  }
                }
              }, '删除')
            ]);
          }
        }],
        mainData: [],
        editmainData: {},
        editTempData: {
          method: '',
          url: ''
        },
        methodList: [
          'ALL',
          'PUT',
          'GET',
          'POST',
          'DELETE'
        ],
        editColomn: [{
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: 'method',
          key: 'method',
          width: 100
        }, {
          title: 'url',
          key: 'url'
        }, {
          title: '操作',
          key: 'acction',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '6px'
                },
                on: {
                  click: () => {
                    this.editTempData = JSON.parse(JSON.stringify(params.row));
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editmainData.urls.splice(params.row._index, 1);
                  }
                }
              }, '删除')
            ]);
          }
        }],
        addColomn: [{
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: 'method',
          key: 'method',
          width: 100
        }, {
          title: 'url',
          key: 'url'
        }, {
          title: '操作',
          key: 'acction',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '6px'
                },
                on: {
                  click: () => {
                    this.addTempData = JSON.parse(JSON.stringify(params.row));
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.addData.urls.splice(params.row._index, 1);
                  }
                }
              }, '删除')
            ]);
          }
        }],
        addData: {
          urls: []
        },
        addTempData: {
          method: '',
          url: ''
        },
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          },
           sortKey: 'id',
           asc: true
        },
        searchName: '',
        categoryData: [],
        categoryTmpData:[]
      };
    },
    computed: {},
    methods: {
      getData() {
        this.$http.post('/' + this.$data.dataName + '/query', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            if (val.urls) {
              val.urlLink = JSON.stringify(val.urls);
            }
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      // pickARow (currentRow, oldCurrentRow) {
      //   this.$data.editmainData = currentRow;
      // },
      deleteEditor() {
        this.$http.delete('/' + this.$data.dataName + '/' + this.$data.editmainData.id).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.updateStore();
          this.getData();
        });
      },
      updateEditor() {
        if (this.$data.editmainData.categoryList != null) {
          this.$data.editmainData.category = this.$data.editmainData.categoryList.pop()
        }
        this.$http.post('/' + this.$data.dataName + '/update', this.$data.editmainData).then(() => {
          this.$Notice.success({
            title: '修改成功'
          });
          this.updateStore();
          this.freshData();
        });
      },
      addEditor() {
        if (this.$data.addData.categoryList != null) {
          this.$data.addData.category = this.$data.addData.categoryList.pop()
        }
        console.log("this.$data.addDatathis.$data.addDatathis.$data.addData", this.$data.addData)
        this.$http.put('/' + this.$data.dataName, this.$data.addData).then((res) => {
          if (res) {
            this.$Notice.success({
              title: '添加成功'
            });
            this.addData = {
              record: false,
              urls: []
            };
            this.updateStore();
            this.freshData();
          } else {
            this.$Notice.error({
              title: '添加失败'
            });
          }
        });
      },
      freshData() {
        this.filterData.page.pageNumber = 1;
        this.getData();
      },
      updateStore() {
        //  更新系统模块数据到store
        this.$store.dispatch('init_user_modules');
      },
      addTempToUrl() {
        this.editmainData.urls = this.editmainData.urls ? this.editmainData.urls : [];
        this.editmainData.urls.push(JSON.parse(JSON.stringify(this.editTempData)));
      },
      updateTempToUrl() {
        this.editmainData.urls[this.editTempData._index] = this.editTempData;
      },
      addTempToUrlByAdd() {
        this.addData.urls = this.addData.urls ? this.addData.urls : [];
        this.addData.urls.push(JSON.parse(JSON.stringify(this.addTempData)));
        console.log(this.addData.urls)
      },
      updateTempToUrlByAdd() {
        this.addData.urls[this.addTempData._index] = this.addTempData;
      },
      searchClick() {
        this.$http.get('/' + this.$data.dataName + '/get/' + this.$data.searchName).then((res) => {
          if (res) {
            this.$Notice.success({
              title: '查询成功'
            });
            this.$data.editmainData = res;
          } else {
            this.$Notice.error({
              title: '查询失败'
            });
          }
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
      getCategoryData() {
        this.$http.get('/modulecategory/queryAll').then((res) => {
          if (res) {
            this.$Notice.success({
              title: '查询成功'
            });
            this.categoryTmpData = res;
            this.categoryData = this.initCategoryData('root');
          } else {
            this.$Notice.error({
              title: '查询失败'
            });
          }
        });
      },
      initCategoryData(parent) {
        var tmpListName = []
        for (var i = 0; i < this.categoryTmpData.length; i++){
          if (this.categoryTmpData[i].parent == parent){
            var item = {
              value: this.categoryTmpData[i].id,
              label: this.categoryTmpData[i].id.split("-")[this.categoryTmpData[i].id.split("-").length - 1],
              children: this.initCategoryData(this.categoryTmpData[i].id)
            }
            tmpListName.push(item)
          }
        }
        return tmpListName;
      },

    },
    created() {
    },
    mounted() {
      this.getData();
      this.getCategoryData();
    }
  };
</script>

<style lang="less" scoped>
</style>
