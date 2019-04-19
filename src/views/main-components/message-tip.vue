<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="value">
                <Icon type="ios-bell" :size="22"></Icon>
            </Badge>
        </Tooltip>
    </div>
</template>

<script>
  import util from '@/libs/util.js';
  import { mapState } from 'vuex';
  export default {
    name: 'messageTip',
    computed: {
      ...mapState({
        value: state => state.user.usermsgs.length
      })
    },
    methods: {
      showMessage () {
        util.openNewPage(this, 'message_index');
        this.$router.push({
          name: 'message_index'
        });
      }
    }
  };
</script>
