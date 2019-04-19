<template>
    <div>
        <Row>
            <i-col span="18">
                <Card :bordered="false" :dis-hover="true">
                    <Form :label-width="100" inline>
                        <Form-item label="税种标签" style="width:300px">
                            <Select v-model="data.taxTag" multiple placeholder="请选择税种标签">
                                <Option v-for="item in tagTax" :value="item.id" :key="item.id">
                                    {{ item.id }}
                                </Option>
                            </Select>
                        </Form-item>
                        <Form-item label="地域标签" style="width:300px">
                            <Select v-model="data.regionTag" multiple placeholder="请选择地域标签">
                                <Option v-for="item in tagRegion" :value="item.id" :key="item.id">
                                    {{ item.id }}
                                </Option>
                            </Select>
                        </Form-item>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="备注标签" style="width:615px">
                            <Input v-model="data.labelother" @on-change="cacheTitle"/>
                        </FormItem>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="文章来源" style="width:615px">
                            <Input v-model="data.source" icon="android-list" @on-change="cacheTitle"/>
                        </FormItem>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="文章标题" style="width:615px">
                            <Input v-model="data.title" icon="android-list" @on-change="cacheTitle"/>
                        </FormItem>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="文章作者" style="width:615px">
                            <Input v-model="data.articleauthor" @on-change="cacheTitle" placeholder="请输入文章作者"/>
                        </FormItem>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="发文时间" style="width:615px">
                            <Input v-model="data.date" @on-change="cacheTitle" placeholder="正确日期格式为:2018-01-01"/>
                        </FormItem>
                    </Form>
                    <Form :label-width="100">
                        <FormItem label="文章摘要">
                            <Input v-model="data.summary"/>
                        </FormItem>
                    </Form>
                    <!-- 爬虫爬的文章经过修改会改变格式，所有用旧富文本编辑器 -->
                    <textEditor :content="data.content" :cachename="editorCacheName"/>
                </Card>
            </i-col>
            <i-col span="6" class="padding-left-10">
                <div class="margin-top-10">
                    <Card :bordered="false" :dis-hover="true">
                        <Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark"
                                type="success" size="large" long>提交修改
                        </Button>
                    </Card>
                    <Card :bordered="false" :dis-hover="true">
                        <p slot="title">
                            <Icon type="navicon-round"></Icon>
                            分类目录
                        </p>
                        <Button type="ghost" @click="$router.push('/article/category')" slot="extra">管理分类</Button>
                        <div class="classification-con">
                            <Tree :data="articleCategory" @on-check-change="setCategory" show-checkbox multiple></Tree>
                        </div>
                    </Card>
                </div>
            </i-col>
        </Row>

    </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import textEditor from '../../my-components/text-editor/text-editor.vue';

  export default {
    name: 'article-update-editor',
    components: {textEditor},
    props: ['srcdata'],
    data() {
      let textareaCache = 'articleUpdateTextCache', categoryCache = 'articleUpdateCategoryCache',
        titleCache = 'articleUpdateTitleCache';
      return {
        titleCacheName: titleCache,
        editorCacheName: textareaCache,
        categoryCacheName: categoryCache,
        editorId: 'editorId',
        editorBean: null,
        editorOption: {},
        editOpenness: false,
        currentOpenness: 'open',
        publishLoading: false
      };
    },
    computed: {
      data() {
        let mydata = this.srcdata;
        mydata.taxTag = mydata.taxTag ? mydata.taxTag : [];
        mydata.regionTag = mydata.regionTag ? mydata.regionTag : [];
        // mydata.taxTag = mydata.taxTag ? mydata.taxTag.map(item => {
        //   return {id: item};
        // }) : [];
        // mydata.regionTag = mydata.regionTag ? mydata.regionTag.map(item => {
        //   return {id: item};
        // }) : [];
        // mydata = JSON.parse(JSON.stringify(mydata));
        return mydata;
      },
      articleCategory() {
        let theMap = {};
        if (this.data.categorys) {
          this.data.categorys.forEach(item => {
            theMap[item] = item;
          });
        }
        let rootNode = this.$store.getters.articleCategoryRoot;
        if (rootNode && rootNode.children) {
          let rootNodeChild = JSON.parse(JSON.stringify(rootNode.children));
          this.restoreAllCategorys(rootNodeChild, theMap);
          return rootNodeChild;
        } else {
          return [];
        }
      },
      ...mapGetters(['tagTax', 'tagRegion', 'articleCategoryMap', 'articleCategoryRoot', 'articleStateListSelector'])
    },
    methods: {
      restoreAllCategorys(children, theMap) {
        if (children) {
          children.forEach(item => {
            if (theMap[item.id] && !item.children) {
              item.checked = true;
            }
            this.restoreAllCategorys(item.children, theMap);
          });
        }
      },
      cacheTitle() {
        // sessionStorage.setItem(this.titleCacheName, this.data.title);
        // this.$emit('update:srcdata', data);
      },
      handleEditOpenness() {
        this.editOpenness = !this.editOpenness;
      },
      handleSaveOpenness() {
        this.data.security = this.currentOpenness;
        this.editOpenness = false;
      },
      cancelEditOpenness() {
        this.currentOpenness = this.data.security;
        this.editOpenness = false;
      },
      findCategoryParents(theObject, item) {
        if (item && item.parent && item.parent !== 'root') {
          theObject[item.parent] = item.parent;
          this.findCategoryParents(this.articleCategoryMap[item.parent]);
        }
      },
      setCategory(selected) {
        let nodes = {}, arr = [];
        selected.map(item => {
          this.findCategoryParents(nodes, item);
          nodes[item.id] = item.id;
        });
        for (let i in nodes) {
          arr.push(nodes[i]);
        }
        this.data.categorys = arr;
        // sessionStorage.setItem(this.categoryCacheName, JSON.stringify(arr));
        // this.$emit('update:srcdata', data);
      },
      canPublish() {
        if (this.data.title.length === 0) {
          this.$Message.error('请输入文章标题');
          return false;
        } else if (!this.data.categorys || this.data.categorys.length === 0) {
          this.$Message.error('文章分类不能为空');
          return false;
        } else {
          let content = sessionStorage.getItem(this.editorCacheName);
          if (content && content.length > 30) {
            return true;
          } else {
            this.$Message.error('文章内容长度不够30');
            return false;
          }
        }
      },
      handlePublish() {
        if (this.canPublish()) {
          this.publishLoading = true;
          let postMsg = JSON.parse(JSON.stringify(this.data));
          postMsg.content = sessionStorage.getItem(this.editorCacheName);
          this.$http.post('/article/update', postMsg).then(() => {
            this.publishLoading = false;
            this.$Notice.success({
              title: '修改文章成功',
              duration: 1
            });
          }).catch(err => {
            this.publishLoading = false;
            this.$Notice.error({
              title: '修改文章失败',
              desc: err.msg
            });
          });
        }
      }
    },
    created() {
      // console.log("create!!!!");
    },
    mounted() {
      // console.log("mounted!!!!");
    }
  };
</script>
<style lang="less" scoped>
    @import "../article.less";

    .article-link-con {
        height: 32px;
        width: 100%;
    }

    .fixed-link-enter {
        opacity: 0;
    }

    .fixed-link-enter-active,
    .fixed-link-leave-active {
        transition: opacity 0.3s;
    }

    .fixed-link-enter-to {
        opacity: 1;
    }

    .openness-radio-con {
        margin-left: 40px;
        padding-left: 10px;
        height: 130px;
        border-left: 1px dashed #ebe9f3;
        overflow: hidden;
    }

    .publish-time-picker-con {
        margin-left: 40px;
        padding-left: 10px;
        height: 100px;
        border-left: 1px dashed #ebe9f3;
        overflow: hidden;
    }

    .openness-con-enter {
        height: 0;
    }

    .openness-con-enter-active,
    .openness-con-leave-active {
        transition: height 0.3s;
    }

    .openness-con-enter-to {
        height: 130px;
    }

    .openness-con-leave {
        height: 130px;
    }

    .openness-con-leave-to {
        height: 0;
    }

    .publish-button-con {
        border-top: 1px solid #f3eff1;
        padding-top: 14px;
        text-align: center;
    }

    .publish-button {
        margin-left: 10px;
    }

    .publish-time-enter {
        height: 0;
    }

    .publish-time-enter-active,
    .publish-time-leave-active {
        transition: height 0.3s;
    }

    .publish-time-enter-to {
        height: 100px;
    }

    .publish-time-leave {
        height: 100px;
    }

    .publish-time-leave-to {
        height: 0;
    }

    .classification-con {
        margin-top: -16px;
        padding: 10px;
        overflow: auto;
    }

    .add-new-tag-con {
        margin-top: 20px;
        border-top: 1px dashed #dbdddf;
        padding: 20px 0;
        height: 60px;
        overflow: hidden;
    }

    .add-new-tag-enter {
        height: 0;
        margin-top: 0;
        padding: 0px 0;
    }

    .add-new-tag-enter-active,
    .add-new-tag-leave-active {
        transition: all 0.3s;
    }

    .add-new-tag-enter-to {
        height: 60px;
        margin-top: 20px;
        padding: 20px 0;
    }

    .add-new-tag-leave {
        height: 60px;
        margin-top: 20px;
        padding: 20px 0;
    }

    .add-new-tag-leave-to {
        height: 0;
        margin-top: 0;
        padding: 0px 0;
    }
</style>
