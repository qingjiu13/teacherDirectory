<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_id" label="">
        <uni-easyinput placeholder="用户ID，用于标识数据所属用户" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="university" label="就读院校" required>
        <uni-easyinput placeholder="就读院校" v-model="formData.university"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="major" label="所学专业" required>
        <uni-easyinput placeholder="所学专业" v-model="formData.major"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="rank" label="专业成绩" required>
        <uni-data-checkbox v-model="formData.rank" :localdata="formOptions.rank_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="status" label="学业状态" required>
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="plan" label="考研计划" required>
        <uni-easyinput placeholder="考研计划" v-model="formData.plan"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="studyMode" label="就读方式">
        <uni-data-checkbox :multiple="true" v-model="formData.studyMode"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="targetMajor" label="目标专业">
        <uni-easyinput placeholder="目标专业" v-model="formData.targetMajor"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="targetTypes" label="目标类型">
        <uni-data-checkbox :multiple="true" v-model="formData.targetTypes"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="targetAreas" label="目标地区">
        <uni-data-checkbox :multiple="true" v-model="formData.targetAreas"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="create_time" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="analysis_status" label="分析状态">
        <uni-data-checkbox v-model="formData.analysis_status" :localdata="formOptions.analysis_status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/feedback.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'feedback';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "user_id": "",
        "university": "",
        "major": "",
        "rank": "",
        "status": "",
        "plan": "",
        "studyMode": [],
        "targetMajor": "",
        "targetTypes": [],
        "targetAreas": [],
        "create_time": null,
        "analysis_status": "pending"
      }
      return {
        formData,
        formOptions: {
          "rank_localdata": [
            {
              "value": "前15%",
              "text": "前15%"
            },
            {
              "value": "前30%",
              "text": "前30%"
            },
            {
              "value": "前50%",
              "text": "前50%"
            },
            {
              "value": "其他",
              "text": "其他"
            }
          ],
          "status_localdata": [
            {
              "value": "未毕业",
              "text": "未毕业"
            },
            {
              "value": "已毕业",
              "text": "已毕业"
            },
            {
              "value": "在职",
              "text": "在职"
            }
          ],
          "analysis_status_localdata": [
            {
              "value": "pending",
              "text": "pending"
            },
            {
              "value": "analyzing",
              "text": "analyzing"
            },
            {
              "value": "completed",
              "text": "completed"
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("user_id,university,major,rank,status,plan,studyMode,targetMajor,targetTypes,targetAreas,create_time,analysis_status").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
