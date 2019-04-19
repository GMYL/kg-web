<!--文章上传-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col v-if="mainData.length > 0" span="24" style="margin-bottom: 16px;">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        上传文章
                    </p>
                    <div slot="extra">
                        <Button type="ghost" @click="handleSelectAll(true)">设置全选</Button>
                        <Button type="ghost" @click="handleSelectAll(false)">取消全选</Button>
                        <Button type="warning" @click="handleSelectSubmit">批量提交</Button>
                        <Button type="error" @click="handleSelectDel">批量删除</Button>
                        <Button type="primary" shape="circle" @click="getFresh">
                            <Icon type="ios-loop-strong"></Icon>
                            刷新
                        </Button>
                    </div>
                    <div>
                        <Table border ref="selection" :columns="mainColumns" :data="mainData" @on-selection-change="chaceAryFn" highlight-row></Table>
                        <br/>
                        <Page v-show="filterData.page.totalSize > 10" :total="filterData.page.totalSize" @on-change="getPageData"
                              @on-page-size-change="setPageSize" show-sizer :page-size="100" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                    </div>
                </Card>
            </i-col>
            <i-col span="6">
                <Card>
                    <!--<p slot="title">-->
                        <!--<Icon type="navicon-round"></Icon>-->
                        <!--请选择操作-->
                    <!--</p>-->
                    <p>注意：上传的内容请及时处理</p><br>
                    <!--<div>-->
                        <!--选择上传类型：-->
                        <!--<Select v-model="type" style="width:260px">-->
                            <!--<Option v-for="item in getItemType" :value="item" :key="item">{{ item }}</Option>-->
                        <!--</Select>-->
                    <!--</div>-->
                    <Upload
                            type="drag"
                            :before-upload="handleUpload"
                            action="upload">
                        <!--<Button type="success" icon="ios-cloud-upload-outline">选择要上传的文件</Button>-->
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或者拖拽文件上传</p>
                        </div>
                    </Upload>
                    <div v-if="uploadFile !== null">您选择的文件: {{ uploadFile.name }}
                        <Button type="warning" @click="upload" :loading="loadingStatus">
                            {{ loadingStatus ? '上传中' : '确认上传' }}
                        </Button>
                    </div>
                </Card>
            </i-col>
        </i-col>
        <Modal v-model="modelShowView" title="预览" width="1000">
            <Row>
                <i-col span="17">
                    <Form :model="modelShowData.srcBean" label-position="left" :label-width="100">
                        <FormItem label="编号">
                            <div v-html="modelShowData.srcBean.id"></div>
                        </FormItem>
                        <FormItem label="标题">
                            <div v-html="modelShowData.srcBean.title"></div>
                        </FormItem>
                        <FormItem label="作者">
                            <div v-html="modelShowData.srcBean.articleauthor"></div>
                        </FormItem>
                        <FormItem label="发文日期">
                            <div v-html="modelShowData.srcBean.date"></div>
                        </FormItem>
                        <FormItem label="来源">
                            <div v-html="modelShowData.srcBean.source"></div>
                        </FormItem>
                        <FormItem label="文章分类">
                            <Tag v-for="item in modelShowData.srcBean.categorys" :key="item" :name="item">{{ item }}</Tag>
                        </FormItem>
                        <FormItem label="备注标签">
                            <div v-html="modelShowData.srcBean.labelother"></div>
                        </FormItem>
                        <FormItem label="摘要">
                            <div v-html="modelShowData.srcBean.summary"></div>
                        </FormItem>
                        <FormItem label="内容">
                            <textarea readonly style="font-size: 14px;height: 900px;width: 850px " v-html="modelShowData.srcBean.content"></textarea>
                            <!-- <div v-html="modelShowData.srcBean.content"></div> -->
                        </FormItem>
                    </Form>
                </i-col>
            </Row>
        </Modal>
        <!--<Modal v-model="modelShowUpdate" title="修改" width="1000" @on-ok="postUpdate">-->
            <!--<Row>-->
                <!--<i-col span="12">-->
                    <!--<h2>内容：</h2>-->
                    <!--<Form :model="modelShowData.srcBean" label-position="left" :label-width="100">-->
                        <!--<FormItem label="标题">-->
                            <!--<Input type="textarea" v-model="modelShowData.srcBean.title"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="作者">-->
                            <!--<Input v-model="modelShowData.srcBean.articleauthor"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="发文日期">-->
                            <!--<Input v-model="modelShowData.srcBean.date"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="来源">-->
                            <!--<Input v-model="modelShowData.srcBean.source"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="文章分类">-->
                            <!--<Tag v-for="item in modelShowData.srcBean.categorys" :key="item" :name="item" closable-->
                                 <!--@on-close="handleClose">{{ item }}-->
                            <!--</Tag>-->
                            <!--<Button v-show="!addingNewTag" icon="ios-plus-empty" type="dashed" size="small"-->
                                    <!--@click="handleAdd">添加分类-->
                            <!--</Button>-->
                            <!--<transition name="add-new-tag">-->
                                <!--<div v-show="addingNewTag">-->
                                    <!--<i-col span="14">-->
                                        <!--<Input v-model="newTagName" placeholder="请输入分类"/>-->
                                    <!--</i-col>-->
                                    <!--<i-col span="5" class="padding-left-10">-->
                                        <!--<Button @click="createNewTag" long type="primary">确定</Button>-->
                                    <!--</i-col>-->
                                    <!--<i-col span="5" class="padding-left-10">-->
                                        <!--<Button @click="cancelCreateNewTag" long type="ghost">取消</Button>-->
                                    <!--</i-col>-->
                                <!--</div>-->
                            <!--</transition>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="内容">-->
                            <!--<Input type="textarea" :autosize="{minRows: 10}"-->
                                   <!--v-model="modelShowData.srcBean.content"></Input>-->
                        <!--</FormItem>-->
                    <!--</Form>-->
                <!--</i-col>-->
                <!--<i-col span="12">-->
                    <!--<h2>摘要：</h2>-->
                    <!--<div v-html="modelShowData.srcBean.summary"></div>-->
                <!--</i-col>-->
            <!--</Row>-->
        <!--</Modal>-->
    </Row>
</template>
<script>
  import {formatFullDate} from '@/libs/filters';


  export default {
    data () {
      return {
        dataName: 'questand_upload',
        mainColumns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '编号',
          width: 100,
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.srcBean.id);
            }
          }
        },{
            title: '标题',
            render: (h, params) => {
                if (params.row.srcBean) {
                    return h('span', params.row.srcBean.title);
                }
            }
        },  {
          title: '作者',
          width: 100,
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.srcBean.articleauthor);
            }
          }
        }, {
          title: '发文日期',
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.srcBean.date);
            }
          }
        }, {
            title: '来源',
            width: 100,
            render: (h, params) => {
                if (params.row.srcBean) {
                    return h('span', params.row.srcBean.source);
                }
            }
        }, {
            title: '摘要',
            render: (h, params) => {
                if (params.row.srcBean) {
                    return h('span', params.row.srcBean.summary.slice(0,20)+"...");
                }
            }
        },{
          title: '文章类型',
          render: (h, params) => {
            if (params.row.srcBean) {
              return params.row.srcBean.categorys.map(item => {
                return h('Tag', item);
              });
            }
          }
        },  {
            title: '备注标签',
            render: (h, params) => {
                if (params.row.srcBean) {
                    return h('span', params.row.srcBean.labelother);
                }
            }
        },{
          title: '上传时间',
          width: 110,
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', formatFullDate(params.row.createTime));
            }
          }
        }, {
          title: '操作',
          key: 'action',
          width: 170,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'success',
              //     size: 'small'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       if (params.row.srcBean) {
              //         this.modelShowData = JSON.parse(JSON.stringify((params.row)));
              //         this.loadLawItems(params.row.srcBean.items, 'a');
              //       } else {
              //         this.$Notice.error({
              //           title: '数据不完整'
              //         });
              //       }
              //     }
              //   }
              // }, '查看'),
                h('Button', {
                    props: {
                        type: 'success',
                        size: 'small'
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
              // h('Button', {
              //   props: {
              //     type: 'warning',
              //     size: 'small'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       if (params.row.srcBean) {
              //         this.modelShowData = JSON.parse(JSON.stringify(params.row));
              //         this.loadLawItems(params.row.srcBean.categorys, 'b');
              //       } else {
              //         this.$Notice.error({
              //           title: '数据不完整'
              //         });
              //       }
              //     }
              //   }
              // }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$http.delete('/excel/article/' + params.row.id).then(() => {
                      this.$Notice.success({
                        title: '删除成功'
                      });
                      this.getFresh();
                    });
                  }
                }
              }, '删除')
            ]);
          }
        }],
        uploadFile: null,
        loadingStatus: false,
        mainData: [],
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          },
          user: {
            id: this.$store.getters.user.id
          }
        },
        modelShowView: false,
        modelShowUpdate: false,
        modelShowData: {
          srcBean: {}
        },
        addingNewTag: false,
        newTagName: '',
        chaceAry: [], //  定义选中数组
        type: '' //  定义上传类型
      };
    },
    computed: {
      // getItemType () {
      //   let type = this.$store.state.type.itemType;
      //   return type.configure ? type.configure.category ? type.configure.category : [] : [];
      // }
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      handleUpload (file) {
        this.uploadFile = file;
        return false;
      },
      handleSelectDel () {
        let head = {
          key: 'only-delete',
          value: this.chaceAry.map(res => {
            return res.id;
          })
        };
        this.$http.post('/excel/article/confirm', head).then(res => {
          this.$Notice.error({
            title: '删除成功'
          });
          this.getFresh();
        });
      },
      handleSelectSubmit () {
        let postMsg = {
          key: 'confirm-and-delete',
          value: this.chaceAry.length > 0 ? this.chaceAry.map(item => item.id) : []
        };
        this.$http.post('/excel/article/confirm', postMsg).then(res => {
          this.$Notice.success({
            title: '上传成功'
          });
          this.getFresh();
        });
      },
      upload () {
        // if (this.type) {
          this.loadingStatus = true;
          let formData = new FormData();
          formData.append('file', this.uploadFile);
          let lawType = encodeURI(this.type);
          let config = {headers: {'Content-Type': 'multipart/form-data', 'excel-type': null}};
          this.$http.post('/excel/article/upload', formData, config).then(res => {
            if(res.length==0 || res.插入成功==0){
              this.$Notice.error({
                    title: '上传失败',
                    desc: res.失败行号 ? '失败行号：'+ res.失败行号 : '请检查excel格式:1、检查后缀',
                    duration: 0
            });
            }else{
              this.$Notice.success({
                title: '上传成功'
              });
            }
            this.type = '';
            this.loadingStatus = false;
            this.getData();
          });
        // } else {
        //   this.$Notice.error({
        //     title: '请选择分类'
        //   });
        // }
      },
      getData () {

        this.filterData = {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 100
          },
          user: {
            id: this.$store.getters.user.id
          }
        };
        this.getFresh();
      },
        views (data) {
            this.modelShowView = true;
            this.modelShowData = data;
        },
      getFresh () {
        this.$http.post('/excel/article/query', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.totalPage = res.totalPage;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      loadLawItems (lawitems, modalType) {
        if (lawitems) {
              this.$data.modelShowData.srcBean.categorys = lawitems;
            switch (modalType) {
              case 'a':
                this.$data.modelShowView = true;
                break;
              case 'b':
                this.$data.modelShowUpdate = true;
                break;
            }
          };

      },
      handleAdd () {
        this.addingNewTag = !this.addingNewTag;
      },
      createNewTag () {
        if (this.newTagName.length !== 0) {
          this.modelShowData.srcBean.categorys.push(this.newTagName);
          this.addingNewTag = false;
        } else {
          this.$Message.error('请输入文章分类');
        }
      },
      postUpdate () {
        this.$http.put('/questand', this.modelShowData.srcBean).then(() => {
          this.$http.delete('/excel/article/' + this.modelShowData.id).then(() => {
            this.$Notice.success({
              title: '添加成功'
            });
          });
        });
      },
      cancelCreateNewTag () {
        this.newTagName = '';
        this.addingNewTag = false;
      },
      handleClose (event, name) {
        const index = this.modelShowData.categorys.indexOf(name);
        this.modelShowData.categorys.splice(index, 1);
      },
      getPageData (val) {
        this.$data.filterData.page.pageNumber = val;
        this.getFresh();
      },
      setPageSize (val) {
        this.$data.filterData.page.pageSize = val;
        this.getFresh();
      },
      chaceAryFn (selection) {
        this.chaceAry = selection;
      }
    },
    // created () {
    //   //  判断是否加载过上传条款分类数据
    //   if (!this.$store.state.type.getItemType) {
    //     this.$store.dispatch('get_itemType');
    //   };
    // },
    mounted () {
      this.getData();
    }
  };
</script>

<style lang="less" scoped>
</style>
