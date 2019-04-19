<style lang="less">
    @import '../../../styles/loading.less';

    #after-init-show {
        display: none;
    }
</style>

<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <div id="after-init-show">
                <textarea class='tinymce-textarea' id="tinymceEditer" v-html="myContentData"></textarea>
            </div>
            <div id="before-init-show">
                <Input v-model="myContentData" type="textarea" @on-change="updateContent" :rows="10"></Input>
            </div>
        </Card>
        <!-- <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin> -->
        <!--<Input v-if="spinShow" v-model="content" type="textarea" placeholder="Enter something..."></Input>-->
    </div>
</template>

<script>
  import tinymce from 'tinymce';

  export default {
    name: 'text-editor2',
    data() {
      return {
        spinShow: true,
        editCacheName: '',
        myContentData: null
      };
    },
    computed: {
      // myContent() {
      //   if (((!this.myContentData) || this.myContentData.length == 0) && this.content) {
      //     this.myContentData = JSON.parse(JSON.stringify(this.content));
      //   }
      //   return this.myContentData;
      // }
    },
    props: ['content', 'cachename', 'readonlyy'],
    methods: {
      init() {
        this.$nextTick(() => {
          let vm = this;
          let height = document.body.offsetHeight - 400;
          let cacheName = this.cachename !== 'false' ? this.cachename : null;
          this.editCacheName = cacheName;
          let readonly = this.readonlyy ? 1 : 0;
          // let tinyContentData = this.initmyContentData(this.content);
          tinymce.init({
            selector: '#tinymceEditer',
            branding: false,
            elementpath: false,
            height: height,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            readonly: readonly,
            plugins: [
              'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
              'searchreplace visualblocks visualchars code fullpage fullscreen',
              'insertdatetime media nonbreaking save table contextmenu directionality',
              'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' undo redo | formatselect fontselect fontsizeselect | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify ',
            toolbar2: ' newdocument preview fullscreen | insert forecolor backcolor bold italic underline strikethrough removeformat | link unlink image emoticons media codesample hr sub sup ltr rtl blockquote ',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
              width: '100%',
              borderCollapse: 'collapse'
            },
            setup: function (editor) {
              editor.on('init', function (e) {
                vm.spinShow = false;
                document.getElementById("after-init-show").style.display = "block";
                document.getElementById("before-init-show").style.display = "none";
                if (cacheName && cacheName !== 'false' && sessionStorage.getItem(cacheName)) {
                  tinymce.get('tinymceEditer').setContent(sessionStorage.getItem(cacheName));
                }
              });
              editor.on('keyup', function (e) {
                if (cacheName !== 'false') {
                  // console.log(tinymce.get('tinymceEditer').getContent())
                  sessionStorage.setItem(cacheName, tinymce.get('tinymceEditer').getContent());
                  // localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                }
              });
            }
          });
        });
      },
      updateContent() {
        if (this.cachename && this.cachename !== 'false') {
          sessionStorage.setItem(this.cachename, tinymce.get('tinymceEditer').getContent());
        }
      },
      initmyContentData(item) {
        if (((!this.myContentData) || this.myContentData.length == 0) && item) {
          this.myContentData = JSON.parse(JSON.stringify(item));
          if (this.cachename && this.cachename !== 'false') {
            sessionStorage.setItem(this.cachename, this.myContentData);
          }
        }
        return this.myContentData;
      }
    },
    watch: {
      content: 'initmyContentData'
      // content: item => {
      //   initmyContentData(item);
      //
      // if ((!this.spinShow) && item && tinymce.get('tinymceEditer')) {
      //   // console.log(tinymce.get('tinymceEditer'));
      //   // console.log(item);
      //   // this.$refs["contentDiv"].value = item;
      //   tinymce.get('tinymceEditer').setContent(item);
      // }
      // }
    },
    created() {
      this.init();
    },
    destroyed() {
      if (tinymce.get('tinymceEditer')) {
        tinymce.get('tinymceEditer').destroy();
      }
    }
  };
</script>
