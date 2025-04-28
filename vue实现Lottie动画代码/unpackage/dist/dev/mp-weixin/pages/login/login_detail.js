"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const router_Router = require("../../router/Router.js");
const components_combobox_graduate_school_major = require("../../components/combobox/graduate_school_major.js");
const components_combobox_undergraduate = require("../../components/combobox/undergraduate.js");
const _2886___ = require("../../2886所大学.js");
const majorData = [
  "哲学",
  "逻辑学",
  "宗教学",
  "伦理学",
  "经济学",
  "经济统计学",
  "国民经济管理",
  "资源与环境经济学",
  "商务经济学",
  "能源经济",
  "劳动经济学",
  "经济工程",
  "数字经济",
  "财政学",
  "税收学",
  "国际税收",
  "金融学",
  "金融工程",
  "保险学",
  "投资学",
  "金融数学",
  "信用管理",
  "经济与金融",
  "精算学",
  "互联网金融",
  "金融科技",
  "金融审计",
  "国际经济与贸易",
  "贸易经济",
  "国际经济发展合作",
  "法学",
  "知识产权",
  "监狱学",
  "信用风险管理与法律防控",
  "国际经贸规则",
  "司法警察学",
  "社区矫正",
  "纪检监察",
  "国际法",
  "司法鉴定学",
  "国家安全学",
  "海外利益安全",
  "政治学与行政学",
  "国际政治",
  "外交学",
  "国际事务与国际关系",
  "政治学、经济学与哲学",
  "国际组织与全球治理",
  "社会学",
  "社会工作",
  "人类学",
  "女性学",
  "家政学",
  "老年学",
  "社会政策",
  "民族学",
  "科学社会主义",
  "中国共产党历史",
  "思想政治教育",
  "马克思主义理论",
  "工会学",
  "治安学",
  "侦查学",
  "边防管理",
  "禁毒学",
  "警犬技术",
  "经济犯罪侦查",
  "边防指挥",
  "消防指挥",
  "警卫学",
  "公安情报学",
  "犯罪学",
  "公安管理学",
  "涉外警务",
  "国内安全保卫",
  "警务指挥与战术",
  "技术侦查学",
  "海警执法",
  "公安政治工作",
  "移民管理",
  "出入境管理",
  "反恐警务",
  "消防政治工作",
  "铁路警务",
  "教育学",
  "科学教育",
  "人文教育",
  "教育技术学",
  "艺术教育",
  "学前教育",
  "小学教育",
  "特殊教育",
  "华文教育",
  "教育康复学",
  "卫生教育",
  "认知科学与技术",
  "融合教育",
  "劳动教育",
  "家庭教育",
  "孤独症儿童教育",
  "人工智能教育",
  "婴幼儿发展与健康管理",
  "体育教育",
  "运动训练",
  "社会体育指导与管理",
  "武术与民族传统体育",
  "运动人体科学",
  "运动康复",
  "休闲体育",
  "体能训练",
  "冰雪运动",
  "电子竞技运动与管理",
  "智能体育工程",
  "体育旅游",
  "运动能力开发",
  "足球运动",
  "马术运动与管理",
  "体育康养",
  "航空运动",
  "汉语言文学",
  "汉语言",
  "汉语国际教育",
  "中国少数民族语言文学",
  "古典文献学",
  "应用语言学",
  "秘书学",
  "中国语言与文化",
  "手语翻译",
  "数字人文",
  "中国古典学",
  "汉学与中国学",
  "应用中文",
  "英语",
  "俄语",
  "德语",
  "法语",
  "西班牙语",
  "阿拉伯语",
  "日语",
  "波斯语",
  "朝鲜语",
  "菲律宾语",
  "梵语巴利语",
  "印度尼西亚语",
  "印地语",
  "柬埔寨语",
  "老挝语",
  "缅甸语",
  "马来语",
  "蒙古语",
  "僧伽罗语",
  "泰语",
  "乌尔都语",
  "希伯来语",
  "越南语",
  "豪萨语",
  "斯瓦希里语",
  "阿尔巴尼亚语",
  "保加利亚语",
  "波兰语",
  "捷克语",
  "斯洛伐克语",
  "罗马尼亚语",
  "葡萄牙语",
  "瑞典语",
  "塞尔维亚语",
  "土耳其语",
  "希腊语",
  "匈牙利语",
  "意大利语",
  "泰米尔语",
  "普什图语",
  "世界语",
  "孟加拉语",
  "尼泊尔语",
  "克罗地亚语",
  "荷兰语",
  "芬兰语",
  "乌克兰语",
  "挪威语",
  "丹麦语",
  "冰岛语",
  "爱尔兰语",
  "拉脱维亚语",
  "立陶宛语",
  "斯洛文尼亚语",
  "爱沙尼亚语",
  "马耳他语",
  "哈萨克语",
  "乌兹别克语",
  "祖鲁语",
  "拉丁语",
  "翻译",
  "商务英语",
  "阿姆哈拉语",
  "吉尔吉斯语",
  "索马里语",
  "土库曼语",
  "加泰罗尼亚语",
  "约鲁巴语",
  "亚美尼亚语",
  "马达加斯加语",
  "格鲁吉亚语",
  "阿塞拜疆语",
  "阿非利卡语",
  "马其顿语",
  "塔吉克语",
  "茨瓦纳语",
  "恩德贝莱语",
  "科摩罗语",
  "克里奥尔语",
  "绍纳语",
  "提格雷尼亚语",
  "白俄罗斯语",
  "毛利语",
  "汤加语",
  "萨摩亚语",
  "库尔德语",
  "比斯拉马语",
  "达里语",
  "德顿语",
  "迪维希语",
  "斐济语",
  "库克群岛毛利语",
  "隆迪语",
  "卢森堡语",
  "卢旺达语",
  "纽埃语",
  "皮金语",
  "切瓦语",
  "塞苏陀语",
  "桑戈语",
  "新闻学",
  "广播电视学",
  "广告学",
  "传播学",
  "出版学",
  "网络与新媒体",
  "数字出版",
  "时尚传播",
  "国际新闻与传播",
  "会展",
  "历史学",
  "世界史",
  "考古学",
  "文物与博物馆学",
  "文物保护技术",
  "外国语言与外国历史",
  "文化遗产",
  "古文字学",
  "科学史",
  "数学与应用数学",
  "信息与计算科学",
  "数理基础科学",
  "数据计算及应用",
  "物理学",
  "应用物理学",
  "核物理",
  "声学",
  "系统科学与工程",
  "量子信息科学",
  "化学",
  "应用化学",
  "化学生物学",
  "分子科学与工程",
  "能源化学",
  "化学测量学与技术",
  "资源化学",
  "天文学",
  "地理科学",
  "自然地理与资源环境",
  "人文地理与城乡规划",
  "地理信息科学",
  "大气科学",
  "应用气象学",
  "气象技术与工程",
  "地球系统科学",
  "海洋科学",
  "海洋技术",
  "海洋资源与环境",
  "军事海洋学",
  "海洋科学与技术",
  "地球物理学",
  "空间科学与技术",
  "防灾减灾科学与工程",
  "行星科学",
  "地质学",
  "地球化学",
  "地球信息科学与技术",
  "古生物学",
  "生物科学",
  "生物技术",
  "生物信息学",
  "生态学",
  "整合科学",
  "神经科学",
  "心理学",
  "应用心理学",
  "统计学",
  "应用统计学",
  "数据科学",
  "生物统计学",
  "理论与应用力学",
  "工程力学",
  "机械工程",
  "机械设计制造及其自动化",
  "材料成型及控制工程",
  "机械电子工程",
  "工业设计",
  "过程装备与控制工程",
  "车辆工程",
  "汽车服务工程",
  "机械工艺技术",
  "微机电系统工程",
  "机电技术教育",
  "汽车维修工程教育",
  "智能制造工程",
  "智能车辆工程",
  "仿生科学与工程",
  "新能源汽车工程",
  "增材制造工程",
  "智能交互设计",
  "应急装备技术与工程",
  "农林智能装备工程",
  "测控技术与仪器",
  "精密仪器",
  "智能感知工程",
  "材料科学与工程",
  "材料物理",
  "材料化学",
  "冶金工程",
  "金属材料工程",
  "无机非金属材料工程",
  "高分子材料与工程",
  "复合材料与工程",
  "粉体材料科学与工程",
  "宝石及材料工艺学",
  "焊接技术与工程",
  "功能材料",
  "纳米材料与技术",
  "新能源材料与器件",
  "材料设计科学与工程",
  "复合材料成型工程",
  "智能材料与结构",
  "光电信息材料与器件",
  "生物材料",
  "材料智能技术",
  "电子信息材料",
  "软物质科学与工程",
  "稀土材料科学与工程",
  "能源与动力工程",
  "能源与环境系统工程",
  "新能源科学与工程",
  "储能科学与工程",
  "能源服务工程",
  "氢能科学与工程",
  "可持续能源",
  "电气工程及其自动化",
  "智能电网信息工程",
  "光源与照明",
  "电气工程与智能控制",
  "电机电器智能化",
  "电缆工程",
  "能源互联网工程",
  "智慧能源工程",
  "电动载运工程",
  "大功率半导体科学与工程",
  "电子信息工程",
  "电子科学与技术",
  "通信工程",
  "微电子科学与工程",
  "光电信息科学与工程",
  "信息工程",
  "广播电视工程",
  "水声工程",
  "电子封装技术",
  "集成电路设计与集成系统",
  "医学信息工程",
  "电磁场与无线技术",
  "电波传播与天线",
  "电子信息科学与技术",
  "电信工程及管理",
  "应用电子技术教育",
  "人工智能",
  "海洋信息工程",
  "柔性电子学",
  "智能测控工程",
  "智能视觉工程",
  "智能视听工程",
  "自动化",
  "轨道交通信号与控制",
  "机器人工程",
  "邮政工程",
  "核电技术与控制工程",
  "智能装备与系统",
  "工业智能",
  "智能工程与创意设计",
  "计算机科学与技术",
  "软件工程",
  "网络工程",
  "信息安全",
  "物联网工程",
  "数字媒体技术",
  "智能科学与技术",
  "空间信息与数字技术",
  "电子与计算机工程",
  "数据科学与大数据技术",
  "网络空间安全",
  "新媒体技术",
  "电影制作",
  "保密技术",
  "服务科学与工程",
  "虚拟现实技术",
  "区块链工程",
  "密码科学与技术",
  "工业软件",
  "土木工程",
  "建筑环境与能源应用工程",
  "给排水科学与工程",
  "建筑电气与智能化",
  "城市地下空间工程",
  "道路桥梁与渡河工程",
  "铁道工程",
  "智能建造",
  "土木、水利与海洋工程",
  "土木、水利与交通工程",
  "城市水系统工程",
  "智能建造与智慧交通",
  "工程软件",
  "水利水电工程",
  "水文与水资源工程",
  "港口航道与海岸工程",
  "水务工程",
  "水利科学与工程",
  "智慧水利",
  "测绘工程",
  "遥感科学与技术",
  "导航工程",
  "地理国情监测",
  "地理空间信息工程",
  "时空信息工程",
  "化学工程与工艺",
  "制药工程",
  "资源循环科学与工程",
  "能源化学工程",
  "化学工程与工业生物工程",
  "化工安全工程",
  "涂料工程",
  "精细化工",
  "智能分子工程",
  "地质工程",
  "勘查技术与工程",
  "资源勘查工程",
  "地下水科学与工程",
  "旅游地学与规划工程",
  "智能地球探测",
  "资源环境大数据工程",
  "采矿工程",
  "石油工程",
  "矿物加工工程",
  "油气储运工程",
  "矿物资源工程",
  "海洋油气工程",
  "智能采矿工程",
  "碳储科学与工程",
  "纺织工程",
  "服装设计与工程",
  "非织造材料与工程",
  "服装设计与工艺教育",
  "丝绸设计与工程",
  "轻化工程",
  "包装工程",
  "印刷工程",
  "香料香精技术与工程",
  "化妆品技术与工程",
  "生物质能源与材料",
  "生物质技术与工程",
  "交通运输",
  "交通工程",
  "航海技术",
  "轮机工程",
  "飞行技术",
  "交通设备与控制工程",
  "救助与打捞工程",
  "船舶电子电气工程",
  "轨道交通电气与控制",
  "邮轮工程与管理",
  "智慧交通",
  "智能运输工程",
  "船舶与海洋工程",
  "海洋工程与技术",
  "海洋资源开发技术",
  "海洋机器人",
  "智慧海洋技术",
  "智能海洋装备",
  "航空航天工程",
  "飞行器设计与工程",
  "飞行器制造工程",
  "飞行器动力工程",
  "飞行器环境与生命保障工程",
  "飞行器质量与可靠性",
  "飞行器适航技术",
  "飞行器控制与信息工程",
  "无人驾驶航空器系统工程",
  "智能飞行器技术",
  "空天智能电推进技术",
  "飞行器运维工程",
  "武器系统与工程",
  "武器发射工程",
  "探测制导与控制技术",
  "弹药工程与爆炸技术",
  "特种能源技术与工程",
  "装甲车辆工程",
  "信息对抗技术",
  "智能无人系统技术",
  "核工程与核技术",
  "辐射防护与核安全",
  "工程物理",
  "核化工与核燃料工程",
  "农业工程",
  "农业机械化及其自动化",
  "农业电气化",
  "农业建筑环境与能源工程",
  "农业水利工程",
  "土地整治工程",
  "农业智能装备工程",
  "森林工程",
  "木材科学与工程",
  "林产化工",
  "家具设计与工程",
  "木结构建筑与材料",
  "环境科学与工程",
  "环境工程",
  "环境科学",
  "环境生态工程",
  "环保设备工程",
  "资源环境科学",
  "水质科学与技术",
  "生物医学工程",
  "假肢矫形工程",
  "临床工程技术",
  "康复工程",
  "健康科学与技术",
  "食品科学与工程",
  "食品质量与安全",
  "粮食工程",
  "乳品工程",
  "酿酒工程",
  "葡萄与葡萄酒工程",
  "食品营养与检验教育",
  "烹饪与营养教育",
  "食品安全与检测",
  "食品营养与健康",
  "食用菌科学与工程",
  "白酒酿造工程",
  "咖啡科学与工程",
  "建筑学",
  "城乡规划",
  "风景园林",
  "历史建筑保护工程",
  "人居环境科学与技术",
  "城市设计",
  "智慧建筑与建造",
  "安全工程",
  "应急技术与管理",
  "职业卫生工程",
  "安全生产监管",
  "智慧应急",
  "生物工程",
  "生物制药",
  "合成生物学",
  "刑事科学技术",
  "消防工程",
  "交通管理工程",
  "安全防范工程",
  "公安视听技术",
  "抢险救援指挥与技术",
  "火灾勘查",
  "网络安全与执法",
  "核生化消防",
  "海警舰艇指挥与技术",
  "数据警务技术",
  "食品药品环境犯罪侦查技术",
  "未来机器人",
  "交叉工程",
  "低空技术与工程",
  "集成电路科学与工程",
  "碳中和科学与工程",
  "智慧城市与空间规划",
  "农学",
  "园艺",
  "植物保护",
  "植物科学与技术",
  "种子科学与工程",
  "设施农业科学与工程",
  "茶学",
  "烟草",
  "应用生物科学",
  "农艺教育",
  "园艺教育",
  "智慧农业",
  "菌物科学与工程",
  "农药化肥",
  "生物农药科学与工程",
  "生物育种科学",
  "生物育种技术",
  "农业资源与环境",
  "野生动物与自然保护区管理",
  "水土保持与荒漠化防治",
  "生物质科学与工程",
  "土地科学与技术",
  "湿地保护与恢复",
  "国家公园建设与管理",
  "生态修复学",
  "动物科学",
  "蚕学",
  "蜂学",
  "经济动物学",
  "马业科学",
  "饲料工程",
  "智慧牧业科学与工程",
  "动物医学",
  "动物药学",
  "动植物检疫",
  "实验动物学",
  "中兽医学",
  "兽医公共卫生",
  "林学",
  "园林",
  "森林保护",
  "经济林",
  "智慧林业",
  "水产养殖学",
  "海洋渔业科学与技术",
  "水族科学与技术",
  "水生动物医学",
  "草业科学",
  "草坪科学与工程",
  "基础医学",
  "生物医学",
  "生物医学科学",
  "临床医学",
  "麻醉学",
  "医学影像学",
  "眼视光医学",
  "精神医学",
  "放射医学",
  "儿科学",
  "口腔医学",
  "预防医学",
  "食品卫生与营养学",
  "妇幼保健医学",
  "卫生监督",
  "全球健康学",
  "运动与公共健康",
  "中医学",
  "针灸推拿学",
  "藏医学",
  "蒙医学",
  "维医学",
  "壮医学",
  "哈医学",
  "傣医学",
  "回医学",
  "中医康复学",
  "中医养生学",
  "中医儿科学",
  "中医骨伤科学",
  "中西医临床医学",
  "药学",
  "药物制剂",
  "临床药学",
  "药事管理",
  "药物分析",
  "药物化学",
  "海洋药学",
  "化妆品科学与技术",
  "药物经济与管理",
  "中药资源与开发",
  "藏药学",
  "蒙药学",
  "中药制药",
  "中草药栽培与鉴定",
  "法医学",
  "医学检验技术",
  "医学实验技术",
  "医学影像技术",
  "眼视光学",
  "康复治疗学",
  "口腔医学技术",
  "卫生检验与检疫",
  "听力与言语康复学",
  "康复物理治疗",
  "康复作业治疗",
  "智能医学工程",
  "生物医药数据科学",
  "智能影像工程",
  "医工学",
  "医疗器械与装备工程",
  "健康与医疗保障",
  "老年医学与健康",
  "护理学",
  "助产学",
  "管理科学",
  "信息管理与信息系统",
  "工程管理",
  "房地产开发与管理",
  "工程造价",
  "保密管理",
  "邮政管理",
  "大数据管理与应用",
  "工程审计",
  "计算金融",
  "应急管理",
  "工商管理",
  "市场营销",
  "会计学",
  "财务管理",
  "国际商务",
  "人力资源管理",
  "审计学",
  "资产评估",
  "物业管理",
  "文化产业管理",
  "劳动关系",
  "体育经济与管理",
  "财务会计教育",
  "市场营销教育",
  "零售业管理",
  "创业管理",
  "海关稽查",
  "内部审计",
  "农林经济管理",
  "农村区域发展",
  "乡村治理",
  "公共事业管理",
  "行政管理",
  "劳动与社会保障",
  "土地资源管理",
  "城市管理",
  "海关管理",
  "交通管理",
  "海事管理",
  "公共关系学",
  "健康服务与管理",
  "海警后勤管理",
  "医疗产品管理",
  "医疗保险",
  "养老服务管理",
  "海关检验检疫安全",
  "海外安全管理",
  "自然资源登记与管理",
  "慈善管理",
  "航空安防管理",
  "无障碍管理",
  "人才发展与管理",
  "图书馆学",
  "档案学",
  "信息资源管理",
  "物流管理",
  "物流工程",
  "采购管理",
  "供应链管理",
  "工业工程",
  "标准化工程",
  "质量管理工程",
  "电子商务",
  "电子商务及法律",
  "跨境电子商务",
  "旅游管理",
  "酒店管理",
  "会展经济与管理",
  "旅游管理与服务教育",
  "国际邮轮管理",
  "艺术史论",
  "艺术管理",
  "非物质文化遗产保护",
  "音乐表演",
  "音乐学",
  "作曲与作曲技术理论",
  "舞蹈表演",
  "舞蹈学",
  "舞蹈编导",
  "舞蹈教育",
  "航空服务艺术与管理",
  "流行音乐",
  "音乐治疗",
  "流行舞蹈",
  "音乐教育",
  "冰雪舞蹈表演",
  "舞蹈治疗",
  "音乐科技",
  "表演",
  "戏剧学",
  "电影学",
  "戏剧影视文学",
  "广播电视编导",
  "戏剧影视导演",
  "戏剧影视美术设计",
  "录音艺术",
  "播音与主持艺术",
  "动画",
  "影视摄影与制作",
  "影视技术",
  "戏剧教育",
  "曲艺",
  "音乐剧",
  "数字戏剧",
  "数字演艺设计",
  "智能影像艺术",
  "美术学",
  "绘画",
  "雕塑",
  "摄影",
  "书法学",
  "中国画",
  "实验艺术",
  "跨媒体艺术",
  "文物保护与修复",
  "漫画",
  "纤维艺术",
  "科技艺术",
  "美术教育",
  "虚拟空间艺术",
  "艺术设计学",
  "视觉传达设计",
  "环境设计",
  "产品设计",
  "服装与服饰设计",
  "公共艺术",
  "工艺美术",
  "数字媒体艺术",
  "艺术与科技",
  "陶瓷艺术设计",
  "新媒体艺术",
  "包装设计",
  "珠宝首饰设计与工艺",
  "人居设计",
  "游戏艺术设计"
];
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  onPageScroll() {
    common_vendor.index.$emit("page-scroll");
  },
  components: {
    ChoiceSelected
  },
  onLoad() {
    this.loadUniversityData();
    this.initSchoolAndMajorSearch();
  },
  data() {
    return {
      formData: new UTSJSONObject({
        nickname: "",
        gender: "男",
        phone: "",
        schoolIndex: -1,
        majorIndex: -1,
        targetSchoolIndex: -1,
        targetMajorIndex: -1,
        gradeIndex: -1,
        targetSchool: "",
        targetMajor: ""
        // 目标专业值
      }),
      schoolList: [],
      majorList: [],
      targetSchoolList: [],
      targetMajorList: [],
      allGradeList: ["大一", "大二", "大三", "大四", "研一", "研二", "研三"],
      userRole: "学生",
      showAgreementModal: false,
      pendingUserInfo: null,
      // 分离筛选器状态
      graduateStore: null,
      schoolStore: null,
      majorStore: null
      // 本科专业数据状态
    };
  },
  computed: new UTSJSONObject({
    /**
     * 根据用户角色筛选年级列表
     * @returns {Array} 筛选后的年级列表
     */
    gradeList() {
      if (this.userRole === "老师") {
        return this.allGradeList.filter((grade) => {
          return grade.includes("研");
        });
      } else {
        return this.allGradeList.filter((grade) => {
          return grade.includes("大");
        });
      }
    },
    /**
     * @description 获取过滤后的目标学校列表
     * @returns {Array} 过滤后的目标学校列表
     */
    filteredTargetSchoolList() {
      if (!this.graduateStore)
        return [];
      return components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    /**
     * @description 获取过滤后的目标专业列表
     * @returns {Array} 过滤后的目标专业列表
     */
    filteredTargetMajorList() {
      if (!this.graduateStore)
        return [];
      return components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(this.graduateStore);
    },
    /**
     * @description 获取过滤后的本科学校列表
     * @returns {Array} 过滤后的本科学校列表
     */
    filteredSchoolList() {
      if (!this.schoolStore)
        return [];
      return this.schoolStore.getters.filteredData(this.schoolStore.state);
    }
  }),
  methods: {
    /**
     * @description 初始化学校和专业搜索引擎
     */
    initSchoolAndMajorSearch() {
      this.schoolStore = components_combobox_undergraduate.createDataModule(_2886___.schoolData);
      this.majorStore = components_combobox_undergraduate.createDataModule(majorData);
      this.schoolStore.actions.initSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }));
      this.majorStore.actions.initSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }));
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
    },
    /**
     * @description 处理学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleSchoolSelect(index = null, school = null) {
      this.formData.schoolIndex = index;
    },
    /**
     * @description 处理专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleMajorSelect(index = null, major = null) {
      this.formData.majorIndex = index;
    },
    /**
     * @description 处理目标学校选择 - 级联选择的父项
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleTargetSchoolSelect(index = null, school = null) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }), school);
      this.resetMajorSelection();
    },
    /**
     * @description 处理目标专业选择 - 级联选择的子项
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleTargetMajorSelect(index = null, major = null) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
    },
    /**
     * @description 处理年级选择
     * @param {Number} index - 选择的索引
     */
    handleGradeSelect(index = null) {
      this.formData.gradeIndex = index;
    },
    /**
     * @description 处理学校搜索输入 - 使用本科学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword = null) {
      this.schoolStore.actions.updateFilterKeyword(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }), keyword);
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:373", `学校搜索: "${keyword}", 结果数: ${this.schoolList.length}`);
    },
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword = null) {
      this.majorStore.actions.updateFilterKeyword(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }), keyword);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:392", `专业搜索: "${keyword}", 结果数: ${this.majorList.length}`);
    },
    /**
     * @description 处理目标学校搜索输入 - 使用研究生学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:400", "处理学校搜索:", keyword);
      if (!keyword || keyword.trim() === "") {
        const allSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = allSchools;
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:406", "关键词为空，显示前50所学校");
        return null;
      }
      if (!this.graduateStore.schoolFuse) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:412", "Fuse搜索引擎未初始化，强制重新初始化中...");
        components_combobox_graduate_school_major.GraduateStore.actions.reinitializeSearch(new UTSJSONObject({
          commit: (mutation = null, payload = null) => {
            components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
          },
          state: this.graduateStore
        }));
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setSchoolKeyword(this.graduateStore, keyword);
      const filteredSchools = components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(this.graduateStore);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:427", "过滤后的学校列表:", filteredSchools);
      this.targetSchoolList = filteredSchools;
      this.$nextTick(() => {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:435", `最终显示学校数量: ${filteredSchools.length}`);
        if (this.$refs.targetSchoolDropdown) {
          this.$refs.targetSchoolDropdown.$forceUpdate();
        }
      });
    },
    /**
     * @description 处理目标专业搜索输入 - 使用研究生专业搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:449", "处理专业搜索:", keyword);
      if (!this.graduateStore.selectedSchool) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:453", "未选择学校，专业搜索无效");
        return null;
      }
      if (!keyword || keyword.trim() === "") {
        const allMajors = this.graduateStore.schools[this.graduateStore.selectedSchool] || [];
        this.targetMajorList = allMajors.slice(0, 20);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:461", "关键词为空，显示前20个专业");
        return null;
      }
      if (!this.graduateStore.majorFuse) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:467", "专业搜索引擎未初始化，重新初始化中...");
        components_combobox_graduate_school_major.GraduateStore.mutations.setSelectedSchool(this.graduateStore, this.graduateStore.selectedSchool);
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(this.graduateStore, keyword);
      const filteredMajors = components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(this.graduateStore);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:477", "过滤后的专业列表:", filteredMajors);
      this.targetMajorList = filteredMajors;
      this.$nextTick(() => {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:485", `最终显示专业数量: ${filteredMajors.length}`);
        if (this.$refs.targetMajorDropdown) {
          this.$refs.targetMajorDropdown.$forceUpdate();
        }
      });
    },
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      const dropdowns = ["schoolDropdown", "majorDropdown", "targetSchoolDropdown", "targetMajorDropdown"];
      dropdowns.forEach((dropdown) => {
        if (this.$refs && this.$refs[dropdown]) {
          this.$refs[dropdown].closeDropdown && this.$refs[dropdown].closeDropdown();
        }
      });
    },
    /**
     * @description 获取当前用户角色
     * @returns {string} 用户角色
     */
    getUserRole() {
      try {
        if (store_index.store.state && store_index.store.state.user && store_index.store.state.user.baseInfo) {
          return store_index.store.state.user.baseInfo.userInfo.role;
        }
        const localRole = common_vendor.index.getStorageSync("userRole");
        if (localRole === "teacher") {
          return "老师";
        } else if (localRole === "student") {
          return "学生";
        } else {
          return "学生";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:528", "获取用户角色出错:", error);
        return "学生";
      }
    },
    /**
     * @description 加载大学数据
     */
    loadUniversityData() {
      try {
        this.initGraduateData();
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:541", "成功加载学校数据");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:543", "加载大学数据失败:", error);
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.schoolList = defaultSchools;
        this.targetSchoolList = defaultSchools;
        common_vendor.index.showToast({
          title: "加载大学数据失败，使用默认列表",
          icon: "none"
        });
      }
    },
    /**
     * @description 关闭协议确认浮窗
     */
    closeModal() {
      this.showAgreementModal = false;
      this.pendingUserInfo = null;
    },
    /**
     * @description 确认同意协议并提交信息
     */
    confirmAgreement() {
      if (this.pendingUserInfo) {
        store_index.store.commit("user/baseInfo/UPDATE_USER_INFO", this.pendingUserInfo);
        common_vendor.index.showToast({
          title: "信息保存成功",
          icon: "success"
        });
        this.showAgreementModal = false;
        setTimeout(() => {
          router_Router.Navigator.toMine();
        }, 1500);
      }
    },
    /**
     * @description 提交表单信息
     */
    submitForm() {
      try {
        const currentRole = this.getUserRole();
        const roleCode = currentRole === "老师" ? "teacher" : "student";
        const userInfo = new UTSJSONObject({
          name: this.formData.nickname || "",
          gender: this.formData.gender || "",
          phoneNumber: this.formData.phone || "",
          role: roleCode,
          userInfo: new UTSJSONObject({
            school: this.formData.schoolIndex >= 0 ? this.schoolList[this.formData.schoolIndex] : "",
            major: this.formData.majorIndex >= 0 ? this.majorList[this.formData.majorIndex] : "",
            studentGrade: currentRole === "学生" && this.formData.gradeIndex >= 0 ? this.gradeList[this.formData.gradeIndex] : "",
            teacherGrade: currentRole === "老师" && this.formData.gradeIndex >= 0 ? this.gradeList[this.formData.gradeIndex] : ""
          })
        });
        if (currentRole === "学生") {
          userInfo.userInfo.targetSchool = this.formData.targetSchool || "";
          userInfo.userInfo.targetMajor = this.formData.targetMajor || "";
        }
        if (currentRole === "老师") {
          this.pendingUserInfo = userInfo;
          this.showAgreementModal = true;
          return null;
        }
        store_index.store.commit("user/baseInfo/UPDATE_USER_INFO", userInfo);
        common_vendor.index.showToast({
          title: "信息保存成功",
          icon: "success"
        });
        setTimeout(() => {
          router_Router.Navigator.toMine();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:645", "提交表单时出错:", error);
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * @description 验证表单内容 - 所有字段均为选填，无需验证
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      return true;
    },
    /**
     * @description 初始化考研数据
     */
    initGraduateData() {
      try {
        this.graduateStore = UTS.JSON.parse(UTS.JSON.stringify(components_combobox_graduate_school_major.GraduateStore.state));
        if (!this.graduateStore.schools) {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:672", "研究生学校数据不完整");
          throw new Error("学校数据结构不完整");
        }
        components_combobox_graduate_school_major.GraduateStore.mutations.initSchoolFuse(this.graduateStore);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:678", "Fuse引擎初始化状态:", !!this.graduateStore.schoolFuse);
        if (this.graduateStore.schoolFuse) {
          common_vendor.index.__f__("log", "at pages/login/login_detail.vue:682", "Fuse配置验证:", new UTSJSONObject({
            keys: this.graduateStore.schoolFuse._docs[0] ? Object.keys(this.graduateStore.schoolFuse._docs[0]) : "未知",
            ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
            threshold: this.graduateStore.schoolFuse.options.threshold
          }));
        } else {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:688", "Fuse.js搜索引擎初始化失败");
        }
        const graduateSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = graduateSchools;
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:695", "初始化考研数据成功");
        return true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:698", "初始化考研数据失败:", error);
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.targetSchoolList = defaultSchools;
        return false;
      }
    },
    /**
     * @description 处理学校变更事件
     * @param {String} school - 变更后的学校名称
     */
    handleSchoolChange(school = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:712", "学校变更事件:", school);
      if (!school) {
        this.resetMajorSelection();
        return null;
      }
      components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }), school);
      if (this.graduateStore.schools[school]) {
        this.targetMajorList = this.graduateStore.schools[school].slice(0, 20);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:730", `已加载 ${school} 的专业列表，共 ${this.targetMajorList.length} 个`);
      } else {
        this.resetMajorSelection();
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:733", `${school} 没有关联的专业数据`);
      }
    },
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = "";
    }
  },
  created() {
    this.userRole = this.getUserRole();
    common_vendor.index.__f__("log", "at pages/login/login_detail.vue:748", "当前用户角色:", this.userRole);
  },
  // 监听页面显示时更新角色
  onShow() {
    const newRole = this.getUserRole();
    if (this.userRole !== newRole) {
      this.userRole = newRole;
      this.formData.gradeIndex = -1;
    }
    if (this.graduateStore) {
      components_combobox_graduate_school_major.GraduateStore.actions.reinitializeSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        },
        state: this.graduateStore
      }));
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:769", "Fuse引擎强制重新初始化完成，状态:", !!this.graduateStore.schoolFuse);
      if (this.graduateStore.schoolFuse) {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:773", "重新初始化后的Fuse配置:", new UTSJSONObject({
          threshold: this.graduateStore.schoolFuse.options.threshold,
          ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
          items: this.graduateStore.schoolFuse._docs.length
        }));
      }
    }
    if (this.schoolStore && this.majorStore) {
      this.initSchoolAndMajorSearch();
    }
  },
  watch: {
    // 不再需要监听filteredSchoolList计算属性
  }
});
if (!Array) {
  const _component_ChoiceSelected = common_vendor.resolveComponent("ChoiceSelected");
  const _component_template = common_vendor.resolveComponent("template");
  (_component_ChoiceSelected + _component_template)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.formData.nickname,
    b: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    c: $data.formData.gender === "男",
    d: common_vendor.o(($event) => $data.formData.gender = "男"),
    e: $data.formData.gender === "女",
    f: common_vendor.o(($event) => $data.formData.gender = "女"),
    g: $data.formData.phone,
    h: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    i: $data.userRole === "学生"
  }, $data.userRole === "学生" ? {
    j: common_vendor.sr("schoolDropdown", "5ca72b3d-0"),
    k: common_vendor.o($options.handleSchoolSelect),
    l: common_vendor.o($options.handleSchoolSearch),
    m: common_vendor.p({
      componentType: "undergraduate",
      choiceIndex: $data.formData.schoolIndex,
      choiceList: $data.schoolList,
      defaultText: "请选择学校",
      mode: "search",
      searchPlaceholder: "输入学校名称"
    }),
    n: common_vendor.sr("majorDropdown", "5ca72b3d-1"),
    o: common_vendor.o($options.handleMajorSelect),
    p: common_vendor.o($options.handleMajorSearch),
    q: common_vendor.p({
      componentType: "undergraduate",
      choiceIndex: $data.formData.majorIndex,
      choiceList: $data.majorList,
      defaultText: "请选择专业",
      mode: "search",
      searchPlaceholder: "输入专业名称"
    })
  } : {}, {
    r: common_vendor.o($options.handleGradeSelect),
    s: common_vendor.p({
      choiceIndex: $data.formData.gradeIndex,
      choiceList: $options.gradeList,
      defaultText: "请选择年级",
      mode: "select"
    }),
    t: common_vendor.t($data.userRole === "学生" ? "目标学校" : "就读学校"),
    v: common_vendor.sr("targetSchoolDropdown", "5ca72b3d-3"),
    w: common_vendor.o($options.handleTargetSchoolSelect),
    x: common_vendor.o($options.handleTargetSchoolSearch),
    y: common_vendor.o($options.handleSchoolChange),
    z: common_vendor.p({
      componentType: "graduateSchool",
      choiceIndex: $data.formData.targetSchoolIndex,
      choiceList: $data.targetSchoolList,
      defaultText: $data.userRole === "学生" ? "请选择目标学校" : "请选择学校",
      mode: "search",
      searchPlaceholder: $data.userRole === "学生" ? "输入目标学校名称" : "输入学校名称",
      enablePagination: true,
      pageSize: 10
    }),
    A: common_vendor.t($data.userRole === "学生" ? "目标专业" : "就读专业"),
    B: common_vendor.sr("targetMajorDropdown", "5ca72b3d-4"),
    C: common_vendor.o($options.handleTargetMajorSelect),
    D: common_vendor.o($options.handleTargetMajorSearch),
    E: common_vendor.o($options.resetMajorSelection),
    F: common_vendor.p({
      componentType: "graduateMajor",
      choiceIndex: $data.formData.targetMajorIndex,
      choiceList: $data.targetMajorList,
      parentValue: $data.formData.targetSchool,
      isLinkage: true,
      defaultText: $data.formData.targetSchool ? $data.userRole === "学生" ? "请选择专业" : "请选择专业" : "请先选择学校",
      mode: "search",
      searchPlaceholder: $data.userRole === "学生" ? "输入目标专业名称" : "输入专业名称",
      enablePagination: true,
      pageSize: 10
    }),
    G: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    H: $data.showAgreementModal
  }, $data.showAgreementModal ? {
    I: common_vendor.o((...args) => $options.confirmAgreement && $options.confirmAgreement(...args)),
    J: common_vendor.o(() => {
    }),
    K: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  } : {}, {
    L: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ca72b3d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login_detail.js.map
