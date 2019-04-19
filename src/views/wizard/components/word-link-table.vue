<template>
    <div>
        <Table :columns="mainColumns" :data="mainData" size="small"></Table>
    </div>
</template>
<script>
  export default {
    name: 'word-link-table',
    components: {},
    props: ['mainnode', 'closemodal'],
    data() {
      return {
        mainData: [],
        mainColumns: [{
          title: '编号',
          key: 'id'
        }, {
          title: '起点',
          key: 'start'
        }, {
          title: '终点',
          key: 'end'
        }, {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            let that = params.row;
            return h('RadioGroup', {
              props: {
                value: params.row.type
              },
              on: {
                input: function (event) {
                  that.type = event;
                }
              }
            }, [
              h('Radio', {
                props: {
                  label: "synonym"
                }
              }),
              h('Radio', {
                props: {
                  label: "parent"
                }
              })
            ]);
          }
        }, {
          title: '权重',
          key: 'weight',
          render: (h, params) => {
            let that = params.row;
            return h('div', [
              h('InputNumber', {
                props: {
                  max: 1.5,
                  min: 0,
                  step: 0.1,
                  value: params.row.weight
                },
                on: {
                  input: function (event) {
                    that.weight = event;
                  }
                }
              })
            ]);
          }
        }, {
          title: '操作',
          key: 'action',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  shape: 'circle',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.deleteLink(params.row);
                  }
                }
              }, '删除'),
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
                    this.updateLink(params.row);
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  shape: 'circle'
                },
                on: {
                  click: () => {
                    this.reverseLink(params.row);
                  }
                }
              }, '转置'),
            ]);
          }
        }]
      };
    },
    computed: {},
    methods: {
      getData() {
        this.$http.get('/wizard/node/getNodeAndLinksById', {
          params: {
            id: this.mainnode.id,
            level: 1
          }
        }).then(res => {
          // res.data.forEach(word => {
          //   this.revNodes[word.id] = word;
          // });
          this.mainData = res.links;
        });
      },
      deleteLink(row) {
        if (row) {
          this.$http.delete('/wizard/link/' + row.id).then(() => {
            this.$Notice.success({
              title: '删除成功',
            });
            this.getData();
          }, err => {
            this.$Notice.error({
              title: '删除失败',
              desc: err
            });
          });
        }
      },
      updateLink(row) {
        if (row) {
          this.$http.post('/wizard/link/update', row).then(() => {
            this.$Notice.success({
              title: '修改成功',
            });
            this.getData();
          }, err => {
            this.$Notice.error({
              title: '修改失败',
              desc: err
            });
          });
        }
      },
      reverseLink(row) {
        if (row) {
          this.$http.get('/wizard/link/reverseLink/' + row.id).then((res) => {
            this.$Notice.success({
              title: '转置成功',
              desc: res
            });
            this.getData();
          }, err => {
            this.$Notice.error({
              title: '转置成功',
              desc: err
            });
          });
        }
      }
    },
    watch: {
      closemodal(newVal, oldVal) {
        if (newVal && (!oldVal)) {
          this.getData();
        }
      }
    },
    created() {
    },
    mounted() {
    }
  };
</script>
<style lang="less" scoped>
</style>
