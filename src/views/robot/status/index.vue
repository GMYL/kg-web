<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        机器人工作状态
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <Form :label-width="150">
                        <FormItem label="获取时间" class="edit-form-item">
                            <div class="preview-content-con" v-html="robotStatus.fetch_time"></div>
                        </FormItem>
                        <FormItem label="机器人库内问答总数" class="edit-form-item">
                            <div class="preview-content-con" v-html="robotStatus.questionCount"></div>
                        </FormItem>
                        <FormItem label="最热10条问答" class="edit-form-item">
                            <Table :columns="indiceColumn" :data="robotStatus.top10" size="small"></Table>
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
          title: '编号',
          width: 160,
          key: 'id'
        }, {
          title: '问到次数',
          key: 'visitNum',
          width: 160
        }, {
          title: '标题',
          key: 'title'
        }, {
          title: '内容',
          key: 'content'
        }],
        robotStatus: {}
      };
    },
    computed: {
      ...mapGetters([
        'esMachines'
      ])
    },
    methods: {
      getData() {
        this.$http.get('/robot/history/status').then(res => {
          if (res) {
            this.robotStatus = res;
            this.robotStatus.fetch_time = formatFullDate(new Date());
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
