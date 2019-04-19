<template>
    <div>
        <Row>
            <i-col span="19" style="padding-right: 16px;">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        媒体列表
                    </p>
                    <Button slot="extra" type="success" shape="circle" @click="openUploadModal">
                        <Icon type="ios-cloud-upload-outline"></Icon>
                        上传文件
                    </Button>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新文件列表
                    </Button>
                    <Table :columns="columnsList" :data="downloadData" border></Table>
                    <Page v-show="filterData.page.totalSize > 10" :total="filterData.page.totalSize"
                                      @on-change="getPageData"
                                      @on-page-size-change="setPageSize" :current="filterData.page.pageNumber"
                                      class="pageTool" show-sizer :page-size="10" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                </Card>
            </i-col>
            <i-col span="5">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        条件查询
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
                            <Input v-model="searchData.filename"/>
                        </FormItem>
                        <FormItem label="上传时间">
                            <DatePicker v-model="searchData.listCreateTime" type="daterange" placement="bottom-start"
                                        placeholder="选择时间范围">
                            </DatePicker>
                        </FormItem>
                        <!--<FormItem label="上传人id">-->
                            <!--<Input v-model="searchData.author.id"/>-->
                        <!--</FormItem>-->
                        <FormItem label="文件后缀">
                            <Input v-model="searchData.filetype"/>
                        </FormItem>
                    </Form>
                </Card>
                <br/>
            </i-col>
            <Modal v-model="uploadDownloadModal" title="上传文件" cancel-text="" ok-text="关闭窗口" width="800"
                   :styles="{top:'50px'}" @on-ok="getFresh" @on-cancel="getFresh">
                <downloadUploader/>
            </Modal>
            <Modal v-model="editDownloadModal" title="修改信息" @on-ok="submitEditArticle">
                <Form :model="editDownloadData" label-position="left" :label-width="100">
                  <FormItem label="姓名">
                    <Input v-model="editDownloadData.filename" placeholder="标题"></Input>
                  </FormItem>
                  <FormItem label="后缀">
                    <Input v-model="editDownloadData.filetype" placeholder="后缀" disabled ></Input>
                  </FormItem>
                  <FormItem label="访问url">
                    <Input v-model="editDownloadData.url" placeholder="url" disabled ></Input>
                  </FormItem>
                  <FormItem label="文件大小">
                    <Input v-model="editDownloadData.size" placeholder="size" disabled ></Input>
                  </FormItem>
                  <FormItem label="上传者">
                    <Input v-model="editDownloadData.author.trueName" placeholder="上传者" disabled ></Input>
                  </FormItem>
                  </Form>
              </Modal>
        </Row>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {formatDate} from '@/libs/filters';
  import downloadUploader from '../components/download-uploader';

  export default {
    components: {downloadUploader},
    data() {
      return {
        columnsList: [{
          title: '标题（点击浏览/下载）',
          key: 'filename',
          width: 140,
          render: (h, params) => {
            if (params.row.filename) {
              return h('div', [
                h('a', {
                  attrs: {
                    target: '_blank'
                  },
                  on: {
                    click: () => {
                      var newTab = window.open('about:blank');
                      newTab.location = params.row.url;
                    }
                  }
                }, params.row.filename)
              ]);
            }
          }
        }, {
            title: '缩略图',
            key: 'url',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', [
                  h('img', {
                      style:{
                          width: "30px",
                          verticalAlign: "middle"
                      },
                      attrs:{
                          src:row.url
                      }
                  },)
              ]);
          }
        },{
            title: '访问url',
            key: 'url',
            align: 'center',
            width: 650,
        },{
            title: '上传时间',
            key: 'createTime',
            width: 110,
            render: (h, params) => {
                return h('span', formatDate(params.row.createTime));
            }
        },{
            title: '文件后缀',
            key: 'filetype',
            align: 'center',
            width: 75,
        },{
          title: '文件大小',
          align: 'center',
          width: 75,
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'dashed',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
              },
              params.row.size
            );
          }
        }, {
          title: '操作',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
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
        downloadData: [],
        editDownloadData: {
          author: {}
        },
        uploadDownloadModal: false,
        editDownloadUser: false,
        editDownloadModal: false,
        searchData: {
          id: null,
          filename: null,
          listCreateTime: null,
          author: {
            id: null
          }
        },
        searchDataSearching: false,
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          },
        }
      };
    },
    computed: {
    },
    methods: {
      openUploadModal() {
        this.uploadDownloadModal = true;
      },
      freshData() {
        this.filterData.page.pageNumber = 1;
        this.searchDataSearching = false;
        this.getFresh();
      },
      setCategory() {
        this.getData();
      },
      handleRemove(val) {
        this.$Modal.confirm({
          title: '确定要删除吗？',
          content: '<p>已删除的文件可以在回收站中找到</p>',
          onOk: () => {
            this.delete(val.id);
          }
        });
      },
      delete(downloadid) {
        this.$http.delete('/articlemedia/' + downloadid).then(() => {
          this.getData();
          this.$Notice.success({
            title: '删除文件成功',
          });
        });
      },
      handleEdit(val) {
        this.editDownloadData = val;
        this.editDownloadModal = true;
      },
      submitEditArticle() {
        this.$http.post('/articlemedia/update', this.editDownloadData).then(() => {
          this.$Notice.success({
            title: '修改文件成功',
          });
          this.getFresh();
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
        let postUrl = '/articlemedia/query';
        if (this.searchDataSearching) {
          postUrl = '/articlemedia/complexquery';
        }
        this.$http.post(postUrl, this.$data.filterData).then(res => {
          this.downloadData = res.list
          
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.pageSize = res.pageSize;
          this.$Notice.success({
            title: '已获取最新文件数据',
          });
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
      }
    },
    created() {
      this.getData();
    }
  };
</script>
<style lang="less">
</style>
