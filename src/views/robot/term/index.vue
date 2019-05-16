<!--vip管理-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <Card>
                <p slot="title">
                    <Icon type="navicon-round"></Icon>
                    term分析
                </p>
                <Card :bordered="false" dis-hover>
                    <Row>
                        <i-col span="20">
                            <Input type="textarea" v-model="searchQA" placeholder="term分析语句"/>
                        </i-col>
                        <i-col span="4">
                            <Button type="primary" @click="getData">
                                <Icon type="plus"></Icon>
                                分析
                            </Button>
                        </i-col>
                    </Row>
                </Card>
                <div style="padding-bottom: 200px;">
                    <Table stripe :columns="mainColumns" :data="searchTerms" size="small"></Table>
                </div>
            </Card>
        </i-col>
    </Row>
</template>

<script>
  import {formatDate} from '@/libs/filters';
  import ICol from 'iview/src/components/grid/col';
  // import {mapGetters} from 'vuex';

  export default {
    components: {ICol},
    data() {
      return {
        searchQA: '',
        searchTerms: [],
        mainColumns: [{
          type: 'index',
          align: 'center',
          width: 70
        }, {
          title: '词名',
          key: 'name',
          align: 'center'
        }, {
          title: '出现次数',
          key: 'num',
          align: 'center',
          sortable: true,
        }, {
          title: '词权重',
          key: 'weight',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return params.row.weight ? params.row.weight.toFixed(4) : 0;
          }
        }, {
          title: '最终计算分',
          key: 'value',
          align: 'center',
          sortable: true,
          sortType: 'desc',
          render: (h, params) => {
            return params.row.value ? params.row.value.toFixed(4) : 0;
          }
        }]
      };
    },
    computed: {},
    methods: {
      getData() {
        this.$http.get('/dict/termAnalysis', {params: {question: this.searchQA, expand: true}}).then(res => {
          this.searchTerms = res;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
    },
    created() {
    },
    mounted() {
    }
  };
</script>

<style lang="less">
    .fooo {
        font-size: 14px;
        width: 80px;
        text-align: center;
    }
</style>
