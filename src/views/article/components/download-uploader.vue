<template>
    <div>
        <Row>
            <i-col span="12" style="padding-right: 16px;">
                <Card>
                    <Upload
                            type="drag"
                            :before-upload="handleUpload"
                            action="upload">
                        <!--<Button type="ghost" icon="ios-cloud-upload-outline">选择要上传的文件</Button>-->
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或者拖拽文件上传</p>
                        </div>
                    </Upload>
                    <div v-if="file !== null">您选择的文件: {{ file.name }}
                        <Button type="warning" @click="upload" :loading="loadingStatus">
                            {{ loadingStatus ? '上传中' : '确认上传' }}
                        </Button>
                    </div>
                </Card>
            </i-col>
        </Row>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { thisExpression } from 'babel-types';

  export default {
    name: 'download-uploader',
    components: {},
    props: [],
    data () {
      return {
        file: null,
        loadingStatus: false,
      };
    },
      
    methods: {
      handleUpload (file) {
        this.file = file;
        return false;
      },
      upload () {
          this.loadingStatus = true;
          let formData = new FormData();
          formData.append('file', this.file);
          let config = {headers: {'Content-Type': 'multipart/form-data'}};
          this.$http.post('/articlemedia/uploadoss', formData, config).then(res => {
              this.$Message.success('上传文件成功');
              this.file = null;
              this.loadingStatus = false;
          });
      }
    },
    created () {
    },
    mounted () {
    }
  };
</script>
<style lang="less" scoped>
</style>
