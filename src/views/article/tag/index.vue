<!--文章标签管理-->
<template>
    <Row>
        <!--<i-col span="8">-->
        <!--<Card class="card-search">-->
        <!--<Row>-->
        <!--<i-col span="18">-->
        <!--<Input v-model="searchTagName" placeholder="请输入待查询的标签id"></Input>-->
        <!--</i-col>-->
        <!--<i-col span="6">-->
        <!--<Button type="primary" icon="ios-search" @click="searchTagClick">查询标签</Button>-->
        <!--</i-col>-->
        <!--</Row>-->
        <!--</Card>-->
        <!--<Card class="card-tree">-->
        <!--<p slot="title">-->
        <!--<Icon type="navicon-round"></Icon>-->
        <!--标签树-->
        <!--</p>-->
        <!--<Button slot="extra" type="primary" shape="circle" @click="freshData">-->
        <!--<Icon type="ios-loop-strong"></Icon>-->
        <!--刷新-->
        <!--</Button>-->
        <!--<div class="classification-con">-->
        <!--<Tree :data="tagtree" :load-data="loadTagSubTree" @on-select-change="selectTreeTag"></Tree>-->
        <!--</div>-->
        <!--</Card>-->
        <!--</i-col>-->
        <i-col span="14">
            <!--<Card class="card-search">-->
                <!--<Row>-->
                    <!--<i-col span="18">-->
                        <!--<Input v-model="searchTagName" placeholder="请输入待查询的标签id"></Input>-->
                    <!--</i-col>-->
                    <!--<i-col span="6">-->
                        <!--<Button type="primary" icon="ios-search" @click="searchTagClick">查询标签</Button>-->
                    <!--</i-col>-->
                <!--</Row>-->
            <!--</Card>-->
            <Card class="card-tree">
                <p slot="title">
                    <Icon type="navicon-round"></Icon>
                    标签树
                </p>
                <Button slot="extra" type="primary" shape="circle" @click="freshData">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </Button>
                <div class="classification-con">
                    <!--<div>-->
                        <!--<Button type="info" @click="modal1 = true, tagObj.parent = 'root',tagObj.id = '', tagObj.type = ''">添加第一级分类</Button>-->
                        <!--<br/><br/>-->
                    <!--</div>-->
                    <Tree :data="tagtree" :load-data="loadTagSubTree" @on-select-change="selectTreeTag" :render="renderContent"></Tree>
                </div>
            </Card>
        </i-col>
        <i-col span="1">
          <p style="height:2rem"></p>
        </i-col>
        <i-col span="8">
          <Card class="card-tree">
            <p style="text-align:center;font-size:1.3rem;">标签管理说明：</p>
            <p style="padding-left:1.5rem">1、root不能删除；</p>
            <p style="padding-left:1.5rem">2、文章的“标签管理”分行业、税种、优惠、发票、征管、其他共六大类（暂定，如缺少或不正确可再添加或修改），且分类不限定数量；</p>
            <p style="padding-left:1.5rem">3、最低级分类不支持修改，如不正确可删除重新添加；</p>
            <p style="padding-left:1.5rem">4、此板块分类有排序要求。</p>
          </Card>
        </i-col>
        <!--<i-col span="8">-->
        <!--<Card class="card-xiugai">-->
        <!--<p slot="title"> 修改标签 </p>-->
        <!--<Button slot="extra" type="success" @click="addNewTag">添加</Button>-->
        <!--<Button slot="extra" type="warning" @click="updateNewTag">修改</Button>-->
        <!--<Button slot="extra" type="error" @click="deleteNewTag">删除</Button>-->
        <!--<Form :model="newTag" label-position="left" :label-width="100">-->
        <!--<FormItem label="标签名">-->
        <!--<Input v-model="newTag.title"></Input>-->
        <!--</FormItem>-->
        <!--<FormItem label="标签父类">-->
        <!--<Input v-model="newTag.parent"></Input>-->
        <!--</FormItem>-->
        <!--<FormItem label="标签类型">-->
        <!--<Input v-model="newTag.type"></Input>-->
        <!--</FormItem>-->
        <!--</Form>-->
        <!--</Card>-->
        <!--</i-col>-->
        <Modal v-model="modal1" title="添加" @on-ok="addNewTag">
            <Form :model="tagObj" label-position="left" :label-width="100">
               <FormItem label="标签父类">
                    <Input v-model="tagObj.parent" placeholder="顶级分类请写root" readonly></Input>
                </FormItem>
                <FormItem label="标签名称">
                    <Input v-model="tagObj.id" placeholder="填写分类名称"></Input>
                </FormItem>        
                <FormItem label="排序值">
                    <Input v-model="tagObj.type" placeholder="排序值"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="modal2" title="修改" @on-ok="updateNewTag">
            <Form :model="tagObj" label-position="left" :label-width="100">
               <FormItem label="标签父类">
                    <Input v-model="tagObj.parent" placeholder="顶级分类请写root" readonly></Input>
                </FormItem>
                <FormItem label="标签名称">
                    <Input v-model="tagObj.id" placeholder="填写分类名称"></Input>
                </FormItem>
                <FormItem label="排序值">
                    <Input v-model="tagObj.type" placeholder="排序值"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal type="error" v-model="modal3" title="删除" @on-ok="deleteNewTag">
            <div style="font-size: 16px;">
                <Icon type="information-circled" size="30" color="#f60"></Icon>
                确定要删除<Tag>{{tagObj.id}}</Tag>分类么？
            </div>
        </Modal>
    </Row>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    data () {
      return {
        // addTagModel: false,
        newTag: this.generateBlankTag(),
        searchTagName: '',
        modal1: false,
        modal2: false,
        modal3: false,
        tagObj: {}
      };
    },
    computed: {
      ...mapGetters(['tagtree'])
    },
    methods: {
      generateBlankTag () {
        return {
          id: '',
          parent: '',
          type: '',
          expand: true
        };
      },
      // searchTagClick () {
      //   this.$http.get('/tag/' + this.$data.searchTagName).then((res) => {
      //     console.log(res);
      //     if (res) {
      //       this.$Notice.success({
      //         title: '查询标签成功'
      //       });
      //       res.title = res.id;
      //       this.$data.newTag = res;
      //     } else {
      //       this.$Notice.error({
      //         title: '查询标签失败'
      //       });
      //     }
      //   });
      // },
      freshData () {
        this.$store.dispatch('init_module_tag');
      },
      loadTagSubTree (item, callback) {
        this.$http.get('/tag/parent/' + item.title).then((res) => {
          // console.log(res);
          if (res) {
            callback(res.map((val) => {
              return {
                title: val.id,
                loading: false,
                expand: true,
                children: [],
                parent: val.parent,
                type: val.type
              };
            }));
          } else {
            callback([]);
          }
        });
      },
      selectTreeTag (item) {
        console.log(item);
        this.$data.newTag = item[0];
      },
      addNewTag () {
        this.$http.put('/tag', this.tagObj).then(() => {
          this.$Notice.success({
            title: '添加标签成功'
          });
          this.freshData();
        });
      },
      updateNewTag () {
        this.$http.post('/tag/update', this.tagObj).then(() => {
          this.$Notice.success({
            title: '修改标签成功'
          });
          this.freshData();
        });
      },
      deleteNewTag () {
        this.$http.delete('/tag/' + this.tagObj.id).then(() => {
          this.$Notice.success({
            title: '删除标签成功'
          });
          this.freshData();
        });
      },
      renderContent (h, { root, node, data }) {
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
            }, data.title),
            h(data.type ? 'Tag' : 'span', {
              style: {
                marginLeft: '12px'
              }
            }, data.type)
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
                  this.tagObj.id = '';
                  this.tagObj.parent = data.title;
                  this.tagObj.type = '';
                  // console.log(data)
                  // this.append(data)
                }
              }
            }, '添加子类'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'edit',
                size: 'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  if (data.title == 'root') {
                    this.tagObj.parent = '最顶级';
                  } else {
                    this.tagObj.parent = data.parent;
                  }
                  this.modal2 = true;
                  this.tagObj.id = data.title;
  
                  this.tagObj.type = data.type;
                  // console.log(data)
                  // this.append(data)
                }
              }
            }, '修改'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty',
                size: 'small'
              }),
              on: {
                click: () => {
                  this.modal3 = true;
                  this.tagObj.id = data.title;
                  // this.deleteNewCategory(data.title);
                  // this.remove(root, node, data)
                }
              }
            }, '删除')
          ])
        ]);
      }
    },
    created () {
    },
    mounted () {
      // 获取标签
      this.$store.dispatch('init_module_tag');
    }
  };
</script>

<style lang="less" scoped>
    /deep/ span + span:hover {
        background: #f5f5f5;
    }
    .classification-con {
        margin-top: -20px;
        padding: 10px;
        overflow: auto;
    }
    .classification-con /deep/ .ivu-tree>.ivu-tree-children>li {
        padding: 12px 0 0;
    }
    .ivu-tree-title-selected {
        background: #1bcd56;
        color: #fff;
    }

    .ivu-tree-arrow {
        font-size: 18px;
    }

    .ivu-tree-title {
        font-size: 18px;
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
