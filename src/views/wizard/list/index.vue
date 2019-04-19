<template>
    <Row>
        <Card :bordered="false" :dis-hover="true">
            <Tabs type="card" style="background: #fff;">
                <TabPane label="单词列表" value="treePanel">
                    <Card :bordered="false" :dis-hover="true">
                    </Card>
                </TabPane>
                <TabPane label="关系列表" value="tablePanel">
                    <Card :bordered="false" :dis-hover="true">
                    </Card>
                </TabPane>
            </Tabs>
        </Card>
    </Row>
</template>
<script>
  export default {
    data() {
      return {
        dataName: 'wordListAndRelation',
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 20
          }
        },
      };
    },
    methods: {},
    created() {
    }
  };
</script>