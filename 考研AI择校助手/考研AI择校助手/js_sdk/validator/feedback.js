// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "user_id": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "university": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "就读院校",
    "label": "就读院校"
  },
  "major": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "所学专业",
    "label": "所学专业"
  },
  "rank": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "range": [
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
        ]
      }
    ],
    "title": "专业成绩",
    "label": "专业成绩"
  },
  "status": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "range": [
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
        ]
      }
    ],
    "title": "学业状态",
    "label": "学业状态"
  },
  "plan": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "考研计划",
    "label": "考研计划"
  },
  "studyMode": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "就读方式",
    "label": "就读方式"
  },
  "targetMajor": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "目标专业",
    "label": "目标专业"
  },
  "targetTypes": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "目标类型",
    "label": "目标类型"
  },
  "targetAreas": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "目标地区",
    "label": "目标地区"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "analysis_status": {
    "rules": [
      {
        "format": "string"
      },
      {
        "range": [
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
      }
    ],
    "title": "分析状态",
    "defaultValue": "pending",
    "label": "分析状态"
  },
  "analysis_result": {
    "rules": [
      {
        "format": "object"
      }
    ]
  }
}

const enumConverter = {
  "rank_valuetotext": {
    "前15%": "前15%",
    "前30%": "前30%",
    "前50%": "前50%",
    "其他": "其他"
  },
  "status_valuetotext": {
    "未毕业": "未毕业",
    "已毕业": "已毕业",
    "在职": "在职"
  },
  "analysis_status_valuetotext": {
    "pending": "pending",
    "analyzing": "analyzing",
    "completed": "completed"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
