<template>
<div>
    <Row>
        <i-col span="18">
            <Card :bordered="false" :dis-hover="true">
                <!-- <Form :label-width="100" inline>
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
                </Form> -->
                
                <Form :label-width="100">
                    <FormItem label="文章标题" style="width:615px">
                        <Input v-model="data.title" icon="android-list" @on-change="cacheTitle"/>
                    </FormItem>
                </Form>
                <Form :label-width="100">
                    <FormItem label="文章来源" style="width:615px">
                        <Input v-model="data.source" icon="android-list" @on-change="cacheTitle"/>
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
                <Form :label-width="100">
                    <FormItem label="备注标签" style="width:615px">
                        <Input v-model="data.labelother" @on-change="cacheTitle"/>
                    </FormItem>
                </Form>
                <!-- 爬虫爬的文章经过修改会改变格式，所有用旧富文本编辑器 -->
                <vue-ueditor-wrap v-model="data.content" :config="myConfig" :key="1"></vue-ueditor-wrap>
                <!-- <textEditor :content="data.content" :cachename="editorCacheName"/> -->
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
import VueUeditorWrap from 'vue-ueditor-wrap';
export default {
    name: 'article-update-editor',
    components: {
        VueUeditorWrap
    },
    props: ['srcdata'],
    data () {
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
            publishLoading: false,
            myConfig: {
                autoHeightEnabled: false,
                initialFrameHeight: 400,
                initialFrameWidth: '100%',
                UEDITOR_HOME_URL : '/src/static/UEditor/',
                serverUrl: 'http://35.201.165.105:8000/controller.php'
            }
        };
    },
    computed: {
        data() {
            String.prototype.replaceAll = function (FindText, RepText) {  
                let regExp = new RegExp(FindText,'g');  
                return this.replace(regExp, RepText);  
            };
            let mydata = this.srcdata;
            mydata.taxTag = mydata.taxTag ? mydata.taxTag : [];
            mydata.regionTag = mydata.regionTag ? mydata.regionTag : [];
            mydata.content = typeof this.srcdata.content != 'undefined' ? this.srcdata.content.replaceAll("&emsp;","") : '';
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
        // 添加自定义弹窗
        addCustomDialog (editorId) {
            window.UE.registerUI('test-dialog', function (editor, uiName) {
                // 创建 dialog
                var dialog = new window.UE.ui.Dialog({
                // 指定弹出层中页面的路径，这里只能支持页面，路径参考常见问题 2
                iframeUrl: '/customizeDialogPage.html',
                // 需要指定当前的编辑器实例
                editor: editor,
                // 指定 dialog 的名字
                name: uiName,
                // dialog 的标题
                title: '这是一个自定义的 Dialog 浮层',
                // 指定 dialog 的外围样式
                cssRules: 'width:600px;height:300px;',
                // 如果给出了 buttons 就代表 dialog 有确定和取消
                buttons: [
                    {
                    className: 'edui-okbutton',
                    label: '确定',
                    onclick: function () {
                        dialog.close(true);
                    }
                    },
                    {
                    className: 'edui-cancelbutton',
                    label: '取消',
                    onclick: function () {
                        dialog.close(false);
                    }
                    }
                ]
                });

                // 参考上面的自定义按钮
                var btn = new window.UE.ui.Button({
                name: 'dialog-button',
                title: '鼠标悬停时的提示文字',
                cssRules: `background-image: url('/test-dialog.png') !important;background-size: cover;`,
                onclick: function () {
                    // 渲染dialog
                    dialog.render();
                    dialog.open();
                }
                });

                return btn;
            }, 0 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */, editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */);
        },
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
                postMsg.content = this.data.content;
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
    created(){
        if(window.location.host == '192.168.1.71'){
            this.myConfig.UEDITOR_HOME_URL = '/admin/static/static/UEditor/';
        }else if(window.location.host == 'www.helper12366.com'){
            this.myConfig.UEDITOR_HOME_URL = '/admin/static/static/UEditor/';
        }else{
            this.myConfig.UEDITOR_HOME_URL = '/src/static/UEditor/';
        }
    }
};
</script>

<style lang="less" scoped>
    @import "../article.less";
    .preview{
    min-height: 200px;
    width: 100%;
    }
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

