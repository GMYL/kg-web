<!--扩展词库上传-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col v-if="mainData.length > 0" span="24" style="margin-bottom: 16px;">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        上传扩展词典
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
                              @on-page-size-change="setPageSize" show-sizer :page-size="200" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
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
                    <div>
                        选择上传类型：
                        <Select v-model="type" style="width:220px" clearable placeholder="请选择">
                            <Option value="问答">问答</Option>
                            <Option value="法规" >法规</Option>
                            <Option value="文章">文章</Option>
                        </Select>
                    </div>

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
        <!--<Modal v-model="modelShowView" title="预览" width="1000">-->
            <!--<Row>-->
                <!--<i-col span="12">-->
                    <!--<h2>内容：</h2>-->
                    <!--<Form :model="modelShowData.srcBean" label-position="left" :label-width="100">-->
                        <!--<FormItem label="编号">-->
                            <!--<div v-html="modelShowData.srcBean.id"></div>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="类型">-->
                            <!--<div v-html="modelShowData.srcBean.type"></div>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="扩展词">-->
                            <!--<div v-html="modelShowData.srcBean.word"></div>-->
                        <!--</FormItem>-->
                    <!--</Form>-->
                <!--</i-col>-->
            <!--</Row>-->
        <!--</Modal>-->
        <!--<Modal v-model="modelShowUpdate" title="修改" width="1000" @on-ok="postUpdate">-->
            <!--<Row>-->
                <!--<i-col span="12">-->
                    <!--<h2>内容：</h2>-->
                    <!--<Form :model="modelShowData.srcBean" label-position="left" :label-width="100">-->
                        <!--<FormItem label="编码">-->
                            <!--<Input v-model="modelShowData.srcBean.id"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="类型">-->
                            <!--<Input v-model="modelShowData.srcBean.type"/>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="标题">-->
                            <!--<Input type="textarea" v-model="modelShowData.srcBean.word"/>-->
                        <!--</FormItem>-->
                    <!--</Form>-->
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
        dataName: 'dict_upload',
        mainColumns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        },{
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
        }, {
          title: '编号',
          width: 100,
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.srcBean.id);
            }
          }
        }, {
          title: '类型',
          width: 100,
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.excelType);
            }
          }
        }, {
          title: '扩展词语',
          render: (h, params) => {
            if (params.row.srcBean) {
              return h('span', params.row.srcBean.word);
            }
          }
        }, {
            title: '词语权重',
            render: (h, params) => {
                if (params.row.srcBean) {
                    return h('span', params.row.srcBean.weight);
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
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                  on: {
                      click: () => {
                          this.$http.delete('/excel/dict/' + params.row.id).then(() => {
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
    methods: {
      handleSelectAll (status) {
          //  全选
        this.$refs.selection.selectAll(status);
      },
      handleUpload (file) {
          //  上传文件之前的钩子，参数为上传的文件
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
        this.$http.post('/excel/dict/confirm', head).then(res => {
          this.$Notice.error({
            title: '删除成功'
          });
          this.getFresh();
        });
      },
      handleSelectSubmit () {
          //  提交选中的词
        let postMsg = {
          key: 'confirm-and-delete',
          value: this.chaceAry.length > 0 ? this.chaceAry.map(item => item.id) : []
        };
        this.$http.post('/excel/dict/confirm', postMsg).then(res => {
          this.$Notice.success({
            title: '上传成功'
          });
          this.getFresh();
        });
      },
      upload () {
          //  上传到临时文件，预览列表中
        if (this.type) {
          this.loadingStatus = true;
          let formData = new FormData();
          formData.append('file', this.uploadFile);
          let lawType = encodeURI(this.type);
          let config = {headers: {'Content-Type': 'multipart/form-data', 'excel-type': lawType}};
          this.$http.post('/excel/dict/upload', formData, config).then(res => {
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
        } else {
          this.$Notice.error({
            title: '请选择分类'
          });
        }
      },
      getData () {
          //  定义获取数据的参数
        this.filterData = {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 200
          }
        };
        this.getFresh();
      },
      getFresh () {
          //  获取临时预览的文件
        this.$http.post('/excel/dict/query', this.$data.filterData).then(res => {
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
      // handleAdd () {
      //   this.addingNewTag = !this.addingNewTag;
      // },
      // postUpdate () {
      //   this.$http.put('/dict', this.modelShowData.srcBean).then(() => {
      //     this.$http.delete('/excel/dict/' + this.modelShowData.id).then(() => {
      //       this.$Notice.success({
      //         title: '添加标准库成功'
      //       });
      //     });
      //   });
      // },
      // cancelCreateNewTag () {
      //   this.newTagName = '';
      //   this.addingNewTag = false;
      // },
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
    mounted () {
      this.getData();
    }
  };
</script>

<style lang="less" scoped>
</style>
