<!--添加文章-->
<template>
  <div>
    <Row>
      <i-col span="18" style="padding-right: 12px;">
        <Card>
          <p slot="title">
            <Icon type="ios-pricetags-outline"></Icon>标签
          </p>
          <ul class="showMsg">
            <!--<li style="padding:10px 0;">暂时隐藏-->
            <!--<span>税种标签</span>&emsp;-->
            <!--<Select v-model="data.taxTag" multiple placeholder="请选择税种标签" style="width:20%">-->
            <!--<Option v-for="item in tagTax" :value="item.id" :key="item.id">-->
            <!--{{ item.id }}-->
            <!--</Option>-->
            <!--</Select>&emsp;&emsp;-->
            <!--<span>地域标签</span>&emsp;-->
            <!--<Select v-model="data.regionTag" multiple placeholder="请选择地域标签" style="width:20%">-->
            <!--<Option v-for="item in tagRegion" :value="item.id" :key="item.id">-->
            <!--{{ item.id }}-->
            <!--</Option>-->
            <!--</Select>-->
            <!--</li>-->
            <li style="padding:10px 0;">
              <span>文章标题</span>&emsp;
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input
                  v-model="data.title"
                  icon="android-list"
                  @on-change="cacheTitle"
                  placeholder="文章的标题"
                />
              </div>
            </li>
            <li>
              <span>文章来源</span>&emsp;
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input
                  v-model="data.source"
                  icon="ios-download-outline"
                  @on-change="cacheTitle"
                  placeholder="文章来源"
                />
              </div>
            </li>
            <li style="padding:10px 0;">
              <span>文章作者</span>&emsp;
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input v-model="data.articleauthor" @on-change="cacheTitle" placeholder="请输入文章作者"/>
              </div>
            </li>
            <li style="padding:10px 0;">
              <span>发文时间</span>&emsp;
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input
                  v-model="data.date"
                  @on-change="cacheTitle"
                  placeholder="请输入日期格式:2018-01-01"
                />
              </div>
            </li>
            <li>
              <span style="display:inline-block;vertical-align: top;width:6%">文章摘要</span>
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input
                  type="textarea"
                  :autosize="{minRows: 3}"
                  v-model="data.summary"
                  placeholder="文章的摘要……"
                />
              </div>
            </li>
            <li style="padding:10px 0;">
              <span>备注标签</span>&emsp;
              <div style="width:50%;display:inline-block;vertical-align: top;">
                <Input v-model="data.labelother" @on-change="cacheTitle" placeholder="请输入备注标签"/>
              </div>
            </li>
            <li>
              <span
                style="display:inline-block;vertical-align: top; margin-top: 19px;width:10%"
              >文章内容</span>
              <vue-ueditor-wrap
                v-model="data.content"
                :config="myConfig"
                :key="1"
                style="width:94%;"
              ></vue-ueditor-wrap>
              <!-- <quill-editor style="width:94%;height:300px; display:inline-block;" v-model="data.content" ref="myQuillEditor" :options="editorOption"></quill-editor> -->
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="6" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="paper-airplane"></Icon>发布
          </p>
          <p class="margin-top-10">
            <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
            <Select size="small" style="width:90px" v-model="data.state">
              <Option
                v-for="item in articleStateList"
                :value="item.label"
                :key="item.value"
              >{{ item.value }}</Option>
            </Select>
          </p>
          <p class="margin-top-10">
            <Icon type="android-time"></Icon>&nbsp;&nbsp;分&nbsp;&nbsp;&nbsp; 类：
            <Tag
              v-for="item in data.categorys"
              :key="item.id"
              type="border"
              :color="item.color"
            >{{item.id}}</Tag>
          </p>
          <Row class="margin-top-20 publish-button-con">
            <span class="publish-button">
              <Button
                @click="handlePublish"
                :loading="publishLoading"
                icon="ios-checkmark"
                style="width:90px;"
                type="primary"
              >发布</Button>
            </span>
          </Row>
        </Card>
        <div class="margin-top-10">
          <Card>
            <p slot="title">
              <Icon type="navicon-round"></Icon>分类目录
            </p>
            <Button type="ghost" @click="$router.push('/article/category')" slot="extra">管理分类</Button>
            <div class="classification-con">
              <Tree
                :data="articleCategory"
                @on-check-change="setCategory"
                show-checkbox
                ref="catetree"
              ></Tree>
            </div>
            <!-- <div class="classification-con">
                        <Tree ref="catetree" :data="articleCategory" @on-check-change="setCategory"
                              show-checkbox ></Tree>
            </div>-->
          </Card>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  name: "publish",
  components: {
    VueUeditorWrap
  },
  editor() {
    return this.$refs.myQuillEditor.quill;
  },
  data() {
    let textareaCache = "articleTextCache",
      categoryCache = "articleCategoryCache",
      titleCache = "articleTitleCache";
    return {
      data: {
        title: sessionStorage.getItem(titleCache)
          ? sessionStorage.getItem(titleCache)
          : "",
        content: sessionStorage.getItem(textareaCache)
          ? sessionStorage.getItem(textareaCache)
          : "",
        categorys: sessionStorage.getItem(categoryCache)
          ? JSON.parse(sessionStorage.getItem(categoryCache))
          : [],
        state: 2,
        source: "", //  文章来源
        security: "open",
        fixTop: false,
        taxTag: [],
        regionTag: [],
        author: this.$store.state.user.user.id,
        summary: "",
        date: "",
        articleauthor: "",
        labelother: ""
      },
      titleCacheName: titleCache,
      editorCacheName: textareaCache,
      categoryCacheName: categoryCache,
      editorId: "editorId",
      editorBean: null,
      editorOption: {
        placeholder: "请在此处输入内容..."
      },
      articleStateList: this.$store.getters.articleStatePickList,
      editOpenness: false,
      currentOpenness: "open",
      publishLoading: false,
      myConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 400,
        initialFrameWidth: "100%",
        UEDITOR_HOME_URL: "/src/static/UEditor/",
        serverUrl: "http://35.201.165.105:8000/controller.php"
      },
      articleCategory: []
    };
  },
  computed: {
    // articleCategory() {
    //   let theMap = {};
    //   if (this.data.categorys) {
    //     this.data.categorys.forEach(item => {
    //       theMap[item.id] = item;
    //     });
    //   }
    //   let rootNode = this.$store.getters.articleCategoryRoot;
    //   if (rootNode && rootNode.children) {
    //     let rootNodeChild = JSON.parse(JSON.stringify(rootNode.children));
    //     this.restoreAllCategorys(rootNodeChild, theMap);
    //     return rootNodeChild;
    //   } else {
    //     return [];
    //   }
    // },
    ...mapGetters([
      "tagTax",
      "tagRegion",
      "articleCategoryMap",
      "articleCategoryRoot"
    ])
  },
  methods: {
    getArticleCategory(myData) {
      let theMap = {};
      if (this.data.categorys) {
        this.data.categorys.forEach(item => {
          theMap[item.id] = item;
        });
      }
      let rootNode = this.$store.getters.articleCategoryRoot;
      if (rootNode && rootNode.children) {
        let rootNodeChild = JSON.parse(JSON.stringify(rootNode.children));
        this.restoreAllCategorys(rootNodeChild, theMap);
        this.articleCategory = rootNodeChild;
      } else {
        this.articleCategory = [];
      }
    },
    getUEContent() {
      let content = this.$refs.ue.getUEContent(); // 调用子组件方法
    },
    getUEContentTxt() {
      let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
    },
    restoreAllCategorys(children, theMap) {
      if (children) {
        children.forEach(item => {
          if (theMap[item.id] && theMap[item.id].color === "red") {
            item.checked = true;
          }
          this.restoreAllCategorys(item.children, theMap);
        });
      }
    },
    cacheTitle() {
      sessionStorage.setItem(this.titleCacheName, this.data.title);
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
      if (item && item.parent && item.parent !== "root") {
        theObject[item.parent] = {
          id: item.parent,
          color: "green"
        };
        this.findCategoryParents(this.articleCategoryMap[item.parent]);
      }
    },
    clearCache() {
      sessionStorage.setItem(this.titleCacheName, "");
      sessionStorage.setItem(this.editorCacheName, "");
      sessionStorage.setItem(this.categoryCacheName, "");
    },
    setCategory(selected) {
      let nodes = {},
        arr = [];
      selected.map(item => {
        this.findCategoryParents(nodes, item);
        nodes[item.id] = {
          id: item.id,
          color: "red"
        };
      });
      for (let i in nodes) {
        arr.push(nodes[i]);
      }
      this.data.categorys = arr;
      sessionStorage.setItem(this.categoryCacheName, JSON.stringify(arr));
    },
    canPublish() {
      if (this.data.title.length === 0) {
        this.$Message.error("请输入文章标题");
        return false;
      } else if (!this.data.categorys || this.data.categorys.length === 0) {
        this.$Message.error("文章分类不能为空");
        return false;
      } else {
        sessionStorage.articleTextCache = this.data.content;
        let content = sessionStorage.getItem(this.editorCacheName);
        if (content && content.length > 30) {
          return true;
        } else {
          this.$Message.error("文章内容长度不够30");
          return false;
        }
      }
    },
    handlePublish() {
      if (this.canPublish()) {
        this.publishLoading = true;
        sessionStorage.articleTextCache = this.data.content;
        let postMsg = JSON.parse(JSON.stringify(this.data));
        postMsg.content = sessionStorage.getItem(this.editorCacheName);
        postMsg.content = postMsg.content.replace(
          /\<br \/>/g,
          "<br />&emsp;&emsp;"
        );
        postMsg.content = postMsg.content.replace(
          /\<p\>/g,
          "<p>&emsp;&nbsp;&nbsp;&nbsp;"
        );
        if (postMsg.categorys) {
          postMsg.categorys = postMsg.categorys.map(item => {
            return item.id;
          });
          postMsg.author = {
            id: postMsg.author
          };
        }
        this.$http
          .put("/article", postMsg)
          .then(res => {
            this.publishLoading = false;
            this.$Notice.success({
              title: "保存成功",
              desc: "文章《" + this.data.title + "》保存成功"
            });
            this.clearCache();
            this.$router.push("/article/list");
          })
          .catch(err => {
            this.publishLoading = false;
            this.$Notice.error({
              title: "保存失败",
              desc: err.msg
            });
          });
      }
    }
  },
  created() {
    if (window.location.host == "192.168.1.71") {
      this.myConfig.UEDITOR_HOME_URL = "/admin/static/static/UEditor/";
    } else if (window.location.host == "www.helper12366.com") {
      this.myConfig.UEDITOR_HOME_URL = "/admin/static/static/UEditor/";
    } else {
      this.myConfig.UEDITOR_HOME_URL = "/src/static/UEditor/";
    }
  },
  mounted() {
    // 获取标签
    this.$store.dispatch("init_module_tag");
    // 获取分类
    this.$store.dispatch("init_module_article");
    this.getArticleCategory();
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
