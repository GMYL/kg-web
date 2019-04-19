<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        站内信
                    </p>
                    <div slot="extra">
                        <Button type="success" @click="modelShowUpdate=true">
                            <Icon type="paper-airplane"></Icon>
                            发送站内信
                        </Button>
                        <Button type="primary" shape="circle" @click="freshData">
                            <Icon type="ios-loop-strong"></Icon>
                            刷新
                        </Button>
                    </div>
                    <div class="filterTool">
                        <div class="toolBar">
                            <ButtonGroup>
                                <Button @click="getInOrOutMailBox('all')"
                                        :type="pickButtonColor.all">全部
                                </Button>
                                <Button @click="getInOrOutMailBox('to')"
                                        :type="pickButtonColor.to">收件箱
                                </Button>
                                <Button @click="getInOrOutMailBox('from')"
                                        :type="pickButtonColor.from">发件箱
                                </Button>
                                <Button @click="getInOrOutMailBox('delete')"
                                        :type="pickButtonColor.delete">已删除
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <div>
                        <Table :columns="mainColumns" :data="mainData"></Table>
                        <Page :total="filterData.page.totalSize" @on-change="getPageData"
                              @on-page-size-change="setPageSize" show-sizer :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                    </div>
                </Card>
                <Modal v-model="modelShowView" title="详情" width="600">
                    <h2>{{ modelShowData.title }}</h2>
                    <div>{{ modelShowData.content }}</div>
                </Modal>
                <Modal v-model="modelShowUpdate" title="发送站内信" width="1000" @on-ok="postSiteMail">
                    <Row>
                        <i-col span="12">
                            <h2>内容：</h2>
                            <Form :model="modelSendMail" label-position="left" :label-width="100">
                                <FormItem label="收件人">
                                  <!-- <Tag
                                    v-for="item in modelSendMail.idList"
                                    :key="item"
                                    :name="item"
                                    type="dot"
                                    color="blue"
                                    closable
                                    @on-close="upTagClose"
                                  >{{item}}</Tag>
                                    <Input v-model="modelSendMail.to"></Input> -->


                                  <div style="margin-bottom: 5px">
                                    <Input
                                      v-model="modelSendMail.to"
                                      placeholder="收件人id"
                                      :maxlength="15"
                                      style="width: 200px"
                                    />
                                    <Button type="info" @click="upTagAdd">
                                      <Icon type="plus"></Icon>&nbsp;添加
                                    </Button>
                                  </div>
                                  <Tag
                                    v-for="item in modelSendMail.idList"
                                    :key="item"
                                    :name="item"
                                    type="dot"
                                    color="blue"
                                    closable
                                    @on-close="upTagClose"
                                  >{{item}}</Tag>
                                  <br v-if="modelSendMail.idList.length > 0">

                                </FormItem>
                                <FormItem label="邮件标题">
                                    <Input v-model="modelSendMail.title"></Input>
                                </FormItem>
                                <FormItem label="内容">
                                    <Input type="textarea" v-model="modelSendMail.content"></Input>
                                </FormItem>
                            </Form>
                        </i-col>
                        <i-col span="12">
                            <h2>接收人：</h2>
                            <Table :columns="adminColumns" :data="alladmins"
                                   @on-row-click="setModelSendMailTo"></Table>
                        </i-col>
                    </Row>
                </Modal>
            </i-col>
        </i-col>
    </Row>
</template>
<script>
  import {formatFullDate} from '@/libs/filters';
  import {mapGetters} from 'vuex';

  export default {
    data() {
      let getButtonGroup = (h, params) => {
        let buttonGroup = [
          h('Button', {
            props: {type: 'success', size: 'small'},
            style: {marginRight: '5px'},
            on: {
              click: () => {
                this.modelShowData = params.row;
                this.modelShowView = true;
                if (params.row.to!=null&&params.row.to.id === this.user.id && !params.row.isRead) {
                  this.$http.get('/msg/sitemail/view/' + params.row.id).then(() => {
                    params.row.isRead = true;
                    this.$http.get('/msg/heartbeat/checklist', {}).then(res => {
                      if (res && res.msgs) {
                        this.$store.commit('set_msg', res.msgs);
                      }
                    });
                  });
                }
              }
            }
          }, '查看'),
          h('Button', {
            props: {type: 'error', size: 'small'},
            on: {
              click: () => {
                let postMsg = {
                  id: params.row.id,
                  to: {id: params.row.to && params.row.to.id && params.row.to.id === this.user.id ? this.user.id : null},
                  from: {id: params.row.from && params.row.from.id && params.row.from.id === this.user.id ? this.user.id : null}
                };
                this.$http.post('/msg/sitemail/fakedel', postMsg).then(() => {
                  this.$Message.success({
                    content: '删除成功'
                  });
                  this.getData();
                });
              }
            }
          }, '删除'),
          h('Button', {
            props: {type: 'success', size: 'small'},
            on: {
              click: () => {
                let postMsg = {
                  id: params.row.id,
                  toValid: params.row.to && params.row.to.id && params.row.to.id === this.user.id ? true : null,
                  fromValid: params.row.from && params.row.from.id && params.row.from.id === this.user.id ? true : null
                };
                this.$http.post('/msg/sitemail/update', postMsg).then(() => {
                  this.$Message.success({
                    content: '恢复成功'
                  });
                  this.getData();
                });
              }
            }
          }, '恢复'),
          h('Button', {
            props: {type: 'error', size: 'small'},
            on: {
              click: () => {
                this.$http.delete('/msg/sitemail/' + params.row.id).then(() => {
                  this.$Message.success({
                    content: '删除成功'
                  });
                  this.getData();
                });
              }
            }
          }, '彻底删除')
        ];
        let rsGroup = [buttonGroup[0]];
        switch (this.pickButtonSerie) {
          case 'all':
          case 'to':
          case 'from':
            rsGroup.push(buttonGroup[1]);
            break;
          case 'delete':
            rsGroup.push(buttonGroup[2]);
            rsGroup.push(buttonGroup[3]);
            break;
        }
        return rsGroup;
      };
      return {
        dataName: 'mail',
        mainColumns: [{
          title: '是否已读',
          width: 100,
          key: 'isRead',
          render: (h, params) => {
            if (params.row.isRead) {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '已读');
            } else {
              return h('Tag', {
                props: {
                  color: 'yellow'
                }
              }, '未读');
            }
          }
        },{
            title: '序号',
            type: 'index',
            align: 'center',
            width: 80
        },{
          title: '发信人',
          key: 'from',
          width: 160,
          render: (h, params) => {
            if (params.row.from) {
              return h('div',params.row.from.trueName ? params.row.from.trueName : params.row.from.userName);
            }
          }
        }, {
          title: '收信人',
          key: 'to',
          width: 160,
          render: (h, params) => {
            if (params.row.to) {
              return h('div',params.row.to.nickName ? params.row.to.nickName : params.row.to.userName);
            }
          }
        }, {
          title: '发送时间',
          key: 'createTime',
          width: 210,
          render: (h, params) => {
            if (params.row.createTime) {
              return h('div', formatFullDate(params.row.createTime));
            } else {
              return '-';
            }
          }
        }, {
          title: '标题',
          key: 'title'
        },{
          title: '内容',
          key: 'content',
          ellipsis: true
        }, {
          title: '操作',
          key: 'action',
          width: 220,
          align: 'center',
          render: (h, params) => {
            return h('div', getButtonGroup(h, params));
          }
        }],
        mainData: [],
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          }
        },
        pickButtonColor: {
          all: 'primary',
          to: 'ghost',
          from: 'ghost',
          delete: 'ghost'
        },
        pickButtonSerie: 'all',
        modelShowView: false,
        modelShowUpdate: false,
        modelShowData: {},
        modelSendMail: {
          from: '',
          to: '',
          title: '',
          content: '',
          idList: []
        },
        addingNewTag: false,
        newTagName: '',
        adminColumns: [{
          title: '编号',
          key: 'id'
        }, {
          title: '姓名',
          key: 'trueName'
        }, {
          title: '用户名',
          key: 'userName'
        }]
      };
    },
    computed: {
      ...mapGetters(['alladmins', 'user'])
    },
    methods: {
      getInOrOutMailBox(pick) {
        this.pickButtonColor = {
          all: 'ghost',
          to: 'ghost',
          from: 'ghost',
          delete: 'ghost'
        };
        this.pickButtonSerie = pick;
        switch (pick) {
          case 'all':
            this.filterData = {
              page: {
                pageNumber: 1,
                totalSize: 0,
                pageSize: 10
              }
            };
            this.pickButtonColor.all = 'primary';
            break;
          case 'to':
            this.filterData = {
              page: {
                pageNumber: 1,
                totalSize: 0,
                pageSize: 10
              },
              to: {id: this.$store.getters.user.id}
            };
            this.pickButtonColor.to = 'primary';
            break;
          case 'from':
            this.filterData = {
              page: {
                pageNumber: 1,
                totalSize: 0,
                pageSize: 10
              },
              from: {id: this.$store.getters.user.id}
            };
            this.pickButtonColor.from = 'primary';
            break;
          case 'delete':
            this.filterData = {
              page: {
                pageNumber: 1,
                totalSize: 0,
                pageSize: 10
              },
              fromValid: false,
              toValid: false
            };
            this.pickButtonColor.delete = 'primary';
            break;
        }
        this.getData();
      },
      getData() {
        this.$http.post('/msg/sitemail/load', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.totalPage = res.totalPage;
          this.$Notice.success({
            title: '已获取最新数据',
            duration: 1
          });
        });
      },
      freshData() {
        this.getData();
      },
      setModelSendMailTo(val) {
        this.modelSendMail.to = val.id;
      },
      postSiteMail() {
        let postMsg = {
          from: {id: this.user.id},
          idList: this.modelSendMail.idList,
          title: this.modelSendMail.title,
          content: this.modelSendMail.content
        };
        this.$http.post('/msg/sitemail/sendAll', postMsg).then(() => {
          this.$Notice.success({
            title: '发送站内信成功'
          });
          this.modelSendMail = {
            from: '',
            to: '',
            idList: [],
            title: '',
            content: ''
          };
          this.getData();
        });
      },
      cancelCreateNewTag() {
        this.newTagName = '';
        this.addingNewTag = false;
      },
      handleClose(event, name) {
        const index = this.modelShowData.items.indexOf(name);
        this.modelShowData.items.splice(index, 1);
      },
      getPageData(val) {
        this.$data.filterData.page.pageNumber = val;
        this.getData();
      },
      setPageSize(val) {
        this.$data.filterData.page.pageSize = val;
        this.getData();
      },
      upTagAdd() {
        var item = this.modelSendMail.to;

        for (var i in this.modelSendMail.idList) {
          if (item === this.modelSendMail.idList[i]) {
            this.$Message.warning("重复添加");
            return;
          }
        }

        if (item == null || item == "") {
          this.$Message.warning("内容不能为空");
          return;
        }

        this.modelSendMail.idList.push(item);
        this.modelSendMail.to = "";
      },
      upTagClose(event, name) {
        for (var i in this.modelSendMail.idList) {
          if (this.modelSendMail.idList[i] == name) {
            this.modelSendMail.idList.splice(i, 1);
            return;
          }
        }
    }
    },
    created() {
    },
    mounted() {
      this.getData();
    }
  };
</script>

<style lang="less" scoped>
</style>
