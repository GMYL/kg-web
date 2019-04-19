<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        theme: this.$store.state.app.themeColor
      };
    },
    mounted () {

    },
    beforeDestroy () {

    },
    methods: {}
  };
</script>

<style lang="less">
    #main {
        font-family: Arial,'Microsoft Yahei', '微软雅黑', 'simsun';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 0;
    }
    /*样式的覆盖*/
    .ivu-input, .ivu-select-selection {
        border: 1px dotted #666;
    }
    /*样式的覆盖*/
    .ivu-table td, .ivu-table th {
        border-bottom: 1px dotted #666;
    }
    /*样式的覆盖*/
    .ivu-table-wrapper {
        border: 1px solid #c4c4c4;
        border-bottom: 0;
        border-right: 0;
    }
    /*覆盖*/
    .ivu-table {
        font-size: 14px;
        color: #333;
    }

    html, body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }

    .app-main {
        width: 100%;
        height: 100%;
    }
</style>
