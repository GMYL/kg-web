<template>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            备份文件管理
        </p>
        <Button slot="extra" type="success" shape="circle" @click="createTodayBackup">
            <Icon type="plus"></Icon>
            生成今日备份
        </Button>
        <Button slot="extra" type="primary" shape="circle" @click="getData">
            <Icon type="ios-loop-strong"></Icon>
            刷新
        </Button>
        <Table :columns="formHeader" :data="datas"></Table>
    </Card>
</template>

<script>
  import {formatFullDate} from '@/libs/filters';

  export default {
    data() {
      return {
        formHeader: [{
          title: '备份日期',
          key: 'filename'
        }, {
          title: '生成时间',
          key: 'lastModifyTime',
          render: (h, params) => {
            if (params.row.lastModifyTime) {
              return h('span', formatFullDate(params.row.lastModifyTime));
            }
          }
        }, {
          title: '备份文件大小',
          key: 'size'
        }, {
          title: '备份路径',
          key: 'loc'
        }, {
          title: '操作',
          key: 'action',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  shape: 'circle',
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "该过程不可逆！",
                      content: "警告！恢复数据库会删除当前的所有数据！并且该过程不可逆！除非你明白你在做什么否则不要点确认",
                      okText: '我完全了解恢复数据库的风险，并确认恢复数据库',
                      cancelText: '不需要进行数据库恢复',
                      onOk: () => {
                        this.$Modal.confirm({
                          title: "请再次确认",
                          content: "请再次确认您要进行数据库恢复操作",
                          okText: '我完全了解恢复数据库的风险，并确认恢复数据库',
                          cancelText: '不需要进行数据库恢复',
                          onOk: () => {
                            this.$http.get('/system/backup/reduction/' + params.row.filename).then(() => {
                              this.$Notice.success({
                                title: '还原成功'
                              });
                              this.getData();
                            });
                          }
                        });
                      }
                    });
                  }
                }
              }, '还原'),
              h('Button', {
                props: {
                  type: 'error',
                  shape: 'circle',
                },
                on: {
                  click: () => {
                    this.$Modal.warning({
                      title: "警告",
                      content: "删除后，备份将无法恢复",
                      okText: '确认删除',
                      onOk: () => {
                        this.$http.delete('/system/backup/' + params.row.filename).then(() => {
                          this.$Notice.success({
                            title: '删除成功'
                          });
                          this.getData();
                        });
                      },
                    });
                  }
                }
              }, '删除'),
            ]);
          }
        }
        ],
        datas: [], // 定义查询到的数据
      };
    },
    methods: {
      getData() {
        this.$http.get('/system/backup/list').then(res => {
          this.datas = res;
          this.$Message.success('已获取最新数据');
        });
      },
      createTodayBackup() {
        this.$Modal.confirm({
          title: "请确认生成今日备份",
          content: "生成过程大概需要1分钟左右，生成完毕后会有提示，过程中请不要再次点击，确认生成请点击确认",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.get('/system/backup/man/generate').then(res => {
              this.$Message.success('生成完毕' + res);
              this.getData();
            });
          },
            onCancel:()=>{
                this.$Modal.remove();
            }
        });
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>

</style>
