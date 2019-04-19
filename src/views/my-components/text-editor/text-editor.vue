<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <div>
                <textarea class='tinymce-textarea' id="tinymceEditer" v-html="content"></textarea>
            </div>
        </Card>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>

<script>
  import tinymce from 'tinymce';

  export default {
    name: 'text-editor',
    data() {
      return {
        spinShow: true
      };
    },
    props: ['content', 'cachename'],
    methods: {
      init() {
        this.$nextTick().then(() => {
          let vm = this;
          let height = document.body.offsetHeight - 400;
          let cacheName = this.cachename !== "false" ? this.cachename : null;
          tinymce.init({
            selector: '#tinymceEditer',
            branding: false,
            elementpath: false,
            height: height,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
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
                if (cacheName !== "false" && sessionStorage.editorContent) {
                  tinymce.get('tinymceEditer').setContent(sessionStorage.getItem(cacheName));
                }
              });
              editor.on('keyup', function (e) {
                if (cacheName !== "false") {
                  // console.log(tinymce.get('tinymceEditer').getContent())
                  sessionStorage.setItem(cacheName, tinymce.get('tinymceEditer').getContent());
                  // localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                }
              });
            }
          }).then(this.initContent());
        });
      },
      initContent() {
        if (this.content) {
          let mceDiv = tinymce.get('tinymceEditer');
          if (mceDiv.initialized) {
            mceDiv.setContent(this.content);
          }
        }
      },
      reloadContent() {
        let mceDiv = tinymce.get('tinymceEditer');
        if (mceDiv.initialized) {
          if (this.content) {
            mceDiv.setContent(this.content);
          }
        } else {
          tinymce.get('tinymceEditer').destroy();
          this.init();
        }
      }
    },
    watch: {
      content: 'reloadContent'
    },
    mounted() {
      this.init();
    },
    destroyed() {
      tinymce.get('tinymceEditer').destroy();
    }
  };
</script>
