<!--税务专栏管理-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <Tabs v-model="tabName" type="card" style="background: #fff;">
                <TabPane label="税务专栏" value="name1">
                    <i-col span="24">
                        <Card>
                            <Row slot="title">
                            <i-col span="2" style="height: 24px; padding-top: 10px;">
                                <Icon type="navicon-round"></Icon>
                                税务专栏
                            </i-col>
                            <i-col span="20">
                                <Input type="text" v-model="searchData.title" style="width: 160px" @on-enter="searchData" placeholder="请输入标题"></Input>
                                <Button type="info" icon="ios-search" @click="searchComplexquery" style="font-size: 12px;"></Button>
                            </i-col>
                            </Row>
                            <Button slot="extra" type="primary" shape="circle" @click="handleSelectAll(true)">设置全选
                            </Button>
                            <Button slot="extra" type="primary" shape="circle" @click="handleSelectAll(false)">取消全选
                            </Button>
                            <Button v-show="idAry.length > 0" slot="extra" type="error" shape="circle"
                                    @click="delSum">
                                <Icon type="trash-a"></Icon>
                                批量删除
                            </Button>
                            <Button slot="extra" type="primary" shape="circle" @click="freshData">
                                <Icon type="ios-loop-strong"></Icon>
                                刷新
                            </Button>
                            <div style="padding-bottom: 200px;">
                                <Table highlight-row border  ref="selection" :columns="mainColumns" :data="mainData"
                                       @on-selection-change="selectAry"></Table>
                                <br/>
                                <Page v-show="filterData.page.totalSize > 10" :total="filterData.page.totalSize"
                                      @on-change="getPageData"
                                      @on-page-size-change="setPageSize" :current="filterData.page.pageNumber"
                                      class="pageTool" show-sizer :page-size="10" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                            </div>
                        </Card>
                    </i-col>
                </TabPane>
                <TabPane label="修改文件" value="name2">
                    <i-col span="24" class="padding-left-10">
                        <Card>
                            <Row slot="title">
                                <i-col span="2" style="height: 34px; padding-top: 10px;">
                                    <Icon type="navicon-round"></Icon>
                                    修改
                                </i-col>
                                <i-col span="8" style="height: 34px;">
                                    <Input style="margin-left: 12px; width: 260px;" v-model="searchName"
                                           @on-enter="searchClick" placeholder="请输入待修改文件的文件编码">
                                    <Button slot="append" icon="ios-search" @click="searchClick"></Button>
                                    </Input>
                                </i-col>
                            </Row>
                            <Form :model="editmainData" label-position="right" :label-width="140">
                                <FormItem label="标题：">
                                    <Input v-model="editmainData.title" style="width: 240px;" placeholder="标题"/>
                                </FormItem>
                                <FormItem label="状态：">
                                <Select v-model="editmainData.state" style="width:220px" clearable placeholder="请选择">
                                    <Option v-for="(item,index) in itemState" :value="index+1" :key="item">{{ item }}</Option>
                                </Select>
                                </FormItem>
                                <FormItem label="排序：">
                                    <Input v-model="editmainData.sequence" style="width: 240px;" placeholder="排序值"/>
                                </FormItem>
                                <FormItem label="备注：">
                                    <Input v-model="editmainData.note" style="width: 240px;" placeholder="备注"/>
                                </FormItem>
                                <FormItem label="轮播图片：">
                                    <Tag v-for="item in editmainData.pictures" :key="item" :name="item" closable
                                         @on-close="handleClose">{{ item }}
                                    </Tag>
                                    <Button v-show="!addingNewTag" icon="ios-plus-empty" type="dashed" size="small"
                                            @click="handleAdd">添加图片url
                                    </Button>
                                    <transition name="add-new-tag">
                                        <div v-show="addingNewTag">
                                            <i-col span="6">
                                                <Input v-model="newTagName" style="width: 380px;" placeholder="请输入法规id"/>
                                            </i-col>
                                            <i-col span="2" class="padding-left-10">
                                                <Button @click="createNewTag" long type="primary">确定</Button>
                                            </i-col>
                                            <i-col span="2" class="padding-left-10">
                                                <Button @click="cancelCreateNewTag" long type="ghost">取消</Button>
                                            </i-col>
                                        </div>
                                    </transition>
                                </FormItem>
                                <FormItem label="相关文件">
                                    <Tag type="border" closable color="blue" v-if="editmainData.lawId.length > 0"
                                         v-for="item in editmainData.lawId" :name="item" :key="item"
                                         @on-close="itemDellaw">{{item}}
                                    </Tag>
                                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="modal4 = true">
                                        添加标签
                                    </Button>
                                </FormItem>
                                <FormItem label="政策解读">
                                    <Tag type="border" closable color="blue" v-if="editmainData.policyId.length > 0"
                                         v-for="item in editmainData.policyId" :name="item" :key="item"
                                         @on-close="itemDelpolicy">{{item}}
                                    </Tag>
                                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="modal2 = true">
                                        添加标签
                                    </Button>
                                </FormItem>
                                <FormItem label="热点专题">
                                    <Tag type="border" closable color="blue" v-if="editmainData.specialId.length > 0"
                                         v-for="item in editmainData.specialId" :name="item" :key="item"
                                         @on-close="itemDelspecial">{{item}}
                                    </Tag>
                                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="modal5 = true">
                                        添加标签
                                    </Button>
                                </FormItem>
                                <FormItem label="新闻动态">
                                    <Tag type="border" closable color="blue" v-if="editmainData.newsId.length > 0"
                                         v-for="item in editmainData.newsId" :name="item" :key="item"
                                         @on-close="itemDelnews">{{item}}
                                    </Tag>
                                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="modal6 = true">
                                        添加标签
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="warning" @click="updateEditor">修改</Button>
                                </FormItem>
                            </Form>
                        </Card>
                    </i-col>
                </TabPane>
                <TabPane label="添加文件" value="name3">
                    <i-col span="24" class="padding-left-10">
                        <Card>
                            <Form label-position="right" :label-width="140">
                                <FormItem label="标题：">
                                    <Input v-model="addData.title" style="width: 240px;" clearable placeholder="标题"/>
                                </FormItem>
                                <!-- <FormItem label="状态：">
                                <Select v-model="addData.state" style="width:220px" clearable placeholder="请选择">
                                    <Option v-for="(item,index) in itemState" :value="index+1" :key="item">{{ item }}</Option>
                                </Select>
                                </FormItem> -->
                                 <FormItem label="状态：">
                                      <h3>待审核</h3>
                                </FormItem>
                                <FormItem label="排序：">
                                    <Input v-model="addData.sequence" style="width: 240px;" clearable placeholder="排序值"/>
                                </FormItem>
                                <FormItem label="轮播图片：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="pictures"
                                           placeholder="轮播图片url，英文逗号“,”分隔" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="相关法规：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="laws"
                                           placeholder="法规编号，英文逗号“,”分隔" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="解读：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="policys"
                                           placeholder="政策解读文章编号，轮播图片url，英文逗号“,”分隔" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="专题：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="specials"
                                           placeholder="专题文章编号，英文逗号“,”分隔" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="新闻：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="newss"
                                           placeholder="新闻文章编号，英文逗号“,”分隔" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="备注：">
                                    <Input type="textarea" :autosize="{minRows: 2}" v-model="addData.note"
                                           placeholder="备注信息，选填" style="width: 240px;"/>
                                </FormItem>
                                <FormItem label="注意：">
                                    <h3>点击添加后为待审核状态，在列表中审核无误后，改变状态即可</h3>
                                </FormItem>
                                <FormItem>
                                    <Button type="success" @click="addEditor">添加</Button>
                                </FormItem>
                            </Form>
                        </Card>
                    </i-col>
                </TabPane>
            </Tabs>
            <!--详情弹框-->
            <Modal v-model="modal1" title="详情" width="600">
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">文件编码：</Tag>
                    {{specialDetail.id}}
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">标题：</Tag>
                    {{specialDetail.title}}
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">排序：</Tag>
                    {{specialDetail.sequence}}
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">状态：</Tag>
                    <Tag v-if="specialDetail.state > 0" type="border" :color="stateItems[specialDetail.state -1].color">
                    {{stateItems[specialDetail.state -1].title}}</Tag>
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">创建日期：</Tag>
                    {{specialDetail.createTime}}
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">最后一次更新日期：</Tag>
                    {{specialDetail.updateTime}}
                </p>
                 <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">轮播图片：</Tag>
                    <span v-for="item in specialDetail.pictures" :value="item" :key="item">
                        <img v-bind:src="item" height="50" width="50" /> 
                    </span>
                </p>
                <p  style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">法规：</Tag>
                    <template>
                    <Table :columns="columns1" :data="specialDetail.law"></Table>
                    </template>
                </p>
                <p  style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">解读：</Tag>
                    <template>
                    <Table :columns="columns1" :data="specialDetail.policy"></Table>
                    </template>
                </p>
                <p  style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">专题：</Tag>
                    <template>
                    <Table :columns="columns1" :data="specialDetail.special"></Table>
                    </template>
                </p>
                <p  style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">新闻：</Tag>
                    <template>
                    <Table :columns="columns1" :data="specialDetail.news"></Table>
                    </template>
                </p>
                <p style="font-size: 14px;">
                    <Tag type="dot" color="green" style="font-size: 14px;width: 170px">备注：</Tag>
                    {{specialDetail.note}}
                </p>
            </Modal>
            <Modal v-model="modal3" title="更多" width="800">
              <Row>
                <h3>包含文件：</h3>
                  <template>
                    <Table :columns="columns1" :data="viewDate"></Table>
                </template>
              </Row>
            </Modal>
            <Modal v-model="editArticleState" title="修改状态" @on-ok="updateEditor" okText="提交修改">
                <Form :label-width="100">
                    <FormItem label="状态">
                        <Select v-model="editmainData.state" style="width:220px" clearable placeholder="请选择">
                            <Option v-for="(item,index) in itemState" :value="index+1" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
            <Modal v-model="deleteConfirm" title="提示" @on-ok="deleteOk" @on-cancel="cancelDelete">
                <p>{{this.deleteParems}}-----是否确认删除？</p>
            </Modal>
            <Modal v-model="modal4" title="相关文件" @on-ok="itemAdd(4)">
                <Input type="text" v-model="lawItem" autofocus @on-enter="itemAdd(4)"/>
            </Modal>
            <Modal v-model="modal2" title="正常解读" @on-ok="itemAdd(2)">
                <Input type="text" v-model="policyItem" autofocus @on-enter="itemAdd(2)"/>
            </Modal>
            <Modal v-model="modal5" title="专题" @on-ok="itemAdd(5)">
                <Input type="text" v-model="specialItem" autofocus @on-enter="itemAdd(5)"/>
            </Modal>
            <Modal v-model="modal6" title="新闻" @on-ok="itemAdd(6)">
                <Input type="text" v-model="newsItem" autofocus @on-enter="itemAdd(6)"/>
            </Modal>
            <transition name="fade">
                    <div class="media-wrapper" v-if="seeMedia">
                        <Button type="text" class="media-close" shape="circle" icon="close" @click="close"></Button>
                        <div class="media-controller">
                            <Button-group shape='circle'>
                                <Button size="large" type="ghost" icon="ios-skipbackward" @click.prevent="prev"></Button>
                                <Button size="large" type="ghost" icon="ios-skipforward" @click.prevent="next"></Button>
                            </Button-group>
                        </div>
                        <div class="media-content">
                            <div v-for="(item,index) in pictureDate" :key="index" :class="type(index)">
                                <img :src='item' v-if="isImg(item)" @click="toggle(index)">
                                <video :src="item" v-else controls="controls" @click="toggle(index)">
                                </video>
                            </div>
                        </div>
                    </div>
            </transition>
        </i-col>
    </Row>
</template>

<script>
  import { formatDate, formatFullDate } from "@/libs/filters";
  import ICol from 'iview/src/components/grid/col';

  export default {
    components: {ICol},
    data() {
      return {
        modal1: false,
        modal2: false,//政策解读id增加
        modal3: false,//详细
        modal4: false,//法规id增加
        modal5: false,//专题id增加
        modal6: false,//新闻id增加
        editArticleState: false,
        searchDataSearching: false,//是否启动高级查询
        itemState: ["待审核", "正常发布", "历史专题"],
        viewDate: [],
        see:false,//图片浏览开关
        lawItem: '', //  定义相关文件添加变量
        policyItem: '', //  政策解读添加变量
        specialItem: '', //  专题添加变量
        newsItem: '', //  新闻添加变量
        pictures:'',
        laws: '', 
        policys: '', 
        specials: '', 
        newss: '', 
        addingNewTag: false,
        newTagName: '',
        nowIndex: 0,
        pictureDate: [],
        columns1: [{
              title: '编码',
              key: 'id'
          },
          {
              title: '标题',
              width: 350,
              key: 'title'
          },
          {
              title: '发文时间',
              key: 'date'
          }],
        specialDetail: {}, //  查看 返回的对象
        encodeDetailDetail: '', //  查看 替换申报要素部分的";"替换成<br/>
        idAry: [], //  定义选中id数组
        tabName: 0, //  定义标签页的值
        dataName: 'article/special',
        addData: {}, //  定义添加的空对象
        searchData: {
          title:null,
        },
        mainColumns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        },{
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },{
            title: '标题',
            render: (h, params) => {
                if (params.row) {
                  return h('span', params.row.title);
                }
            }
        },
        // {
        //   title: '排序值',
        //   render: (h, params) => {
        //     if (params.row.sequence) {
        //        return h('span', params.row.sequence);
        //     }
        //   }
        // },
        {
          title: '状态',
          render: (h, params) => {
            if (params.row) {
              return h(
              "Tag",
              {
                props: {
                  type: "border",
                  color: this.stateItems[params.row.state - 1].c
                }
              },
              this.stateItems[params.row.state - 1].title
            );
            }
          }
        },{ 
            title: '轮播图（可点击浏览）',
            render: (h, params) => {
                if (params.row.pictures&&params.row.pictures[0]) {
                return h('Button', { props: {type: "info",size: "small"},
                 on: {
                  click: () => {
                    this.viewPictures(params.row.pictures);
                  }
              }}, params.row.pictures.length+"张");
            }
            }
        },{
          title: '法规文件（可点击查看更多）',
          ellipsis: true,
          render: (h, params) => {
            if (params.row.law&&params.row.law[0]) {
              return h('Button', { props: {type: "default",size: "small"},
                 on: {
                  click: () => {
                    this.views(params.row.law);
                  }
              }}, params.row.law[0].title);
            }
          }
        },{
          title: '政策解读（可点击查看更多）',
          ellipsis: true,
          render: (h, params) => {
            if (params.row.policy&&params.row.policy[0]) {
              return h('Button', { props: {type: "default",size: "small"},
                 on: {
                  click: () => {
                    this.views(params.row.policy);
                  }
              }}, params.row.policy[0].title);
            }
          }
        },{
          title: '专题文章（可点击查看更多）',
          ellipsis: true,
          render: (h, params) => {
            if (params.row.special&&params.row.special[0]) {
              return h('Button', { props: {type: "default",size: "small"},
                 on: {
                  click: () => {
                    this.views(params.row.special);
                  }
              }}, params.row.special[0].title);
            }
          }
        },{
          title: '新闻资讯（可点击查看更多）',
          ellipsis: true,
          render: (h, params) => {
            if (params.row.news&&params.row.news[0]) {
              return h('Button', { props: {type: "default",size: "small"},
                 on: {
                  click: () => {
                    this.views(params.row.news);
                  }
              }}, params.row.news[0].title);
            }
          }
        },{
          title: '操作',
          key: 'action',
          width: 240,
          align: 'center',
          render: (h, params) => {
            return h('div', [
                h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editmainData = params.row;
                      this.editArticleState = true;
                    }
                  }
                },
                this.itemState[params.row.state - 1]
              ),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  shape: 'circle'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.viewLaw(params.row);
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
                    this.changeTabs(params.row);
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  shape: 'circle'
                },
                  on: {
                      click: () => {
                          this.deleteConfirm = true;
                          this.deleteParems = params.row.id;
                      }
                  }
              }, '删除')
            ]);
          }
        }],
        mainData: [],
        editmainData: {},
        deleteParems:"",
        stateItems: [
        { title: "待审核", c: "blue" },
        { title: "正常发布", c: "green" },
        { title: "历史", c: "yellow" }
        ],
        
        deleteConfirm:false,//定义确认删除模板
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          },
          sortKey: 'id',
          asc: true
        },
        searchName: ''
      };
    },
    computed: {

    },
    methods: {
      getData(topval) {
        let topVal = topval || 0;
        let postUrl = '/' + this.$data.dataName + '/query';
        // if (this.searchDataSearching) {
        //   postUrl = '/' + this.$data.dataName + '/complexquery';
        // }
        this.$http.post(postUrl, this.$data.filterData).then(res => {
          this.mainData = res.list
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.pageSize = res.pageSize;
          this.filterData.page.totalPage = res.totalPage;
          this.$Notice.success({
            title: '已获取最新数据'
          });
          //  返回顶部及定位到目前位置
          setTimeout(function () {
            document.getElementsByClassName('single-page-con')[0].scrollTop = topVal;
          }, 500);
        });
      },
      searchComplexquery() {         
        for (let k in this.searchData) {
          let val = this.searchData[k];
          if (val) {
            this.filterData[k] = this.searchData[k];
          } else {
            this.filterData[k] = null;
          }
        }
        this.searchDataSearching = true;
        this.getData();
      },
      handleSelectAll(status) {
        //  全选
        this.$refs.selection.selectAll(status);
      },
      itemDellaw(event, name) {
        //  相关文件
        this.modal4 = true;
        this.editmainData.lawId.splice(this.editmainData.lawId.indexOf(name), 1);
        this.editmainData.law.splice(this.editmainData.lawId.indexOf(name), 1);
        this.modal4 = false;
      },
      itemDelpolicy(event, name) {
        //  政策解读
        this.modal2 = true;
        this.editmainData.policyId.splice(this.editmainData.policyId.indexOf(name), 1);
        this.editmainData.policy.splice(this.editmainData.policyId.indexOf(name), 1);
        this.modal2 = false;
      },
      itemDelspecial(event, name) {
        //  专题
        this.modal2 = true;
        this.editmainData.specialId.splice(this.editmainData.specialId.indexOf(name), 1);
        this.editmainData.special.splice(this.editmainData.specialId.indexOf(name), 1);
        this.modal2 = false;
      },
      itemDelnews(event, name) {
        //  新闻
        this.modal2 = true;
        this.editmainData.newsId.splice(this.editmainData.newsId.indexOf(name), 1);
        this.editmainData.news.splice(this.editmainData.newsId.indexOf(name), 1);
        this.modal2 = false;
      },
      itemAdd(type) {
        if (type === 2) {
          if (this.policyItem!="") {
            this.editmainData.policyId.push(this.policyItem);
            this.$Notice.success({
              title: '添加成功！'
            });
            this.modal2= false;
            this.lawItem = '';
          } else {
            this.$Notice.error({
              title: '添加失败！不能为空！'
            });
          }
          ;
        } else if (type === 5) {
           if (this.specialItem) {
            this.editmainData.specialId.push(this.specialItem);
            this.$Notice.success({
              title: '添加成功！'
            });
            this.modal5= false;
            this.specialItem = '';
          } else {
            this.$Notice.error({
              title: '添加失败！不能为空！'
            });
          }
        } else if (type === 6) {
          if (this.newsItem) {
            this.editmainData.newsId.push(this.newsItem);
            this.$Notice.success({
              title: '添加成功！'
            });
            this.modal6= false;
            this.newsItem = '';
          } else {
            this.$Notice.error({
              title: '添加失败！不能为空！'
            });
          }
        }else {
          if (this.lawItem) {
            this.editmainData.lawId.push(this.lawItem);
            this.$Notice.success({
              title: '添加成功！'
            });
            this.modal4 = false;
            this.lawItem = '';
          } else {
            this.$Notice.error({
              title: '添加失败！不能为空！'
            });
          }
        }
      },
      handleClose (event, name) {
        const index = this.editmainData.pictures.indexOf(name);
        this.editmainData.pictures.splice(index, 1);
      },
      createNewTag () {
        if (this.newTagName.length !== 0&&this.addingNewTag) {
          this.editmainData.pictures.push(this.newTagName);
          this.addingNewTag = false;
        } 
        if (this.newTagName.length !== 0&&this.addingNewLaw) {
          this.editmainData.lawId.push(this.newTagName);
          this.addingNewLaw = false;
        } 

        this.newTagName = "";
      },
      handleAdd () {
          console.log("111:"+ this.editmainData.pictures)
        this.addingNewTag = !this.addingNewTag;
      },
      cancelCreateNewTag () {
        this.newTagName = '';
        this.addingNewTag = false;
        this.addingNewLaw = false;
      },
      delSum() {
        this.$http.delete('/' + this.$data.dataName + '/all', {data: this.idAry}).then((res) => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.getData();
        });
      },
      updateEditor() {
        this.$http.post('/' + this.$data.dataName + '/update', this.$data.editmainData).then(() => {
          this.$Notice.success({
            title: '修改成功'
          });
          this.freshData();
        });
      },
      addEditor() {
        this.addData.pictures = this.pictures.split(',');
        this.addData.lawId = this.laws.split(',');
        this.addData.policyId = this.policys.split(',');
        this.addData.specialId = this.specials.split(',');
        this.addData.newsId = this.newss.split(',');
        let newObj = JSON.parse(JSON.stringify(this.addData));
        this.$http.put('/' + this.$data.dataName, newObj).then(() => {
          this.$Notice.success({
            title: '添加成功'
          });
          this.getData();
        });
      },
      freshData() {
        this.filterData.page.pageNumber = 1;
        this.filterData.title=null;
        this.getData();
        this.searchDataSearching = false;
      },
      deleteOk () {
          this.$http.delete('/' + this.$data.dataName + '/' + this.deleteParems).then(() => {
              this.$Notice.success({
                  title: '删除成功',
              });
              this.freshData();
          });
      },
      cancelDelete () {
          this.deleteConfirm = false;
      },
      searchClick() {
        this.$http.get('/' + this.$data.dataName + '/get/' + this.$data.searchName).then((res) => {
          if (res && res.toString()) {
            this.$Notice.success({
              title: '查询成功'
            });
            if (res.valid) {
              res.valid = res.valid.replace(/\s*$/, '');
            }
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
        this.getData(0);
      },
      setPageSize(val) {
        this.$data.filterData.page.pageSize = val;
        this.getData(document.getElementsByClassName('single-page-con')[0].scrollTop);
      },
      viewLaw(val) {
        //  查看文件
        this.modal1 = true;
        this.specialDetail = val;
        this.specialDetail.createTime = formatFullDate(this.specialDetail.createTime);
        this.specialDetail.updateTime = formatFullDate(this.specialDetail.updateTime);
      },
      views(data) {
        this.modal3 = true;
        this.viewDate = data;
      },
      viewPictures(data) {
        this.pictureDate = data;
        this.see=true
      },
      next() {
            if (this.nowIndex == this.pictureDate.length - 1) {
                this.$Message.warning('已到达最后一张');
            } else {
                this.nowIndex++;
            }
      },
      prev() {
          if (this.nowIndex == 0) {
              this.$Message.warning('已到达第一张');
          } else {
              this.nowIndex--;
          }
      },
      type(index) {
          if (index == this.nowIndex) {
              return 'media-center'
          } else if (index - this.nowIndex == 1) {
              return 'media-right'
          } else if (index - this.nowIndex == -1) {
              return 'media-left'
          } else {
              return 'media-hide'
          }
      },
      isImg(item) {
        //   var ext = item.substr(item.length - 3, 3);
        //   var flag = ext == ('jpg' || 'png' || 'gif') ? true : false;
        //   return flag;
        return true;
      },
      toggle(index) {
          if (index - this.nowIndex == 1) {
              this.nowIndex++;
          } else if (index - this.nowIndex == -1) {
              this.nowIndex--;
          }
      },
      close() {
          this.$data.see=false;
          this.nowIndex = 0;
      },
      changeTabs(data) {
        //  改变tabs标签页的显示
        this.tabName = 1;
        //  将原有的数据填充到表单中，便于修改
        this.$data.editmainData = data;
        this.$data.editmainData.lawId = data.law.map(val => {return val.id; });
        this.$data.editmainData.policyId = data.policy.map(val => {return val.id; });
        this.$data.editmainData.specialId = data.special.map(val => {return val.id; });
        this.$data.editmainData.newsId = data.news.map(val => {return val.id; });
      },
      selectAry(selection) {
        this.idAry = selection.map(val => {
          return val.id;
        });
      }
    },
    computed: {
      seeMedia() {
          return this.$data.see;
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
    .tablePadding {
        padding: 4px 0;
    }
    .fooo {
        font-size: 14px;
        width: 220px;
    }
    .media-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 80%;
    background: rgba(0, 0, 0, 0.52);
    z-index: 1010;
    i {
        color: #fff
    }
    .media-controller {
        position: absolute;
        left: 50%;
        bottom: 30px;
        transform: translateX(-50%)
    }
    .media-close {
        position: absolute;
        right: 5px;
        top: 5px;
        i {
            font-size: 30px;
        }
    }
    .media-content {
        div {
            position: absolute;
            top: 50%; // background: green;
            color: #fff;
            text-align: center;
            font-size: 30px;
            transition: all .56s ease;
            img {
                max-width: 100%;
                max-height: 100%
            }
            video {
                width: 100%;
            }
        }
        .media-center {
            height: 50%;
            width: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1011;
        }
        .media-left,
        .media-right {
            width: 25%;
            height: 35%;
            filter: grayscale(90%);
        }
        .media-right {
            left: 100%;
            transform: translate(-105%, -50%);
        }
        .media-left {
            left: 0;
            transform: translate(5%, -50%);
        }
        .media-hide {
            height: 0;
            width: 0;
            left: 50%;
            z-index: 1010;
            opacity: 0;
        }
    }
}
</style>
