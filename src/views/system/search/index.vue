<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        搜索引擎管理
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <Form :label-width="150">
                        <FormItem label="获取时间" class="edit-form-item">
                            <div class="preview-content-con" v-html="esStatus.fetch_time"></div>
                        </FormItem>
                        <FormItem label="集群名称" class="edit-form-item">
                            <div class="preview-content-con" v-html="esStatus.cluster_name"></div>
                        </FormItem>
                        <FormItem label="集群狀況" class="edit-form-item">
                            <div v-html="esStatus.status"></div>
                        </FormItem>
                        <FormItem label="集群主机数" class="edit-form-item">
                            <div v-html="esStatus.number_of_nodes"></div>
                        </FormItem>
                        <FormItem label="数据主机数" class="edit-form-item">
                            <div v-html="esStatus.active_primary_shards"></div>
                        </FormItem>
                        <FormItem label="活动分片总数" class="edit-form-item">
                            <div v-html="esStatus.active_shards"></div>
                        </FormItem>
                        <FormItem label="活动主分片总数" class="edit-form-item">
                            <div v-html="esStatus.active_primary_shards"></div>
                        </FormItem>
                        <FormItem label="活动分片占比" class="edit-form-item">
                            <div v-html="esStatus.active_shards_percent_as_number"></div>
                        </FormItem>
                        <FormItem label="索引" class="edit-form-item">
                            <Table :columns="indiceColumn" :data="esStatus.indiceList" size="small"></Table>
                        </FormItem>
                    </Form>
                </Card>
            </i-col>
        </i-col>
    </Row>
</template>

<script>
  import {formatDate, formatFullDate} from '@/libs/filters';
  import {mapGetters} from 'vuex';

  export default {
    components: {},
    data() {
      return {
        dataName: 'search',
        indiceColumn: [{
          title: '分区名',
          key: 'id'
        }, {
          title: '分区状况',
          key: 'status'
        }, {
          title: '总分片数',
          key: 'number_of_shards'
        }, {
          title: '校验分片数',
          key: 'number_of_replicas'
        }, {
          title: '主分片数',
          key: 'active_primary_shards'
        }, {
          title: '活动分片数',
          key: 'active_shards'
        }],
        esStatus: ''
      };
    },
    computed: {
      ...mapGetters([
        'esMachines'
      ])
    },
    methods: {
      getData() {
        this.$http.get('/esstatus/health').then(res => {
          if (res) {
            this.esStatus = res;
            this.esStatus.fetch_time = formatFullDate(new Date());
            if (this.esStatus && this.esStatus.indices) {
              let indiceList = [];
              for (let indice in this.esStatus.indices) {
                this.esStatus.indices[indice].id = indice;
                indiceList.push(this.esStatus.indices[indice]);
              }
              this.esStatus.indiceList = indiceList;
            }
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
</style>
