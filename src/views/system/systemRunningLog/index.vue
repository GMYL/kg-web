<template>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            系统运行日志
        </p>
        <Button slot="extra" type="primary" shape="circle" @click="getData">
            <Icon type="ios-loop-strong"></Icon>
            刷新
        </Button>
        <Table :columns="formHeader" :data="datas"></Table>
        <div class="pageTool">
            <Page :total="filterData.page.totalSize" show-sizer @on-change="getPageData"
                  @on-page-size-change="setPageSize" :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
        </div>
    </Card>
</template>

<script>
  import {formatFullDate} from '@/libs/filters';

  export default {
    components: {},
    data() {
      return {
        datas: [],
        formHeader: [{
          title: '时间',
          key: 'createTime',
          width: 110,
          render: (h, params) => {
            return h('span', formatFullDate(params.row.createTime));
          }
        }, {
          title: '类型',
          key: 'type',
          width: 100,
        }, {
          title: '日志',
          key: 'content'
        },],
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          }
        },
      };
    },
    methods: {
      getData() {
        this.$http.post('/system/running/log/query', this.filterData).then(res => {
          this.datas = res.list;
          this.filterData.page.totalSize = res.totalSize;
          this.filterData.page.pageSize = res.pageSize;
          this.$Message.success('已获取最新数据');
        });
      },
      freshData() {
        this.getData();
      },
      getPageData (val) {
        this.filterData.page.pageNumber = val;
        this.getData();
      },
      setPageSize (val) {
        this.filterData.page.pageSize = val;
        this.getData();
      },
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
