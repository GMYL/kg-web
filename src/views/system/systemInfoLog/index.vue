<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        Nginx日志
                    </p>
                    <div class="change">日志条数：&emsp;
                        <Select v-model="param.tail" style="width:200px" placeholder="日志条数" @on-change="getData">
                            <Option v-for="item in logNum" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                        &emsp;&emsp;日志名称:&emsp;
                        <Select v-model="param.name" style="width:200px" placeholder="日志名称" @on-change="getData">
                            <Option v-for="item in logType" :value="item.value" :key="item.value">{{ item.value }}
                            </Option>
                        </Select>
                    </div>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <div v-for="i in esStatus">{{i}}</div>
                </Card>
            </i-col>
        </i-col>
    </Row>
</template>

<script>
  import {formatDate} from '@/libs/filters';
  import {mapGetters} from 'vuex';

  export default {
    components: {},
    data() {
      return {
        dataName: 'search',
        esStatus: [],
        logNum: [100, 200, 300, 400, 500],
        logType: [
          {
            value: 'admin',
            label: 'admin'
          },
          {
            value: 'academy',
            label: 'academy'
          },
          {
            value: 'about',
            label: 'about'
          },
          {
            value: 'download',
            label: 'download'
          }, {
            value: 'downloads',
            label: 'downloads'
          },
          {
            value: 'enterprise',
            label: 'enterprise'
          },
          {
            value: 'images',
            label: 'images'
          }, {
            value: 'index',
            label: 'index'
          }, {
            value: 'passport',
            label: 'passport'
          }, {
            value: 'laws',
            label: 'laws'
          }, {
            value: 'platform',
            label: 'platform'
          },
          {
            value: 'share',
            label: 'share'
          },
          {
            value: 'soft',
            label: 'soft'
          }, {
            value: 'tax',
            label: 'tax'
          }
        ],
        param: {
          tail: 100,
          name: 'admin'
        }
      };
    },
    computed: {
      ...mapGetters([
        'esMachines'
      ])
    },
    methods: {
      getData() {
        this.$http.get('/system/info/logTail', {params: this.param}).then(res => {
          if (res) {
            this.esStatus = res;
            this.$Notice.success({
              title: '已获取最新数据'
            });
          }
        });
      },
      freshData() {
        this.getData();
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
    .change {
        position: absolute;
        top: 10px;
        left: 100px;
    }
</style>
