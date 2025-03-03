<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" field="user_id,university,major,rank,status,plan,studyMode,targetMajor,targetTypes,targetAreas,create_time,analysis_status,analysis_result" :where="queryWhere" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>user_id</text>
          <text>{{data.user_id}}</text>
        </view>
        <view>
          <text>就读院校</text>
          <text>{{data.university}}</text>
        </view>
        <view>
          <text>所学专业</text>
          <text>{{data.major}}</text>
        </view>
        <view>
          <text>专业成绩</text>
          <text>{{options.rank_valuetotext[data.rank]}}</text>
        </view>
        <view>
          <text>学业状态</text>
          <text>{{options.status_valuetotext[data.status]}}</text>
        </view>
        <view>
          <text>考研计划</text>
          <text>{{data.plan}}</text>
        </view>
        <view>
          <text>就读方式</text>
          <text>{{data.studyMode}}</text>
        </view>
        <view>
          <text>目标专业</text>
          <text>{{data.targetMajor}}</text>
        </view>
        <view>
          <text>目标类型</text>
          <text>{{data.targetTypes}}</text>
        </view>
        <view>
          <text>目标地区</text>
          <text>{{data.targetAreas}}</text>
        </view>
        <view>
          <text>create_time</text>
          <uni-dateformat :threshold="[0, 0]" :date="data.create_time"></uni-dateformat>
        </view>
        <view>
          <text>分析状态</text>
          <text>{{options.analysis_status_valuetotext[data.analysis_status]}}</text>
        </view>
        <view>
          <text>analysis_result</text>
          <text>{{data.analysis_result}}</text>
        </view>
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '../../js_sdk/validator/feedback.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: "feedback",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>
