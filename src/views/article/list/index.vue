<!--文章列表-->
<template>
    <div>
        <Row>
            <i-col span="19" style="padding-right: 12px;">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        文章列表（上传时间倒序排列）
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="handleSelectAll(true)">设置全选
                    </Button>
                    <Button slot="extra" type="primary" shape="circle" @click="handleSelectAll(false)">取消全选
                    </Button>
                    <Button v-show="delIdAry.length > 0" slot="extra" type="error" shape="circle"
                            @click="delSelection">
                        <Icon type="trash-a"></Icon>
                        批量删除
                    </Button>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新文章列表
                    </Button>
                    <div class="filterTool">
                        <div class="toolBar">
                            <ButtonGroup>
                                <Button @click="filterData.state = -1;getData()"
                                        :type="filterData.state===-1?'primary':null">全部
                                </Button>
                                <Button v-for="(i,index) in articleStateList" :key="index"
                                        @click="filterData.state = i.value;getData()"
                                        :type="filterData.state===i.value?'primary':null">{{i.name}}
                                </Button>
                            </ButtonGroup>
                            <Button type="dashed" v-if="filterData.sortKey == 'date'" @click="filterData.sortKey = 'createTime'; getData()">按发文时间倒序排序</Button>
                            <Button type="dashed" v-if="filterData.sortKey == 'createTime'" @click="filterData.sortKey = 'date'; getData()">按创建时间倒序排序</Button>
                        </div>
                        
                    </div>
                    <Table :columns="columnsList" :data="articleData" ref="selection" border
                           @on-selection-change="getSelect"></Table>
                    <Page :total="filterData.page.totalSize" :current="filterData.page.pageNumber" show-sizer @on-change="getPageData"
                          @on-page-size-change="setPageSize" class="pageTool" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                </Card>
            </i-col>
            <i-col span="5" style="">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        条件查询（发文时间倒序排列）
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="searchClick">
                        <Icon type="ios-search"></Icon>
                        查询
                    </Button>
                    <Form :label-width="60">
                        <!--<FormItem label="id">-->
                            <!--<Input v-model="searchData.id"/>-->
                        <!--</FormItem>-->
                        <FormItem label="标题">
                            <Input v-model="searchData.title"/>
                        </FormItem>
                        <FormItem label="发布时间">
                            <DatePicker v-model="searchData.createTime"
                                        type="daterange"
                                        placement="bottom-end"
                                        placeholder="选择时间范围">
                            </DatePicker>
                        </FormItem>
                        <!--<FormItem label="作者id">-->
                            <!--<Input v-model="searchData.author.id"/>-->
                        <!--</FormItem>-->
                        <FormItem label="发文日期">
                            <Input v-model="searchData.date"/>
                        </FormItem>
                        <FormItem label="作者">
                            <Input v-model="searchData.articleauthor"/>
                        </FormItem>
                    </Form>
                </Card>
                <br/>
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        分类目录
                    </p>
                    <Button type="primary" shape="circle" @click="pickAllCategory" slot="extra">全选</Button>
                    <Button type="ghost" @click="$router.push('/article/category')" slot="extra">管理分类</Button>
                    <div class="classification-con">
                        <Tree ref="catetree" :data="articleCategory" @on-check-change="setCategory"
                              show-checkbox ></Tree>
                    </div>
                </Card>
            </i-col>
        </Row>
        <Modal v-if="editArticleData.author" v-model="editArticleUser" title="修改文章用户" @on-ok="submitEditArticle"
               okText="提交修改"
               @on-visible-change="getFresh">
            <h2>用户：</h2>
            <Form :label-width="100">
                <FormItem label="修改用户id">
                    <Row>
                        <i-col span="14">
                            <Input v-model="editArticleData.author.id"/>
                        </i-col>
                        <i-col span="8">
                            <Button @click="loadArticleUser" style="margin-left: 10px;" icon="ios-search"
                                    type="primary" shape="circle">按id号查询用户
                            </Button>
                        </i-col>
                    </Row>
                </FormItem>
                <FormItem label="用户头像">
                    <Avatar icon="person" :src="editArticleData.author.logo" size="large"></Avatar>
                </FormItem>
                <FormItem label="用户名">
                    <div v-html="editArticleData.author.userName"></div>
                </FormItem>
                <FormItem label="昵称">
                    <div v-html="editArticleData.author.nickName"></div>
                </FormItem>
                <FormItem label="用户名有效性">
                    <div v-html="editArticleData.author.valid"></div>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="editArticleState" title="修改文章状态" @on-ok="submitEditArticle" okText="提交修改">
            <Form :label-width="100">
                <FormItem label="文章状态">
                    <Select v-model="editArticleData.state">
                        <Option v-for="(i,index) in articleStateList" :key="index" :value="i.value">
                            {{i.name}}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="editArticleModal" title="修改文章" cancel-text="" ok-text="关闭窗口" width="1200"
               :styles="{top:'50px'}" @on-ok="getFresh">
            <articleUpdateEditor3 :srcdata.sync="editArticleData"/>

        </Modal>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {doPReplace,formatDate} from '@/libs/filters';
  import articleUpdateEditor from '../components/article-update-editor';
  import articleUpdateEditor3 from '../components/article-update-editor3';


  export default {
    components: {articleUpdateEditor, articleUpdateEditor3},
    data() {
      return {
        columnsList: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '编号',
          key: 'id',
          width: 95
          // ellipsis: true
        },{
          title: '标题',
          key: 'title',
          width: 200
          // ellipsis: true
        }, {
          title: '摘要',
          key: 'summary',
          width: 350,
            render: (h, params) => {
                if (params && params.row && params.row.summary&& params.row.summary.length>70) {
                    return h('div', params.row.summary.substring(0,65));
                }else{
                    return h('div', params.row.summary);
                }
            }
        }, {
          title: '发文时间',
          key: 'date',
          width: 115
        }, {
            title: '文章作者',
            key: 'articleauthor',
            width: 95
        },{
          title: '分类',
          align: 'center',
          key: 'categorys',
          render: (h, params) => {
            if (params && params.row && params.row.categorys && params.row.categorys.length > 0) {
              return h('div', params.row.categorys.map(item => {
                return h('Tag', {style: {marginRight: '2px'}}, item);
              }));
            }
          }
        }, {
          title: '操作',
          align: 'center',
          key: 'handle',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editArticleData = params.row;
                      this.editArticleState = true;
                    }
                  }
                },
                this.articleStateMapRevert[params.row.state]
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row);
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params.row);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }],
        articleData: [],
        editArticleModal: false,
        editArticleData: {
          author: {}
        },
        articleCategory: [],
        editArticleUser: false,
        editArticleState: false,
        searchData: {
          id: null,
          articleauthor:null,
          date:null,
          title: null,
          createTime: null,
          author: {
            id: null
          }
        },
        searchDataSearching: false,
        filterData: {
         sortKey:"createTime",
         asc:false,
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          },
          state: -1
        },
        delIdAry: [] //  定义批量删除id数组
      };
    },
    computed: {
      ...mapGetters([
        'articleCategoryList',
        'articleCategoryRoot',
        'articleCategoryLevel',
        'articleStateList',
        'articleStateMapRevert'
      ])
    },
    methods: {
      getArticleCategory(myData) {
        if (myData) {
          this.articleCategory = JSON.parse(JSON.stringify(myData));
        } else {
          if (this.articleCategoryRoot) {
            let rootNode = this.articleCategoryRoot;
            if (rootNode && rootNode.children) {
              this.articleCategory = JSON.parse(JSON.stringify(rootNode.children));
            }
          } else {
            setTimeout(() => {
              this.getArticleCategory();
            }, 1000);
          }
        }
      },
      freshAllCategorys(children) {
        if (children) {
          children.forEach(item => {
            if (item.checked) {
              item.checked = !item.checked;
            } else {
              item.checked = true;
            }
            this.freshAllCategorys(item.children);
          });
        }
      },
      pickAllCategory() {
        // console.log(this.articleCategory);
        this.freshAllCategorys(this.articleCategory);
        setTimeout(() => {
          this.getArticleCategory(this.articleCategory);
          this.getData();
        }, 0);
      },
      loadArticleUser() {
        this.$store.dispatch('get_basic_user', this.editArticleData.author.id).then(res => {
          // console.log(res.length);
          if (res && (res.length > 0 || Object.keys(res).length > 0)) {
            this.$Message.success('已查询到对应用户');
            this.editArticleData.author = res;
          } else {
            this.$Message.error('未查询到对应用户');
          }
          // console.log(res);
        });
      },
      freshData() {
        this.filterData.page = {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
        };
        this.searchDataSearching = false;
        this.getData();
      },
      setCategory() {
        this.getData();
      },
      handleSelectAll(status) {
        //  全选
        this.$refs.selection.selectAll(status);
      },
      handleRemove(val) {
        this.$Modal.confirm({
          title: '确定要删除吗？',
          content: '<p>已删除的文章可以在回收站中找到</p>',
          onOk: () => {
            this.delete(val.id);
          }
        });
      },
      delete(articleid) {
        this.$http.delete('/article/fakedel/' + articleid).then(() => {
          this.getFresh();
          this.$Notice.success({
            title: '删除文章成功',
            duration: 1
          });
        });
      },
      delSelection() {
        this.$http.post('/article/fakedellot', this.delIdAry).then(() => {
          this.$Notice.success({
            title: '删除文章成功',
            duration: 1
          });
          this.getFresh();
        });
      },
      handleEdit(val) {
        this.editArticleData = val;
        this.getContent().then(res => {
          if (res.content) {
            this.editArticleData.content = doPReplace(res.content);
            sessionStorage.setItem('articleUpdateTextCache', doPReplace(res.content));
          }
          // this.editArticleData.taxTag = this.editArticleData.taxTag ? this.editArticleData.taxTag : [];
          // this.editArticleData.regionTag = this.editArticleData.regionTag ? this.editArticleData.regionTag : [];
          this.editArticleData = JSON.parse(JSON.stringify(this.editArticleData));
          this.editArticleModal = true;
        });
      },
      submitEditArticle() {
          console.log('提交修改');
          console.log(this.editArticleData);
        this.$http.post('/article/update', this.editArticleData).then(() => {
          this.$Notice.success({
            title: '修改文章成功',
            duration: 1
          });
        });
      },
      getData() {
        this.filterData.page = {
          pageNumber: 1,
          totalSize: 0,
          pageSize: 10
        };
        this.getFresh();
      },
      getFresh() {
        if (this.$refs['catetree']) {
          let filterCates = this.$refs['catetree'].getCheckedNodes();
          if (filterCates && filterCates.length > 0) {
            this.$data.filterData.categorys = filterCates.map(item => {
              return item.id;
            });
          } else {
            this.$data.filterData.categorys = null;
          }
        }
        // console.log(this.$data.filterData);
        let postUrl = '/article/query';
        if (this.searchDataSearching) {
          postUrl = '/article/complexquery';
        }
        this.$http.post(postUrl, this.$data.filterData).then(res => {
          this.articleData = res.list.map((val) => {
            val.authorName = val.author ? val.author.userName : '-';
            val.createDate = formatDate(val.createTime);
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.$Notice.success({
            title: '已获取最新文章数据',
            duration: 1
          });
        });
      },
      getContent() {
        return new Promise((resolve, reject) => {
          this.$http.get('/article/content/' + this.editArticleData.id).then(res => {
            this.$Message.success('获取文章内容成功');
            resolve(res);
          }).catch(err => [
            reject(err)
          ]);
        });
      },
      searchClick() {
        for (let k in this.searchData) {
          let val = this.searchData[k];
          if (val) {
            this.filterData[k] = this.searchData[k];
          } else {
            this.filterData[k] = null;
          }
        }
        if (!(this.filterData.createTime && this.filterData.createTime[0] && this.filterData.createTime[1])) {
          this.filterData.createTime = null;
        }
        this.searchDataSearching = true;
        this.getData();
      },
      getPageData(val) {
        this.filterData.page.pageNumber = val;
        this.getFresh();
      },
      setPageSize(val) {
        this.filterData.page.pageSize = val;
        this.getFresh();
      },
      getSelect(selection) {
        //  批量删除复选款
        let idAry = [];
        selection.map(item => {
          if (item.id) {
            idAry.push(item.id);
          }
          ;
        });
        this.delIdAry = idAry;
      }
    },
    mounted() {
      this.getArticleCategory();
      this.getData();
      //  获取文章分类
      this.$store.dispatch('init_module_article');
    },
    destroyed() {
    }
  };
</script>
<style lang="less">
    @import "../article.less";

    .ivu-tree-title {
        font-size: 12px;
    }
</style>
