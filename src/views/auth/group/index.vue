<template>
    <Row>
        <i-col class="margin-top-10">
            <i-col span="24">
                <Card>
                    <Row>
                        <i-col span="6">
                            <Input v-model="filterData.id" style="width: 200px" placeholder="请输入编号"></Input>
                            <Input v-model="filterData.name" style="width: 200px" placeholder="请输入待查询的组名"/>
                        </i-col>
                        <i-col span="6">
                            <Button type="primary" icon="ios-search" @click="freshData">查询</Button>
                        </i-col>
                    </Row>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        用户组列表
                    </p>
                    <Button slot="extra" type="primary" shape="circle" @click="freshData">
                        <Icon type="ios-loop-strong"></Icon>
                        刷新
                    </Button>
                    <Button slot="extra" type="success" shape="circle" @click="modal2 = true">
                        <Icon type="plus"></Icon>
                        添加
                    </Button>
                    <div>
                        <Table highlight-row :columns="mainColumns" :data="mainData"></Table>
                        <Page v-show="filterData.page.totalSize > 10" :total="filterData.page.totalSize"
                              @on-change="getPageData"
                              @on-page-size-change="setPageSize" class="pageTool" show-sizer :page-size-opts="[10,20,50,100,200,500,1000]"></Page>
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
            <!--<FormItem label="id">-->
            <!--<Input v-model="editmainData.id"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="组长">-->
            <!--<RadioGroup v-model="editmainData.leader.id" vertical>-->
            <!--<Radio v-for="item in groupPeople" :label="item.id" :key="item.id">-->
            <!--<span>{{ item.userName }}</span>-->
            <!--</Radio>-->
            <!--</RadioGroup>-->
            <!--</FormItem>-->
            <!--<FormItem label="副组长">-->
            <!--<CheckboxGroup v-model="editmainData.viceLeaderNames" vertical>-->
            <!--<Checkbox v-for="item in groupPeople" :label="item.id" :key="item.id">-->
            <!--<span>{{ item.userName }}</span>-->
            <!--</Checkbox>-->
            <!--</CheckboxGroup>-->
            <!--</FormItem>-->
            <!--<FormItem label="该用户组的角色">-->
            <!--<CheckboxGroup v-model="editmainData.roles">-->
            <!--<p v-for="item in allroles" :key="item.id">-->
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
                <FormItem label="编号">
                    <Input disabled v-model="editmainData.id"/>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model="editmainData.name"/>
                </FormItem>
                <FormItem label="组长">
                    <RadioGroup v-model="editmainData.leader.id" vertical>
                        <Radio v-for="item in groupPeople" :label="item.id" :key="item.id">
                            <span>{{ item.trueName }}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="副组长">
                    <CheckboxGroup v-model="editmainData.viceLeaderNames" vertical>
                        <Checkbox v-for="item in groupPeople" :label="item.id" :key="item.id">
                            <span>{{ item.trueName }}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="该用户组的角色">
                    <CheckboxGroup v-model="editmainData.roles">
                        <p v-for="item in allroles" :key="item.id">
                            <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                        </p>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="作用">
                    <Input v-model="editmainData.feature"/>
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
                <FormItem label="编号">
                    <Input v-model="addData.id"/>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model="addData.name"/>
                </FormItem>
                <!--<FormItem label="组长">-->
                <!--<RadioGroup v-model="addData.leader.id" vertical>-->
                <!--<Radio v-for="item in groupPeople" :label="item.id" :key="item.id">-->
                <!--<span>{{ item.userName }}</span>-->
                <!--</Radio>-->
                <!--</RadioGroup>-->
                <!--</FormItem>-->
                <!--<FormItem label="副组长">-->
                <!--<CheckboxGroup v-model="addData.viceLeaderNames" vertical>-->
                <!--<Checkbox v-for="item in groupPeople" :label="item.id" :key="item.id">-->
                <!--<span>{{ item.userName }}</span>-->
                <!--</Checkbox>-->
                <!--</CheckboxGroup>-->
                <!--</FormItem>-->
                <FormItem label="该用户组的角色">
                    <CheckboxGroup v-model="addData.roles">
                        <p v-for="item in allroles" :key="item.id">
                            <Checkbox :label="item.id">{{ item.name }}</Checkbox>
                        </p>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="作用">
                    <Input v-model="addData.feature"/>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="modal4" title="包含角色信息" width="400">
          <Row>
            <i-col span="12">
              <h3>包含角色：</h3>
              <p v-for="item in rolesDate.roles" :key="item">
                  <Tag class="fooo">{{ item }}</Tag></p>
            </i-col>
            <i-col span="12">
              <h3>说明：</h3>
              <p v-for="item in rolesDate.rolesname" :key="item">
                  <Tag class="fooo">{{ item }}</Tag></p>
            </i-col>
           </Row>
        </Modal>
        <Modal v-model="modal3" title="删除" @on-ok="deleteEditor">
            <Row>
                <i-col :span="6">
                    <Icon type="information-circled" color="red" size="60"></Icon>
                </i-col>
                <i-col :span="18">
                    确认删除
                    <Tag>{{editmainData.name}}</Tag>
                    ？
                </i-col>
            </Row>
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
        dataName: 'usergroup',
        modal1: false,
        modal2: false,
        modal3: false,
        modal4: false,
        mainColumns: [{
          title: '编号',
          key: 'id'
        }, {
          title: '组名',
          key: 'name'
        }, {
          title: '组长姓名',
          key: 'leader',
          render: (h, params) => {
            if (params && params.row) {
              return h('span', params.row.leader.trueName);
            }
          }
        }, {
          title: '副组长姓名',
          key: 'viceLeaders',
          render: (h, params) => {
            if (params && params.row) {
                return params.row.viceLeaders.map(item => {
                    return h('Tag', {props: {color: 'default'}}, item.trueName);
                });
            }
          }
        }, {
          title: '包含角色',
          key: 'roles',
          render: (h, params) => {
            if(params.row.roles.length>0){
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
        },{
          title: '作用',
          key: 'feature'
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
                on: {
                  click: () => {
                    // this.deleteEditor(params.row.id)
                    this.modal3 = true;
                    this.$data.editmainData = params.row;
                  }
                }
              }, '删除')
            ]);
          }
        }],
        mainData: [],
        rolesDate:{},
        editmainData: {
          leader: {
            userName: ''
          },
          viceLeaderNames: []
        },
        addData: {
          leader: {}
        },
        filterData: {
          page: {
            pageNumber: 1,
            totalSize: 0,
            pageSize: 10
          }
        },
        searchName: ''
      };
    },
    computed: {
      groupPeople() {
        return this.editmainData.id && this.groupMap && this.groupMap[this.editmainData.id] ? this.groupMap[this.editmainData.id].users : [];
      },
      ...mapGetters([
        'allroles',
        'allmodules',
        'groupMap'
      ])
    },
    methods: {
      getData() {
        this.$http.post('/' + this.$data.dataName + '/query', this.$data.filterData).then(res => {
          this.mainData = res.list.map((val) => {
            val.leader = val.leader ? val.leader : {id: ''};
            val.viceLeaders = val.viceLeaders ? val.viceLeaders : [];
            val.viceLeaderNames = val.viceLeaders.map(item => item.id);
            return val;
          });
          this.filterData.page.totalSize = res.totalSize;
          this.$Notice.success({
            title: '已获取最新数据'
          });
        });
      },
      // pickARow (currentRow, oldCurrentRow) {
      //   console.log(currentRow);
      //   this.$data.editmainData = currentRow;
      // },
      deleteEditor() {
        this.$http.delete('/' + this.$data.dataName + '/' + this.$data.editmainData.id).then(() => {
          this.$Notice.success({
            title: '删除成功'
          });
          this.endEdit();
        });
      },
      updateEditor() {
        let postMsg = this.generatePostMsg(this.$data.editmainData);
        if (postMsg) {
          console.log(postMsg);
          this.$http.post('/' + this.$data.dataName + '/update', postMsg).then(() => {
            this.$Notice.success({
              title: '修改成功'
            });
            this.endEdit();
          });
        }
      },
      addEditor() {
        let postMsg = {};
        if (this.$data.addData.id && this.$data.addData.roles) {
          postMsg = {
            id: this.$data.addData.id,
            name: this.$data.addData.name,
            roles: this.$data.addData.roles,
            feature: this.$data.addData.feature
          };
        }
        if (JSON.stringify(postMsg) != '{}') {
          this.$http.put('/' + this.$data.dataName, postMsg).then(() => {
            this.$Notice.success({
              title: '添加成功'
            });
            this.addData = {
              leader: {}
            };
            this.endEdit();
          });
        } else {
          this.$Notice.error({
            title: '添加失败！填写组名及角色'
          });
        }
      },
      views(data) {
        this.modal4 = true;
        this.rolesDate = data;
      },
      generatePostMsg(srcData) {
        if (srcData.leader) {
          srcData.viceLeaders.forEach(vicel => {
            if (vicel.id === srcData.leader.id) {
              this.$Message.error('组长不能同时是副组长');
              return null;
            }
          });
          return {
            id: srcData.id,
            name: srcData.name,
            leader: {id: srcData.leader.id},
            viceLeaders: srcData.viceLeaderNames.map(name => {
              return {id: name};
            }),
            roles: srcData.roles,
            feature: srcData.feature
          };
        } else {
          this.$Message.error('必须指定组长');
          return null;
        }
      },
      endEdit() {
        this.$store.dispatch('init_user_groups');
        // this.$store.dispatch('init_user_admins');
        this.freshData();
      },
      freshData() {
        this.getData();
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
      }
    },
    created() {
      // 查看store中是否请求过roles(角色)数据，没有的话请求数据
      if (!this.$store.state.user.getRoles) {
        this.$store.dispatch('init_user_roles');
      }
      //  groupMap 依赖 group
      // 查看store中是否请求过group（用户组）数据，没有的话请求数据
      if (!this.$store.state.user.getGroup) {
        this.$store.dispatch('init_user_groups');
      }
      //  groupMap 依赖 admins
      // 查看store中是否请求过group（用户组）数据，没有的话请求数据
      if (!this.$store.state.user.getAdmins) {
        this.$store.dispatch('init_user_admins');
      }
      // this.$http.get('/user/edit/alladmins').then(res => {
      //   commit('set_all_admins', res);
      //   resolve(res);
      // })
    },
    mounted() {
      this.getData();
    }
  };
</script>

<style lang="less" scoped>
  .fooo {
          font-size: 14px;
          width: 120px
      }
</style>
