<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <Form :label-width="100">
                <FormItem label="加载新值所花费的平均时间">
                    <div v-html="mainData.averageLoadPenalty"></div>
                </FormItem>
                <FormItem label="从数据库中加载数据总共消耗的时间">
                    <div v-html="mainData.totalLoadTime"></div>
                </FormItem>
                <FormItem label="命中率">
                    <div v-html="mainData.hitRate"></div>
                </FormItem>
                <FormItem label="未命中率">
                    <div v-html="mainData.missRate"></div>
                </FormItem>
                <FormItem label="缓存访问总次数">
                    <div v-html="mainData.hitCount+mainData.missCount"></div>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>

  export default {
    name: 'groot-stats',
    components: {},
    props: ['closemodal'],
    data() {
      return {
        mainData: {}
      }
    },
    computed: {},
    methods: {
      getData() {
        this.$http.get('/groot/node/man', {
          params: {func: 'cacheStats'}
        }).then(res => {
          this.mainData = res;
        });
      },
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
