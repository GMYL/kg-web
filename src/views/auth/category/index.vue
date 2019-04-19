<!--文章分类管理-->
<template>
    <Row>
        <Card :bordered="false" :dis-hover="true">
            <Tabs type="card" style="background: #fff;">
                <TabPane label="分类树状图" value="treePanel">
                    <i-col span="14">
                        <Card :bordered="false" :dis-hover="true" class="card-tree">
                            <p slot="title">
                                <Icon type="navicon-round"></Icon>
                                功能模块分类
                            </p>
                            <Button slot="extra" type="primary" shape="circle" @click="freshData">
                                <Icon type="ios-loop-strong"></Icon>
                                刷新
                            </Button>
                            <div class="classification-con">
                                <div>
                                    <Button type="info" @click="modal1 = true, categoryObj.parent = 'root'">添加第一级分类
                                    </Button>
                                    <br/><br/>
                                </div>
                                <Tree :data="authCategory" @on-select-change="selectTreeCatagory"
                                      :render="renderContent"></Tree>
                            </div>
                        </Card>
                    </i-col>
                    <i-col span="1">
                        <p style="height:2rem"></p>
                    </i-col>
                    <i-col span="8">
                        <Card :bordered="false" :dis-hover="true" class="card-tree">
                            <p style="text-align:center;font-size:1.3rem;">功能模块管理说明：</p>
                            <p style="padding-left:1.5rem">1、此版块目前大分类包括：后台、用户、软件服务。支持大分类增加、删除；</p>
                            <p style="padding-left:1.5rem">
                                2、“分类父类”不可修改或删除。“分类名称”下填的名称就是我们平时的称呼，如后台或用户，且不可修改，如果不正确可以随时删除重新添加；</p>
                            <p style="padding-left:1.5rem">3、此版块分类有排序要求，其排序按照添加的顺序从上至下排列。</p>
                        </Card>
                    </i-col>
                    <Modal v-model="modal1" title="添加" @on-ok="addNewCategory">
                        <Form :model="categoryObj" label-position="left" :label-width="100">
                            <FormItem label="分类父类">
                                <Input v-model="categoryObj.parent" placeholder="顶级分类请写root" readonly/>
                            </FormItem>
                            <FormItem label="分类名称">
                                <Input v-model="categoryObj.id" placeholder="例如：文章管理"/>
                            </FormItem>
                            注：如果父类为root分类填写格式为：后台文章管理 <br> 分类名称中不得出现标点字符
                        </Form>
                    </Modal>
                    <Modal type="error" v-model="modal3" title="删除" @on-ok="deleteNewCategory">
                        <div style="font-size: 16px;">
                            <Icon type="information-circled" size="30" color="#f60"></Icon>
                            确定要删除
                            <Tag>{{categoryObj.id}}</Tag>
                            分类么？
                        </div>
                    </Modal>
                </TabPane>
                <TabPane label="分类表格展示" value="tablePanel">
                    <Card :bordered="false" :dis-hover="true">
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            分类列表
                        </p>
                        <!--<Button slot="extra" type="success" shape="circle" @click="modal2 = true">-->
                        <!--<Icon type="plus"></Icon>-->
                        <!--添加-->
                        <!--</Button>-->
                        <Button slot="extra" type="primary" shape="circle" @click="getTableData">
                            <Icon type="ios-loop-strong"></Icon>
                            刷新
                        </Button>
                        <div class="pageTool">
                            <Page slot="extra" :total="filterData.page.totalSize" show-sizer @on-change="getPageData"
                                  @on-page-size-change="setPageSize"></Page>
                        </div>
                        <Table :columns="formHeader" :data="tableDatas"></Table>
                    </Card>
                </TabPane>
            </Tabs>
        </Card>
    </Row>
</template>

<script>
  export default {
    data() {
      return {
        dataName: 'authcategory',
        newCategory: this.generateBlankTag(),
        modelShowUpdate: false,
        modal1: false,
        modal2: false,
        modal3: false,
        categoryObj: {
          id: '',
          parent: ''
        },
        // 下面是表格用到的
        tableDatas: [],
        formHeader: [{
          title: '标签名',
          key: 'id'
        }, {
          title: '父标签',
          key: 'parent'
        }, {
          title: '操作',
          key: 'action',
          width: 180,
          render: (h, params) => {
            return h('div', [
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
                    this.modal1 = true;
                    this.categoryObj.id = '';
                    this.categoryObj.parent = params.row.id;
                  }
                }
              }, '添加子类'),
              h('Button', {
                props: {
                  type: 'error',
                  shape: 'circle',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.modal3 = true;
                    this.categoryObj = params.row.id;
                  }
                }
              }, '删除')
            ]);
          }
        }],
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          }
        },
      };
    },
    computed: {
      authCategory() {
        let rootNode = this.$store.getters.authCategoryRoot;
        if (rootNode && rootNode.children) {
          return JSON.parse(JSON.stringify(rootNode.children));
        } else {
          return [];
        }
      }
    },
    methods: {
      generateBlankTag() {
        return {
          id: '',
          title: '',
          parent: '',
          expand: true
        };
      },
      freshData() {
        this.$store.dispatch('get_auth_category');
        this.getTableData();
      },
      selectTreeCatagory(item) {
        console.log(item);
        if (item[0]) {
          this.$data.newCategory = item[0];
        }
      },
      addNewCategory() {
        this.categoryObj.id = this.categoryObj.id.replace(/#/g, "").replace(/_/g, "").replace(/-/g, "")
        this.$http.put('/modulecategory', this.categoryObj).then(() => {
          this.$Notice.success({
            title: '添加分类成功'
          });
          this.freshData();
        });
      },
      deleteNewCategory() {
        console.log(this.categoryObj)
        this.$http.delete('/modulecategory/' + this.categoryObj.id).then(() => {
          this.$Notice.success({
            title: '删除分类成功'
          });
          this.freshData();
        });
      },
      renderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '94%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', {
              style: {
                fontSize: '14px',
                color: '#666'
              }
            }, data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '12px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-plus-empty',
                size: 'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.modal1 = true;
                  this.categoryObj.id = '';
                  this.categoryObj.parent = data.id;
                }
              }
            }, '添加子类'),
            (!data.hasOwnProperty("children") || data.children.length == 0) && h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty',
                size: 'small'
              }),
              on: {
                click: () => {
                  this.modal3 = true;
                  this.categoryObj.id = data.id;
                }
              }
            }, '删除')
          ])
        ]);
      },
      // 这个是分界线，下面的方法都是树状图用的，上面是表格用到的
      getTableData() {
        this.$http.post('/modulecategory/query', this.filterData).then(res => {
          console.log("===========", res)
          this.tableDatas = res && res.list ? res.list : [];
          this.filterData.page.totalPage = res.totalPage;
          this.filterData.page.totalSize = res.totalSize;
          this.$Notice.success({
            title: '从服务器加载分类成功'
          });
        });
      },
      getPageData(val) {
        this.filterData.page.pageNumber = val;
        this.getTableData();
      },
      setPageSize(val) {
        this.filterData.page.pageSize = val;
        this.getTableData();
      },
    },
    created() {
    },
    mounted() {
      //  获取文章分类
      this.$store.dispatch('init_module_auth');
      // 获取表格数据
      this.getTableData();
    }
  };
</script>

<style lang="less" scoped>
    // @import "../article.less";

    /deep/ span + span:hover {
        background: #f5f5f5;
    }

    .classification-con {
        margin-top: -20px;
        padding: 10px;
        overflow: auto;
    }

    .card-search {
        margin: 5px;
    }

    .card-tree {
        margin: 5px;
    }

    .card-xiugai {
        margin: 5px;
    }
</style>
