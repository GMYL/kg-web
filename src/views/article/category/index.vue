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
                                文章分类
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
                                <Tree :data="articleCategory" @on-select-change="selectTreeCatagory"
                                      :render="renderContent"></Tree>
                            </div>
                        </Card>
                    </i-col>
                    <i-col span="1">
                        <p style="height:2rem"></p>
                    </i-col>
                    <i-col span="8">
                        <Card class="card-tree">
                            <p style="text-align:center;font-size:1.3rem;">标签管理说明：</p>
                            <p style="padding-left:1.5rem">1、花瓣儿技术组提醒您：<br><span style="color:red;">操作千万条，谨慎第一条。<br>操作不规范，友人两行泪。</span></p>
                            <p style="padding-left:1.5rem">2、此分类用于房地产风控资料的分类，以及前端页面数据分类展示</p>
                            <p style="padding-left:1.5rem">3、添加规则001：“添加第一级分类”功能，第一行分类父类为root不允许修改，第二行为分类名称如“购地阶段”，排序值用于排序</p>
                            <p style="padding-left:1.5rem">4、添加规则002：“添加子类”功能，第一行分类父类为不允许修改，第二行为分类名称填写格式为所有父类加“-”如“首页新闻-主站-公司动态”，排序值用于排序</p>
                            <p style="padding-left:1.5rem">5、修改规则：<span style="color:red;">修改只支持排序值修改，</span>排序值填写错误或者为空不用担心，修改为正确排序值即可。</p>
                            <p style="padding-left:1.5rem"><span style="color:red;">6、删除规则：</span>删除分类时候要确定此分类是否有子类，有子类请先删除子类。</p>
                            <p style="padding-left:1.5rem"><span style="color:red;">7、特别注意：</span>添加时候不要不要出现其他字符，<span style="color:red;">比如“，、,”等如有特殊字符请尽量用中文“和或等”替代。</span>有问题请及时反应</p>
                        </Card>
                    </i-col>
                    <Modal v-model="modal1" title="添加" @on-ok="addNewCategory">
                        <Form :model="categoryObj" label-position="left" :label-width="100">
                            <FormItem label="分类父类">
                                <Input v-model="categoryObj.parent" placeholder="顶级分类请写root" readonly/>
                            </FormItem>
                            <FormItem label="分类名称">
                                <Input v-model="categoryObj.id" placeholder="例如：首页新闻-税务要闻"/>
                            </FormItem>
                            <FormItem label="排序值">
                                <Input v-model="categoryObj.sequence" placeholder="排序值"/>
                            </FormItem>
                            注：如果父类为root分类填写格式为：首页新闻
                        </Form>
                    </Modal>
                    <Modal v-model="modal2" title="修改" @on-ok="updateNewCategory">
                        <Form :model="categoryObj" label-position="left" :label-width="100">
                            <FormItem label="分类父类">
                                <Input v-model="categoryObj.parent" placeholder="请填写父类名称" readonly></Input>
                            </FormItem>
                            <FormItem label="分类名称">
                                <Input v-model="categoryObj.id" placeholder="填写分类名称" readonly></Input>
                            </FormItem>
                            <FormItem label="排序值">
                                <Input v-model="categoryObj.sequence" placeholder="排序值"></Input>
                            </FormItem>
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
        dataName: 'articlecategory',
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
                    this.categoryObj.id = params.row.id;
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
            pageSize: 20
          }
        },
      };
    },
    computed: {
      articleCategory() {
        let sortNumber = (a, b) => {
          return a.sequence - b.sequence;
        };
        //  给数组递归排序
        let digui = (childrens) => {
          if (childrens && childrens.children) {
            childrens.children.sort(sortNumber).map(val => digui(val));
          }
          return childrens;
        };
        let rootNode = this.$store.getters.articleCategoryRoot;
        if (rootNode && rootNode.children) {
          // return JSON.parse(JSON.stringify(rootNode.children));
          rootNode.children.sort(sortNumber);
          return JSON.parse(JSON.stringify(rootNode.children.map(item => digui(item))));
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
        this.$store.dispatch('get_articleCategory');
        this.getTableData();
      },
      selectTreeCatagory(item) {
        // console.log(item);
        if (item[0]) {
          this.$data.newCategory = item[0];
        }
      },
      addNewCategory() {
        this.$http.put('/articlecategory', this.categoryObj).then(() => {
          this.$Notice.success({
            title: '添加分类成功'
          });
          this.freshData();
        });
      },
      deleteNewCategory() {
        this.$http.delete('/articlecategory/' + this.categoryObj.id).then(() => {
          this.$Notice.success({
            title: '删除分类成功'
          });
          this.freshData();
        });
      },
      updateNewCategory() {
        this.$http.post('/articlecategory/update', this.categoryObj).then(() => {
          this.$Notice.success({
            title: '修改成功'
          });
          this.categoryObj = {};
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
            h('Tag', {
              style: {
                marginLeft: '12px'
              }
            }, data.sequence),
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
                  this.categoryObj.parent = data.title;
                }
              }
            }, '添加子类'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-plus-empty',
                size: 'small',
                type: 'warning'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.categoryObj.id = data.id;
                  this.categoryObj.parent = data.parent;
                  this.categoryObj.sequence = data.sequence;
                  this.modal2 = true;
                  // console.log(data)
                  // this.append(data)
                }
              }
            }, '修改'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty',
                size: 'small',
                // type: 'error'
              }),
              on: {
                click: () => {
                  this.modal3 = true;
                  this.categoryObj.id = data.title;
                }
              }
            }, '删除')
          ])
        ]);
      },
      // 这个是分界线，下面的方法都是树状图用的，上面是表格用到的
      getTableData() {
        this.$http.post('/articlecategory/query', this.filterData).then(res => {
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
      this.$store.dispatch('init_module_article');
      // 获取表格数据
      this.getTableData();
    }
  };
</script>

<style lang="less" scoped>
    @import "../article.less";

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
