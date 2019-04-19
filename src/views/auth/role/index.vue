<!--角色管理-->
<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <Row>
                        <i-col span="6">
                            <Input v-model="filterData.id" style="width: 200px" placeholder="请输入编号"></Input>
                            <Input v-model="filterData.name" style="width: 200px" placeholder="请输入待查询名称"></Input>
                        </i-col>
                        <i-col span="6">
                            <Button type="primary" icon="ios-search" @click="freshData">查询</Button>
                        </i-col>
                    </Row>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        角色列表
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <Button slot="extra" type="success" shape="circle" @click="modal2= true">
                        <Icon type="plus"></Icon>
                        添加
                    </Button>
                    <div>
                        <Table border highlight-row :columns="mainColumns" :data="mainData"></Table>
                        <Page :total="filterData.page.totalSize" @on-change="getPageData"
                              @on-page-size-change="setPageSize" class="pageTool" show-sizer
                              :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
                    </div>
                </Card>
            </i-col>
            <!--<i-col span="12" class="padding-left-10">-->
            <!--<Card>-->
            <!--<p slot="title"> 修改 </p>-->
            <!--<Form :model="editmainData" label-position="left" :label-width="100">-->
            <!--<FormItem>-->
            <!--<Button type="error" @click="deleteEditor">删除</Button>-->
            <!--<Button type="warning" @click="updateEditor">修改</Button>-->
            <!--<Button type="success" @click="addEditor">添加</Button>-->
            <!--</FormItem>-->
            <!--<FormItem label="名称（id）">-->
            <!--<Input v-model="editmainData.id"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="权限（urls）">-->
            <!--<CheckboxGroup v-model="editmainData.modules">-->
            <!--<p v-for="item in allmodules" :key="item.id">-->
            <!--<Checkbox :label="item.id">{{ item.id }}</Checkbox>-->
            <!--</p>-->
            <!--</CheckboxGroup>-->
            <!--</FormItem>-->
            <!--</Form>-->
            <!--</Card>-->
            <!--</i-col>-->
        </i-col>
        <Modal v-model="modal1" title="编辑" @on-ok="updateEditor">
            <Form :model="editmainData" label-position="left" :label-width="100">
                <!--<FormItem>-->
                <!--<Button type="error" @click="deleteEditor">删除</Button>-->
                <!--<Button type="warning" @click="updateEditor">修改</Button>-->
                <!--<Button type="success" @click="addEditor">添加</Button>-->
                <!--</FormItem>-->
                <FormItem label="编号（id）">
                    <Input disabled v-model="editmainData.id"></Input>
                </FormItem>
                <FormItem label="名称（show）">
                    <Input v-model="editmainData.name"></Input>
                </FormItem>
                <FormItem label="权限（module）">
                    <!-- <CheckboxGroup v-model="editmainData.modules">
                        <p v-for="item in allmodules" :key="item.id">
                            <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                        </p>
                    </CheckboxGroup> -->
                    <tree :data="editmainCategoryData" :load-data="loadEditmainData" show-checkbox ref="tree"></tree>
                </FormItem>
                <FormItem label="硬权限">
                    <Input v-model="editmainData.jwt"></Input>
                    硬权限用来做第一重接口过滤，过滤速度快
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="modal2" title="添加" @on-ok="addEditor">
            <Form :model="addData" label-position="left" :label-width="100">
                <!--<FormItem>-->
                <!--<Button type="error" @click="deleteEditor">删除</Button>-->
                <!--<Button type="warning" @click="updateEditor">修改</Button>-->
                <!--<Button type="success" @click="addEditor">添加</Button>-->
                <!--</FormItem>-->
                <FormItem label="编号（id）">
                    <Input v-model="addData.id"></Input>
                </FormItem>
                <FormItem label="名称（show）">
                    <Input v-model="addData.name"></Input>
                </FormItem>
                <FormItem label="权限（module）">
                    <!-- <CheckboxGroup v-model="addData.modules">
                        <p v-for="item in allmodules" :key="item.id">
                            <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                        </p>
                    </CheckboxGroup> -->
                    <!-- <P>{{authCategory}}</P> -->
                    <tree :data="categoryData" :load-data="loadData" show-checkbox></tree>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="modal4" title="包含模块信息" width="400">
            <Row>
                <i-col span="12">
                    <h3>包含模块：</h3>
                    <p v-for="item in modulesDate.modules" :key="item">
                        <Tag class="fooo">{{ item }}</Tag>
                    </p>
                </i-col>
                <i-col span="12">
                    <h3>说明：</h3>
                    <p v-for="item in modulesDate.modulesname" :key="item">
                        <Tag class="fooo">{{ item }}</Tag>
                    </p>
                </i-col>
            </Row>
        </Modal>
        <Modal v-model="deleteConfirm" title="提示" @on-ok="deleteOk" @on-cancel="cancelDelete">
            <p>是否确认删除？</p>
        </Modal>
    </Row>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {formatDate} from '@/libs/filters';

  export default {
    components: {},
    data() {
      return {
        dataName: 'role',
        deleteConfirm: false,//定义确认删除模板
        modal1: false,
        modal2: false,
        modal4: false,
        // roles: this.$store.allroles,
        // modules: this.$store.allmodules,
        mainColumns: [{
          title: '编号',
          key: 'id',
        }, {
          title: '名称',
          key: 'name',
        }, {
          title: '硬权限',
          key: 'jwt',
        }, {
          title: '包含模块',
          key: 'modules',
          render: (h, params) => {
            if(params.row.modules&&params.row.modules.length>0){
              return h('Button',{
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.views(params.row);
                    }
                  }
                }, "详细");
            }else{
              return h('Button',{
                props: {
                  size: 'small'
                },
              }, "无信息");
            }
          }
        }, {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '6px'
                },
                on: {
                  click: () => {
                    this.modal1 = true;
                    this.$data.editmainData = params.row;
                    this.editmainCategoryData = [{
                      title: "root",
                      loading: false,
                      id: 'root',
                      children: this.loadEditmainData('root'),
                    }];
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '6px'
                },
                // on: {
                //   click: () => {
                //     this.deleteEditor(params.row.id);
                //   }
                // }
                on: {
                  click: () => {
                    this.deleteConfirm = true;
                    this.deleteParems = params.row.id;
                  }
                }
              }, '删除')
            ]);
          }
        }],
        mainData: [],
        editmainData: {},
        addData: {},
        modulesDate: {},
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          }
        },
        searchName: '',
        categoryData: [],
        categoryTmpData: [],
        editmainCategoryData: [],
      };
    },
    computed: {
      ...mapGetters([
        // 'allroles',
        'allmodules'
      ]),
      authCategory() {
        let rootNode = this.$store.getters.authCategoryRoot;
        if (rootNode && rootNode.children) {
          return JSON.parse(JSON.stringify(rootNode.children));
        } else {
          return [];
        }
      },
      authCategory2() {
        let rootNode = this.$store.getters.authCategoryRoot;
        if (rootNode && rootNode.children) {
          return JSON.parse(JSON.stringify(rootNode.children));
        } else {
          return [];
        }
      }
    },
    methods: {
      getData() {
        this.$http.post('/' + this.$data.dataName + '/query', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      // pickARow (currentRow, oldCurrentRow) {
      //   this.$data.editmainData = currentRow;
      // },
      deleteEditor(id) {
        this.$http.delete('/' + this.$data.dataName + '/' + id).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.freshData();
          this.updateStore();
        });
      },
      updateEditor() {
        let updateObj = JSON.parse(JSON.stringify(this.$data.editmainData));
        console.log(this.$refs.tree.getCheckedNodes());
        var checkedNodes = this.$refs.tree.getCheckedNodes();
        var modules = [];
        for (var i in checkedNodes) {
          if (!checkedNodes[i].hasOwnProperty('children')) {
            modules.push(checkedNodes[i].id);
          }
        }
        updateObj.modules = modules;
        this.$http.post('/' + this.$data.dataName + '/update', updateObj).then(() => {
          this.$Notice.success({
            title: '修改成功'
          });
          this.freshData();
          this.updateStore();
        });
      },
      addEditor() {
        this.$http.put('/' + this.$data.dataName, this.$data.addData).then(() => {
          this.$Notice.success({
            title: '添加成功'
          });
          this.addData = {};
          this.freshData();
          this.updateStore();
        });
      },
      freshData() {
        this.getData();
      },
      deleteOk() {
        this.$http.delete('/' + this.$data.dataName + '/' + this.deleteParems).then(() => {
          this.$Notice.success({
            title: '删除成功',
          });
          this.freshData();
        });
      },
      cancelDelete() {
        this.deleteConfirm = false;
      },
      updateStore() {
        //  更新角色数据到store
        this.$store.dispatch('init_user_roles');
      },
      views(data) {
        this.modal4 = true;
        this.modulesDate = data;
      },
      searchClick() {
        this.$http.get('/' + this.$data.dataName + '/get/' + this.$data.searchName).then((res) => {
          if (res) {
            this.$Notice.success({
              title: '查询成功'
            });
            this.$data.editmainData = res;
          } else {
            this.$Notice.error({
              title: '查询失败'
            });
          }
        });
      },
      getPageData(val) {
        this.$data.filterData.page.pageNumber = val;
        this.getData();
      },
      setPageSize(val) {
        this.$data.filterData.page.pageSize = val;
        this.getData();
      },
      getCategoryData() {
        this.$http.get('/modulecategory/queryAll').then((res) => {
          if (res) {
            this.$Notice.success({
              title: '查询成功'
            });
            this.categoryTmpData = res;
            this.categoryData = [{
              title: "root",
              loading: false,
              id: 'root',
              children: [],
            }];
          } else {
            this.$Notice.error({
              title: '查询失败'
            });
          }
        });
      },
      loadData(item, callback) {
        // console.log(this.allmodules)
        // console.log("-=-=-=-=-=-=-=-=-=",this.categoryTmpData)
        // console.log(item, callback)
        var data = [];

        for (var i in this.categoryTmpData) {
          if (this.categoryTmpData[i].parent === item.id) {
            // console.log(this.categoryTmpData[i] , item.id)
            // console.log(this.categoryTmpData[i].parent === item.id)
            var itemData = {
              title: this.categoryTmpData[i].id.split("-")[this.categoryTmpData[i].id.split("-").length - 1],
              loading: false,
              id: this.categoryTmpData[i].id,
              children: []
            };
            data.push(itemData);
          }
        }

        for (var i in this.allmodules) {
          if (this.allmodules[i].category === item.id) {
            // console.log(this.allmodules[i] , item.id)
            // console.log(this.allmodules[i].category === item.id)
            var itemData = {
              title: this.allmodules[i].name,
              id: this.allmodules[i].id
            };
            data.push(itemData);
          }
        }
        callback(data);
      },
      loadEditmainData(item) {
        // console.log(this.allmodules)
        var data = [];

        for (var i in this.categoryTmpData) {
          if (this.categoryTmpData[i].parent === item) {
            var itemData = {
              title: this.categoryTmpData[i].id.split("-")[this.categoryTmpData[i].id.split("-").length - 1],
              loading: false,
              id: this.categoryTmpData[i].id,
              children: this.loadEditmainData(this.categoryTmpData[i].id)
            };
            data.push(itemData);
          }
        }

        for (var i in this.allmodules) {
          if (this.allmodules[i].category === item) {
            var itemData = {
              title: this.allmodules[i].name,
              id: this.allmodules[i].id
            };
            for (var j in this.editmainData.modules) {
              if (this.editmainData.modules[j] === this.allmodules[i].id) {
                itemData.checked = true;
              }
            }
            data.push(itemData);
          }
        }
        return data;
      }
    },

    created() {
      // 查看store中是否请求过modules数据，没有的话请求数据
      if (!this.$store.state.user.getModules) {
        this.$store.dispatch('init_user_modules');
      }
      ;
    },
    mounted() {
      this.getData();
      // this.$store.dispatch('init_module_auth');
      this.getCategoryData();
    }
  };
</script>

<style lang="less" scoped>
    .fooo {
        font-size: 14px;
        width: 120px
    }
</style>
